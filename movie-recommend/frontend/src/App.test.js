import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the movie recommender heading', async () => {
  render(<App />);
  const heading = await screen.findByText(/movie recommender/i);
  expect(heading).toBeInTheDocument();
});
