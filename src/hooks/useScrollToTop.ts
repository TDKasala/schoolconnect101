import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of page when component mounts
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
