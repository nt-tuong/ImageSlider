import React, { useEffect } from "react";

const useDynamicFade = (
  contentRef: React.RefObject<HTMLElement | null>,
  moreRef: React.RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const updateFade = () => {
      const content = contentRef.current;
      const more = moreRef.current;
      if (!content || !more) return;

      const contentWidth = content.offsetWidth;
      const moreWidth = more.offsetWidth;

      // index to start fade
      const fadeStartPx = contentWidth - moreWidth - 8;

      const percent = (fadeStartPx / contentWidth) * 100;

      content.style.setProperty("--fade-start", `${percent}%`);
    };

    updateFade();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateFade);
    });

    if (contentRef.current) observer.observe(contentRef.current);
    if (moreRef.current) observer.observe(moreRef.current);

    return () => observer.disconnect();
  }, []);
};

export default useDynamicFade;