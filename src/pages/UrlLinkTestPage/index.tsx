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

  const [hiddenCount, setHiddenCount] = useState(0);

  const calculateHidden = () => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerWidth = container.offsetWidth;

    let total = 0;
    let visible = 0;

    const children = Array.from(content.children) as HTMLElement[];

    for (let i = 0; i < children.length; i++) {
      const el = children[i];

      const width = el.offsetWidth;
      if (!width) continue;

      total += width;

      if (total <= containerWidth - 48) {
        if (el.classList.contains("url-item")) {
          visible++;
        }
      }
    }

    const count = items.length - visible;
    setHiddenCount(count > 0 ? count : 0);
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
              <span className="url-item-divider"><Divider /></span>
            )}
            <a className="url-item" href={item} target="_blank" rel="noopener noreferrer">{item}</a>
          </Fragment>
        ))}
      </div>

      {/* Fade */}
      {hiddenCount > 0 && <div className="fade-overlay" />}

      {/* +N */}
      {hiddenCount > 0 && (
        <span className="more-overlay">+{hiddenCount}</span>
      )}
    </div>
  );
};

export default UrlLinkTestPage;
