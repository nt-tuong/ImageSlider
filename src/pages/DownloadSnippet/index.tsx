import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const DEFAULT_SNIPPET = `
function evaluteDom (xPath){
    return document.evaluate(
                            xPath,
                            document,
                            function (prefix) {
                                if (prefix === "svg" || prefix === "g" || prefix === "path" || prefix === "foreignObject") {
                                    return "http://www.w3.org/2000/svg";
                                } else {
                                    return null;
                                }
                            },
                            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                            null
                        );
}`;

const INJECT_SCRIPT_SNIPPET = `
const script = document.createElement("script");
script.src = "http://192.168.1.84:3001/full-script.js";
script.type = "text/javascript";
document.body.appendChild(script);
`;

const PUBLIC_FILES = [
  { url: '/javascript.js', title: 'javascript.js', id: 'javascript', filename: 'javascript.js' },
  { url: '/snippet.js', title: 'snippet.js', id: 'snippet', filename: 'snippet.js' },
];

const MAX_PREVIEW_LENGTH = 50000;

const DownloadSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Download Snippet';
  }, []);

  useEffect(() => {
    PUBLIC_FILES.forEach(({ url, id }) => {
      setLoading((prev) => ({ ...prev, [id]: true }));
      setErrors((prev) => ({ ...prev, [id]: '' }));
      fetch(process.env.PUBLIC_URL + url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((text) => {
          setFileContents((prev) => ({ ...prev, [id]: text }));
          setLoading((prev) => ({ ...prev, [id]: false }));
        })
        .catch((err) => {
          setErrors((prev) => ({ ...prev, [id]: err.message || 'Failed to load' }));
          setLoading((prev) => ({ ...prev, [id]: false }));
        });
    });
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    const showCopied = () => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showCopied();
        return;
      }
    } catch {
      // Fall through to fallback
    }

    // Fallback for macOS Safari / non-secure context: use execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) showCopied();
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreview = (content: string) => {
    if (content.length <= MAX_PREVIEW_LENGTH) return content;
    return content.slice(0, MAX_PREVIEW_LENGTH) + '\n\n/* ... truncated - use Download to get full file ... */';
  };

  return (
    <div className="download-snippet-page">
      <header className="snippet-header">
        <button
          onClick={() => navigate('/')}
          className="back-link"
        >
          ← Back to Home
        </button>
        <h1>Download Snippet</h1>
        <p className="snippet-subtitle">
          Copy or download the snippet to integrate into your project
        </p>
      </header>

      <div className="snippet-list">
        {/* Default instance snippet */}
        <section className="snippet-card">
          <div className="snippet-card-header">
            <h2>evaluateDom (default)</h2>
            <div className="snippet-actions">
              <button
                className="btn btn-copy"
                onClick={() => copyToClipboard(DEFAULT_SNIPPET, 'default')}
              >
                {copiedId === 'default' ? '✓ Copied' : 'Copy'}
              </button>
              <button
                className="btn btn-download"
                onClick={() => downloadAsFile(DEFAULT_SNIPPET, 'evaluateDom.js')}
              >
                Download
              </button>
            </div>
          </div>
          <pre className="snippet-code">
            <code>{DEFAULT_SNIPPET}</code>
          </pre>
        </section>

        {/* Inject script snippet */}
        <section className="snippet-card">
          <div className="snippet-card-header">
            <h2>Inject script (default)</h2>
            <div className="snippet-actions">
              <button
                className="btn btn-copy"
                onClick={() => copyToClipboard(INJECT_SCRIPT_SNIPPET, 'inject-script')}
              >
                {copiedId === 'inject-script' ? '✓ Copied' : 'Copy'}
              </button>
              {/* <button
                className="btn btn-download"
                onClick={() => downloadAsFile(INJECT_SCRIPT_SNIPPET, 'inject-script.js')}
              >
                Download
              </button> */}
            </div>
          </div>
          <pre className="snippet-code">
            <code>{INJECT_SCRIPT_SNIPPET}</code>
          </pre>
        </section>

        {PUBLIC_FILES.map(({ url, title, id, filename }) => (
          <section key={id} className="snippet-card">
            <div className="snippet-card-header">
              <h2>{title}</h2>
              <div className="snippet-actions">
                <button
                  className="btn btn-copy"
                  disabled={loading[id] || !!errors[id]}
                  onClick={() => copyToClipboard(fileContents[id] ?? '', id)}
                >
                  {copiedId === id ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  className="btn btn-download"
                  disabled={loading[id] || !!errors[id]}
                  onClick={() => downloadAsFile(fileContents[id] ?? '', filename)}
                >
                  Download
                </button>
              </div>
            </div>
            {loading[id] && (
              <div className="snippet-loading">Loading...</div>
            )}
            {errors[id] && (
              <div className="snippet-error">Error: {errors[id]}</div>
            )}
            {!loading[id] && !errors[id] && fileContents[id] !== undefined && (
              <pre className="snippet-code">
                <code>{getPreview(fileContents[id])}</code>
              </pre>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default DownloadSnippetPage;
