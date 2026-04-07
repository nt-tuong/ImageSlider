import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type UseVisibleItemsParams = {
  items: string[];
  containerRef: React.RefObject<HTMLElement | null>;
  extraSpace?: number; // ví dụ: width của "... +N件"
  dividerWidth?: number;
};

const useVisibleItems = ({
  items,
  containerRef,
  extraSpace = 60,
}: UseVisibleItemsParams) => {
  const measureRefs = useRef<HTMLSpanElement[]>([]);
  const [visibleCount, setVisibleCount] = useState(items.length);

  const calculate = () => {
    const container = containerRef?.current;
    if (!container) return;

    let total = 0;
    let count = 0;
    const containerWidth = container.offsetWidth;

    const limit = containerWidth - extraSpace;
    for (let i = 0; i < items.length; i++) {
      const el = measureRefs.current[i];
      if (!el) continue;

      const width = el.offsetWidth;
      if (!width) continue;

      const dividerEl = el.previousElementSibling as HTMLElement;
      const dividerWidth = i > 0 && dividerEl ? dividerEl.offsetWidth : 0;

      const itemStart = total + dividerWidth;
      if (itemStart >= limit) break;
      //   // item bị cắt 1 phần
      //   const itemEnd = itemStart + width;
      //   if (itemStart < limit && itemEnd > limit) break;

      total += dividerWidth + width;
      count++;
    }

    setVisibleCount(count);
  };

  useLayoutEffect(() => {
    calculate();
  }, [items]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculate);
    });

    if (containerRef?.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [items]);

  return {
    visibleCount,
    measureRefs,
  };
};

export default useVisibleItems;
