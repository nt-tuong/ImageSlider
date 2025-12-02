import { createBrowserRouter } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import SliderPage from './pages/SliderPage';
import TestChatPage from './pages/TestChatPage';
import ImageSliderPage from './pages/ImageSliderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/slider',
    element: <SliderPage />,
  },
  {
    path: '/test-image',
    element: <ImageSliderPage />,
  },
  {
    path: '/test-chat',
    element: <TestChatPage />,
  },
]);

