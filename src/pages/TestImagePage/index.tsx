import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import ImageSlider from '../../components/ImageSlider';

const TestImagePage: React.FC = () => {
  const navigate = useNavigate();
  
  const images: string[] = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
  ];

  return (
    <div className="test-image-page">
      <div className="test-image-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-link"
        >
          ← Back to Home
        </button>
        <h1>Test Image Slider</h1>
      </div>
      
      <div className="test-image-content">
        <ImageSlider images={images} />
      </div>
    </div>
  );
};

export default TestImagePage;

