import { useLayoutEffect } from 'react';

export default function useScrollToTop(contentKey) {
  useLayoutEffect(() => {
    // Reset after the new content renders, before it is painted. The body can
    // also be the scroll container with the site's mobile overflow styles.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [contentKey]);
}
