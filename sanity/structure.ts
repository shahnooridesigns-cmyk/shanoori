import type { StructureBuilder, StructureResolver } from 'sanity/structure';

/** One fixed document per page (its _id is the type name), opened straight from the sidebar. */
const singleton = (S: StructureBuilder, type: string, title: string, icon: string) =>
  S.listItem()
    .id(type)
    .title(title)
    .icon(() => icon)
    .child(S.document().schemaType(type).documentId(type).title(title).initialValueTemplate(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shah Noori')
    .items([
      S.documentTypeListItem('project').title('Projects').icon(() => '🏗️'),
      S.documentTypeListItem('client').title('Clients').icon(() => '🤝'),
      S.documentTypeListItem('review').title('Testimonials').icon(() => '⭐'),
      S.divider(),
      singleton(S, 'homePage', 'Home Page', '🏠'),
      singleton(S, 'aboutPage', 'About Page', '📖'),
      singleton(S, 'servicesPage', 'Services Page', '🛠️'),
      singleton(S, 'projectsPage', 'Projects Page', '🖼️'),
      singleton(S, 'contactPage', 'Contact Page', '✉️'),
      singleton(S, 'sharedContent', 'Shared Content (FAQ, banner, services)', '🧩'),
      S.divider(),
      // The Arabic wording of each page (sncreatives.com/ar). Photos are set on the English forms.
      S.listItem()
        .id('arabic')
        .title('Arabic text (عربي)')
        .icon(() => '🌙')
        .child(
          S.list()
            .title('Arabic text')
            .items([
              singleton(S, 'homePageAr', 'Home Page (Arabic)', '🏠'),
              singleton(S, 'aboutPageAr', 'About Page (Arabic)', '📖'),
              singleton(S, 'servicesPageAr', 'Services Page (Arabic)', '🛠️'),
              singleton(S, 'projectsPageAr', 'Projects Page (Arabic)', '🖼️'),
              singleton(S, 'contactPageAr', 'Contact Page (Arabic)', '✉️'),
              singleton(S, 'sharedContentAr', 'Shared Content (Arabic)', '🧩'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('siteSettings').title('Site Settings').icon(() => '⚙️'),
    ]);
