import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Index Page";
  }, []);

  return (
    <div className="index-page">
      <div className="index-container">
        <h1>Welcome to Image Slider App</h1>
        <p>Chào mừng bạn đến với ứng dụng Image Slider</p>
        
        <div className="navigation-links">
          {/* <button 
            onClick={() => navigate('/test-image')} 
            className="nav-link"
          >
            Test Image Slider (Old Version)
          </button> */}
          <button 
            onClick={() => navigate('/chat')} 
            className="nav-link"
          >
            Test Chat
          </button>
          <button 
            onClick={() => navigate('/slider')} 
            className="nav-link"
          >
            Test Slider (New Version)
          </button>
          <button 
            onClick={() => navigate('/download-snippet')} 
            className="nav-link"
          >
            Download Snippet
          </button>
          <button 
            onClick={() => navigate('/text-node-test')} 
            className="nav-link"
          >
            Text Node Test (Safari vs Chrome)
          </button>
          <button 
            onClick={() => navigate('/url-link-test')} 
            className="nav-link"
          >
            Url Link Test (Url Link)
          </button>
          <button 
            onClick={() => navigate('/message-helper-sample')} 
            className="nav-link"
          >
            Message Helper Sample
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

