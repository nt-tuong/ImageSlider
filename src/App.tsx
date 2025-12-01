import React from 'react';
import './App.css';
import ImageSlider from './components/ImageSlider';
import MessageIcon from './components/icons/MessageIcon';

const App: React.FC = () => {
  // Example images - bạn có thể thay thế bằng URLs hoặc import images của bạn
  const images: string[] = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
  ];

  const handleMessageClick = (): void => {
    console.log('Message icon clicked!');
    // TODO: Implement chat functionality
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Slider Demo</h1>
        <ImageSlider images={images} />
      </header>
      
      {/* Message Icon - Floating Button */}
      <div className="message-icon-container">
        <MessageIcon 
          size={40}
          color="#fff"
          onClick={handleMessageClick}
          className="floating-message-icon"
        />
      </div>
    </div>
  );
};

export default App;

