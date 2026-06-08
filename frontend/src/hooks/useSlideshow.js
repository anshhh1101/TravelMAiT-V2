import { useState, useEffect, useCallback } from 'react';

/**
 * Manages automatic slideshow state with a configurable interval.
 * @param {number} count       - total number of slides
 * @param {number} intervalMs  - ms between auto-advances (default 5000)
 */
export function useSlideshow(count, intervalMs = 5000) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [next, intervalMs]);

  return { current, goTo, next, prev };
}

