import { render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright text with the current year and site link', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    );

    expect(screen.getByText(String(new Date().getFullYear()), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'danhenderson.dev' })).toHaveAttribute(
      'href',
      'https://danhenderson.dev/'
    );
    expect(screen.getByText('Copyright ©', { exact: false })).toBeInTheDocument();
  });
});
