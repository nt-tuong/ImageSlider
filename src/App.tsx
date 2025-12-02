import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import SliderPage from './pages/SliderPage';
import TestChatPage from './pages/TestChatPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/test-image" element={<SliderPage />} />
          <Route path="/test-chat" element={<TestChatPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

