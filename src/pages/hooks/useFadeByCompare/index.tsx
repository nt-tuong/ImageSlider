import React, { useEffect, useState } from "react";

const useFadeByCompare = (
  displayRef: React.RefObject<HTMLElement | null>,
  measureRef: React.RefObject<HTMLElement | null>
) => {
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const displayEl = displayRef?.current;
      const measureEl = measureRef?.current;

      if (!displayEl || !measureEl) return;

      const displayWidth = displayEl.offsetWidth;
      const measureWidth = measureEl.scrollWidth;

      // Compare width of measure (full content) vs display (visible content)
      setShowFade(measureWidth > displayWidth);
    };

    calculate();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculate);
    });

    if (displayRef?.current) observer.observe(displayRef.current);
    if (measureRef?.current) observer.observe(measureRef.current);

    return () => observer.disconnect();
  }, []);

  return showFade;
};

export default useFadeByCompare;