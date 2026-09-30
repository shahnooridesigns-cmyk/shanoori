import { ViewTransition } from 'react';

// Templates re-mount on every navigation (unlike the layout), so the old page can play its
// exit and the new one its enter. Styles for page-enter / page-exit are in globals.css.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
