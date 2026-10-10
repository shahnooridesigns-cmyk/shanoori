import React from 'react';

const ARABIC = /[\u0600-\u06FF]/;

/**
 * A heading's words, each rising into place from behind its own line, one after another (see
 * .rise-word in globals.css). Used for the titles at the top of the inner pages; it plays once
 * when the page opens. Line breaks in the text are kept. `start` offsets the timing when a
 * heading is made of more than one piece.
 *
 * Each word is its own box, and boxes are laid out in the page's direction. So a line with no
 * Arabic in it (a project called "Swan Global" on the Arabic site) is wrapped in a left-to-right
 * box of its own, or its words would come out in reverse order.
 */
export const RiseText = ({ text, start = 0, className }: { text: string; start?: number; className?: string }) => {
  let index = start;
  return (
    <>
      {text.split('\n').map((line, lineIndex) => {
        const words = line.split(/\s+/).filter(Boolean).map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span className="rise-word">
              <span className={className} style={{ '--w': index++ } as React.CSSProperties}>{word}</span>
            </span>
          </React.Fragment>
        ));
        return (
          <React.Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {ARABIC.test(line) ? words : <span dir="ltr" className="inline-block">{words}</span>}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** How many words RiseText will animate for this text, for timing whatever follows it. */
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
