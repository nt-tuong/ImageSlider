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
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

