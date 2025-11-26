import './App.css';
import ImageSlider from './components/ImageSlider';

function App() {
  // Example images - bạn có thể thay thế bằng URLs hoặc import images của bạn
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Slider Demo</h1>
        <ImageSlider images={images} />
      </header>
    </div>
  );
}

export default App;
