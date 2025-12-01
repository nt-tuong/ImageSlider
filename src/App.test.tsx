import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Image Slider Demo', () => {
  render(<App />);
  const headingElement = screen.getByText(/Image Slider Demo/i);
  expect(headingElement).toBeInTheDocument();
});

