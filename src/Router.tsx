import { createBrowserRouter } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import SliderPage from './pages/SliderPage';
import ImageSliderPage from './pages/ImageSliderPage';
import Chat from './pages/Chat';
import DownloadSnippetPage from './pages/DownloadSnippet';
import TextNodeTestPage from './pages/TextNodeTest';
import UrlLinkTestPage from './pages/UrlLinkTestPage';

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
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/download-snippet',
    element: <DownloadSnippetPage />,
  },
  {
    path: '/text-node-test',
    element: <TextNodeTestPage />,
  },
  {
    path: '/url-link-test',
    element: <UrlLinkTestPage />,
  },
]);

