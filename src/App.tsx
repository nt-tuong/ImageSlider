import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './Router';

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

