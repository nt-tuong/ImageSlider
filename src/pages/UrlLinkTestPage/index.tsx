import { useRef, useState, useEffect, Fragment } from "react";
import Divider from "../../components/Divider";
import "./index.css";

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

const UrlLinkTestPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hiddenCount, setHiddenCount] = useState<number>(0);
  const [showFade, setShowFade] = useState<boolean>(false);

  const calculateHidden = () => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const containerRect = container.getBoundingClientRect();
    const limit = containerRect.width;

    let visible = 0;
    const children = Array.from(content.children) as HTMLElement[];
    for (const el of children) {
      if (!el.classList.contains("url-item")) continue;

      const rect = el.getBoundingClientRect();
      const itemStart = rect.left - containerRect.left;

      if (itemStart >= limit) break;

      visible++;
    }

    setHiddenCount(items.length - visible);

    const isShowFade = content.scrollWidth > limit;
    setShowFade(isShowFade);
  };

  useEffect(() => {
    calculateHidden();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculateHidden);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={containerRef} className="url-container">
      <div ref={contentRef} className="content">
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className="url-item-divider">
                <Divider />
              </span>
            )}
            <a
              className="url-item"
              href={item}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item}
            </a>
          </Fragment>
        ))}
      </div>

      {/* Fade */}
      {showFade && <div className="fade-overlay" />}

      {/* +N */}
      {hiddenCount > 0 && <span className="more-overlay">...{hiddenCount}件</span>}
    </div>
  );
};

export default UrlLinkTestPage;
