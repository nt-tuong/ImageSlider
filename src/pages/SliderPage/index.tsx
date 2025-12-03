import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Slider from '../../components/Slider';
import Switch from '../../components/Switch';

const SliderPage: React.FC = () => {
  const navigate = useNavigate();
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [showNavigation, setShowNavigation] = useState<boolean>(true);
  const [loop, setLoop] = useState<boolean>(true);
  
  const images: string[] = [
    '/assets/images/pexels-cottonbro-10034377.jpg',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
  ];

  useEffect(() => {
    document.title = 'Slider Page';
  }, []);

  return (
    <div className="slider-page">
      {/* <div className="slider-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-link"
        >
          ← Back to Home
        </button>
      </div> */}
      
      {/* <div className="slider-controls">
        <Switch 
          checked={autoPlay}
          onChange={setAutoPlay}
          label="Auto Play"
        />
        <Switch 
          checked={showNavigation}
          onChange={setShowNavigation}
          label="Show Navigation"
        />
        <Switch 
          checked={loop}
          onChange={setLoop}
          label="Loop"
        />
      </div> */}
      
      <div className="slider-content">
        <Slider
          images={images}
          isLoop={loop}
          autoPlay={autoPlay}
          showNavigation={showNavigation}
        />
      </div>
    </div>
  );
};

export default SliderPage;

