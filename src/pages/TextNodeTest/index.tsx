import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

/** Nội dung mẫu nhiều đoạn, nhiều text node trộn lẫn (dùng cho innerHTML) */
const SAMPLE_RICH_HTML = [
  '<p>Đoạn một: dòng đầu.\nDòng thứ hai có xuống dòng.\nVà dòng ba.</p>',
  '<p>Đoạn hai <strong>có chữ in đậm</strong> và lại text thường.\nXuống dòng trong đoạn hai.</p>',
  '<p>Đoạn ba <em>in nghiêng</em> kết hợp <strong>đậm</strong> và <em>nghiêng</em>.</p>',
  '<p>Nhiều xuống dòng:\nA\nB\nC\nD</p>',
].join('');

function escapeForDisplay(str: string): string {
  return str
    .replace(/\n/g, '↵\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

interface NodeInfo {
  type: string;
  tagName?: string;
  value: string;
  length: number;
  children?: NodeInfo[];
}

function NodeItem({ node, depth = 0 }: { node: NodeInfo; depth?: number }) {
  const label = node.tagName ? `${node.type} <${node.tagName}>` : node.type;
  return (
    <li className={depth > 0 ? 'node-tree-child' : ''} style={depth > 0 ? { marginLeft: 8 + depth * 14 } : undefined}>
      <code>[{label}]</code>
      {node.length > 0 && ` length=${node.length}`}
      {node.value !== '(element)' && node.value !== '' && (
        <pre className="node-value">{escapeForDisplay(node.value)}</pre>
      )}
      {node.children && node.children.length > 0 && (
        <ol className="node-list node-tree">
          {node.children.map((child, i) => (
            <NodeItem key={i} node={child} depth={depth + 1} />
          ))}
        </ol>
      )}
    </li>
  );
}

function getBrowserLabel(): string {
  const ua = navigator.userAgent;
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edge/i.test(ua)) return 'Safari';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Chrome|Chromium/i.test(ua)) return 'Chrome';
  return 'Unknown';
}

function collectNodeInfo(node: ChildNode): NodeInfo {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.nodeValue || '';
    return { type: 'TEXT', value, length: value.length };
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const children: NodeInfo[] = [];
    for (let i = 0; i < el.childNodes.length; i++) {
      children.push(collectNodeInfo(el.childNodes[i]));
    }
    return {
      type: 'ELEMENT',
      tagName: el.tagName?.toLowerCase(),
      value: '(element)',
      length: 0,
      children,
    };
  }
  return { type: `(${node.nodeType})`, value: '', length: 0 };
}

interface InspectResult {
  browser: string;
  childNodesCount: number;
  nodes: NodeInfo[];
  textContent: string;
  textContentLength: number;
  innerText: string;
  innerTextLength: number;
  newlinesInTextContent: number;
  newlinesInInnerText: number;
}

const TextNodeTestPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const reactInnerRef = useRef<HTMLDivElement>(null);
  const [inspectResult, setInspectResult] = useState<InspectResult | null>(null);
  const [testMode, setTestMode] = useState<'react' | 'textContent' | 'innerHTML'>('react');

  const runInspect = useCallback(() => {
    if (testMode === 'react') {
      const el = reactInnerRef.current;
      if (!el) return;
      inspectElement(el);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';
    if (testMode === 'textContent') {
      el.textContent = 'Đoạn 1: dòng một\nDòng hai.\n\nĐoạn 2: text thuần.\nXuống dòng.';
    }
    if (testMode === 'innerHTML') {
      el.innerHTML = SAMPLE_RICH_HTML;
    }
    requestAnimationFrame(() => inspectElement(el));
  }, [testMode]);

  function inspectElement(el: HTMLElement) {
    const nodes: NodeInfo[] = [];
    for (let i = 0; i < el.childNodes.length; i++) {
      nodes.push(collectNodeInfo(el.childNodes[i]));
    }
    const textContent = el.textContent || '';
    const innerText = el.innerText || '';
    setInspectResult({
      browser: getBrowserLabel(),
      childNodesCount: el.childNodes.length,
      nodes,
      textContent,
      textContentLength: textContent.length,
      innerText,
      innerTextLength: innerText.length,
      newlinesInTextContent: (textContent.match(/\n/g) || []).length,
      newlinesInInnerText: (innerText.match(/\n/g) || []).length,
    });
  }

  useEffect(() => {
    document.title = 'Text Node Test (Safari vs Chrome/Firefox/Edge)';
  }, []);

  useEffect(() => {
    if (testMode === 'react') {
      // After React renders the child with \n, run inspect on next tick
      const t = setTimeout(runInspect, 100);
      return () => clearTimeout(t);
    }
  }, [testMode, runInspect]);

  return (
    <div className="text-node-test-page">
      <header className="text-node-test-header">
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← Trang chủ
        </button>
        <h1>Test Text Node (xuống dòng)</h1>
        <p className="subtitle">
          {/* {`So sánh cách Safari và Chrome/Firefox/Edge xử lý text node\n\t\t\t\t\t\t\t\ncó ký tự xuống dòng.`} */}
          So sánh cách Safari và Chrome/Firefox/Edge xử lý text node
          <div>có ký tự xuống dòng.</div>
        </p>
      </header>

      <section className="text-node-test-info">
        <h2>Khác biệt theo tài liệu</h2>
        <ul>
          <li><strong>Safari:</strong> Giữ nguyên xuống dòng trong text node.</li>
          <li><strong>Chrome / Firefox / Edge:</strong> Đôi khi xoá hoặc chuẩn hoá xuống dòng.</li>
        </ul>
        <p>Mở trang này trên từng trình duyệt và so sánh kết quả bên dưới.</p>
      </section>

      <section className="text-node-test-controls">
        <h2>Cách đưa text vào DOM</h2>
        <div className="mode-buttons">
          {(['react', 'textContent', 'innerHTML'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`mode-btn ${testMode === mode ? 'active' : ''}`}
              onClick={() => setTestMode(mode)}
            >
              {mode === 'react' && 'React (children với \\n)'}
              {mode === 'textContent' && 'element.textContent = "..."'}
              {mode === 'innerHTML' && 'element.innerHTML = "..."'}
            </button>
          ))}
        </div>
        <button type="button" className="inspect-btn" onClick={runInspect}>
          Chạy kiểm tra (Inspect)
        </button>
      </section>

      <section className="text-node-test-sample">
        <h2>Phần tử mẫu (nhiều đoạn, text node trộn lẫn)</h2>
        <div className="sample-wrapper" ref={containerRef}>
          {testMode === 'react' ? (
            <div className="sample-inner" ref={reactInnerRef}>
              <p>{'Đoạn một: dòng đầu.\nDòng thứ hai có xuống dòng.\nVà dòng ba.'}</p>
              <p>{'Đoạn hai '}<strong>{'có chữ in đậm'}</strong>{' và lại text thường.\nXuống dòng trong đoạn hai.'}</p>
              <p>{'Đoạn ba '}<em>{'in nghiêng'}</em>{' kết hợp '}<strong>{'đậm'}</strong>{' và '}<em>{'nghiêng'}</em>{'.'}</p>
              <p>{'Nhiều xuống dòng:\nA\nB\nC\nD'}</p>
            </div>
          ) : null}
        </div>
        <p className="sample-raw-desc">Mẫu: nhiều đoạn, text trộn với &lt;strong&gt; / &lt;em&gt;, và ký tự xuống dòng (↵).</p>
      </section>

      {inspectResult && (
        <section className="text-node-test-result">
          <h2>Kết quả inspect</h2>
          <p className="browser-badge">Trình duyệt: <strong>{inspectResult.browser}</strong></p>
          <div className="result-grid">
            <div className="result-card">
              <h3>Child nodes</h3>
              <p>Số lượng: <strong>{inspectResult.childNodesCount}</strong></p>
              <ol className="node-list node-tree">
                {inspectResult.nodes.map((node, i) => (
                  <NodeItem key={i} node={node} />
                ))}
              </ol>
            </div>
            <div className="result-card">
              <h3>textContent</h3>
              <p>Số ký tự: {inspectResult.textContentLength} | Số xuống dòng (\\n): {inspectResult.newlinesInTextContent}</p>
              <pre className="value-preview">{escapeForDisplay(inspectResult.textContent)}</pre>
            </div>
            <div className="result-card">
              <h3>innerText</h3>
              <p>Số ký tự: {inspectResult.innerTextLength} | Số xuống dòng (\\n): {inspectResult.newlinesInInnerText}</p>
              <pre className="value-preview">{escapeForDisplay(inspectResult.innerText)}</pre>
            </div>
          </div>
        </section>
      )}

      <section className="text-node-test-note">
        <p>Ghi chú: Ký tự ↵ trong kết quả đại diện cho xuống dòng (\\n). So sánh số lượng text node và số lần xuống dòng giữa Safari và Chrome/Firefox/Edge.</p>
      </section>
    </div>
  );
};

export default TextNodeTestPage;
