import { getCloudflareContext } from '@opennextjs/cloudflare';
import { FALLBACK_CONTACT } from '@/lib/constants';

/**
 * Contact form endpoint. Emails the enquiry to the business inbox (reply-to set to the
 * customer, so hitting Reply answers them) and sends the customer a confirmation.
 *
 * Needs the RESEND_API_KEY secret (Cloudflare Worker secret in production, .dev.vars
 * locally). Optional: CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 */

const PROJECT_TYPES = [
  'Civil Construction',
  'Interior & Fit-Out',
  'Commercial Spaces',
  'Retail Fit-Out',
  'Hospitality Spaces',
  'MEP Works',
  'Turnkey Contracting',
];

// Humans take a few seconds to fill the form; bots submit instantly. Measured on the
// visitor's device (elapsedMs), so a wrong device clock can't make a person look like a bot.
const MIN_FILL_MS = 3000;

// Best-effort flood guard. Isolates are short-lived and not shared, so this only
// slows down bursts; it isn't a hard limit.
const recent = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

const isRateLimited = (key: string, max = RATE_MAX) => {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 1000) recent.clear();
  return hits.length > max;
};

/**
 * Worker secrets/vars. `next dev` only exposes .dev.vars through the Cloudflare context
 * (production also mirrors them into process.env), so read the context first.
 */
const loadEnv = async () => {
  let env: Record<string, unknown> = {};
  try {
    env = (await getCloudflareContext({ async: true })).env as unknown as Record<string, unknown>;
  } catch {
    // No Cloudflare context (e.g. plain `next start`); fall back to process.env
  }
  return (name: string) => {
    const value = env[name];
    return (typeof value === 'string' && value) || process.env[name] || undefined;
  };
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Line breaks are flattened so a value can't spill into email headers such as the subject
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '');
const cleanMultiline = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

type Enquiry = { name: string; phone: string; email: string; projectType: string; details: string };

const validate = (body: Record<string, unknown>): Enquiry | string => {
  const enquiry = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 20),
    email: clean(body.email, 150),
    projectType: clean(body.projectType, 50),
    details: cleanMultiline(body.details, 2000),
  };
  if (!enquiry.name) return 'Please enter your name.';
  if (!/^[0-9 ]{7,15}$/.test(enquiry.phone)) return 'Please enter a valid Qatar phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return 'Please enter a valid email address.';
  if (!PROJECT_TYPES.includes(enquiry.projectType)) return 'Please choose a project type.';
  return enquiry;
};

const sendEmail = async (apiKey: string, payload: Record<string, unknown>) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
};

const row = (label: string, value: string) =>
  `<tr><td style="padding:10px 16px;color:#57132D;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:10px 16px;color:#0A0A0A">${value}</td></tr>`;

const wrap = (inner: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;background:#F8F1E4;padding:24px"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#57132D;color:#E4D4A3;padding:20px 24px;font-size:18px;font-weight:600">SN Creatives · Shah Noori</div><div style="padding:24px">${inner}</div></div></div>`;

/**
 * A plain page for submissions made before the page's JavaScript loaded (the form falls back
 * to a native POST). Normal submissions get JSON.
 */
const htmlPage = (title: string, message: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Shah Noori</title></head>` +
      `<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#F8F1E4;color:#0A0A0A;display:grid;place-items:center;min-height:100vh;padding:24px">` +
      `<main style="max-width:480px;text-align:center"><h1 style="color:#57132D">${title}</h1><p style="line-height:1.6">${message}</p>` +
      `<p><a href="/contact" style="color:#57132D;font-weight:600">Back to the contact page</a></p></main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

export async function POST(request: Request) {
  const isFormPost = (request.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded');
  let body: Record<string, unknown>;
  try {
    body = isFormPost ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const reply = (ok: boolean, error = '', status = 200) => {
    if (!isFormPost) return Response.json(ok ? { ok: true } : { error }, { status });
    return ok
      ? htmlPage('Thank you', 'Your enquiry has been sent. Our team will get back to you shortly.')
      : htmlPage('Something went wrong', escapeHtml(error), status);
  };

  // Spam traps: a hidden field only bots fill in, and a too-fast submission (not checked for
  // native form posts, which carry no timing). Answer "ok" so bots don't learn they were caught.
  const elapsedMs = Number(body.elapsedMs);
  if (clean(body.sn_trap, 200) || (!isFormPost && !(elapsedMs >= MIN_FILL_MS))) {
    return reply(true);
  }

  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return reply(false, 'Too many enquiries. Please try again later or contact us on WhatsApp.', 429);
  }

  const result = validate(body);
  if (typeof result === 'string') return reply(false, result, 400);
  const enquiry = result;

  const env = await loadEnv();
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set');
    return reply(false, 'The form is temporarily unavailable. Please contact us on WhatsApp.', 503);
  }
  const to = env('CONTACT_TO_EMAIL') || FALLBACK_CONTACT.email;
  const from = env('CONTACT_FROM_EMAIL') || 'SN Creatives Website <website@sncreatives.com>';

  const e = {
    name: escapeHtml(enquiry.name),
    phone: escapeHtml(`+974 ${enquiry.phone}`),
    email: escapeHtml(enquiry.email),
    projectType: escapeHtml(enquiry.projectType),
    details: escapeHtml(enquiry.details).replace(/\n/g, '<br>'),
  };

  try {
    await sendEmail(apiKey, {
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `New enquiry: ${enquiry.projectType} — ${enquiry.name}`,
      html: wrap(
        `<p style="margin:0 0 16px;font-size:16px;color:#0A0A0A">New project consultation request from the website.</p>
         <table style="width:100%;border-collapse:collapse;background:#F8F1E4;border-radius:12px">
           ${row('Name', e.name)}${row('Phone', `<a href="tel:+974${escapeHtml(enquiry.phone.replace(/\s/g, ''))}">${e.phone}</a>`)}
           ${row('Email', `<a href="mailto:${e.email}">${e.email}</a>`)}${row('Project type', e.projectType)}
           ${row('Details', e.details || '<span style="color:#888">Not provided</span>')}
         </table>
         <p style="margin:16px 0 0;font-size:13px;color:#666">Reply to this email to answer ${e.name} directly.</p>`
      ),
      text: `New enquiry from the website\n\nName: ${enquiry.name}\nPhone: +974 ${enquiry.phone}\nEmail: ${enquiry.email}\nProject type: ${enquiry.projectType}\n\n${enquiry.details}`,
    });
  } catch (err) {
    console.error('Contact form: failed to send enquiry', err);
    return reply(false, 'We could not send your enquiry. Please try again or contact us on WhatsApp.', 502);
  }

  // The enquiry is delivered; the confirmation is a courtesy, so its failure isn't the visitor's
  // problem. It goes to an address anyone can type in, so it carries no visitor-supplied text
  // (nothing a spammer could inject) and goes at most once per address per window.
  if (isRateLimited(`confirm:${enquiry.email.toLowerCase()}`, 1)) return reply(true);
  try {
    await sendEmail(apiKey, {
      from,
      to: [enquiry.email],
      reply_to: to,
      subject: 'We received your project enquiry — SN Creatives',
      html: wrap(
        `<p style="margin:0 0 12px;font-size:16px;color:#0A0A0A">Hello,</p>
         <p style="margin:0 0 12px;color:#333;line-height:1.6">Thank you for contacting Shah Noori. We have received your <strong>${e.projectType}</strong> enquiry and our team will get back to you shortly.</p>
         <p style="margin:0 0 12px;color:#333;line-height:1.6">If it's urgent, just reply to this email or message us on WhatsApp.</p>
         <p style="margin:16px 0 0;color:#57132D;font-weight:600">SN Creatives · Shah Noori<br><span style="font-weight:400;color:#666">Doha, Qatar</span></p>`
      ),
      text: `Hello,\n\nThank you for contacting Shah Noori. We have received your ${enquiry.projectType} enquiry and our team will get back to you shortly.\n\nSN Creatives · Shah Noori`,
    });
  } catch (err) {
    console.error('Contact form: confirmation email failed', err);
  }

  return reply(true);
}
