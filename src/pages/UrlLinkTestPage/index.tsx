import { useRef, useState, useEffect, Fragment } from "react";
import "./index.css";
import Divider from "../../components/Divider";
import useVisibleItems from "../hooks/useVisibleItems";
import useFadeByCompare from "../hooks/useFadeByCompare";
import useDynamicFade from "../hooks/useDynamicFade";

interface UrlLinkTestPageProps {
  items: string[];
}

const items = [
  "https://www.google.com",
  "https://www.facebook.com",
  "https://www.twitter.com",
  "https://www.instagram.com",
  "https://www.youtube.com",
  "https://www.linkedin.com",
  "https://www.github.com",
];

const DIVIDER_WIDTH_PX = 1 + 4 + 4;

const UrlLinkTestPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentDisplayRef = useRef<HTMLDivElement>(null);
  const contentMeasureRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLSpanElement>(null);

  const showFade = useFadeByCompare(contentDisplayRef, contentMeasureRef);
  const { visibleCount, measureRefs } = useVisibleItems({
    items,
    containerRef,
    extraSpace: 60,
    dividerWidth: DIVIDER_WIDTH_PX,
  });

  const hiddenCount = items.length - visibleCount;
  const getContentClass = () => {
    const result = ["content"];

    // Check fade effect
    if (showFade) {
      result.push("fade-item-url");
    }

    return result.join(" ").trim();
  };

  useDynamicFade(contentDisplayRef, moreRef);

  return (
    <div ref={containerRef} className="container">
      {/* Div display nội dung cho người xem */}
      <div ref={contentDisplayRef} className={getContentClass()}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className="url-item-divider">
                <Divider />
              </span>
            )}
            <a href={item} className="url-item">
              {item}
            </a>
          </Fragment>
        ))}
      </div>

      {hiddenCount > 0 && <span ref={moreRef} className="more">... +{hiddenCount}件</span>}

      {/* Div hidden để đo chiều dài của các item */}
      <div
        ref={contentMeasureRef}
        className={getContentClass() + " measure-layer"}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className="url-item-divider">
                <Divider />
              </span>
            )}
            <a
              ref={(el) => {
                if (el) measureRefs.current[index] = el;
              }}
              href={item}
              className="url-item"
            >
              {item}
            </a>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default UrlLinkTestPage;
