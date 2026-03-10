import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

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
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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
          Nội dung đọc từ public: javascript.js và snippet.js
        </p>
      </header>

      <div className="snippet-list">
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
              <div className="snippet-loading">Đang tải...</div>
            )}
            {errors[id] && (
              <div className="snippet-error">Lỗi: {errors[id]}</div>
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
