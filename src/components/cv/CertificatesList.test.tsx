import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CertificatesList } from './CertificatesList';

jest.mock('../AnimatedContentList', () => ({
  AnimatedContentList: ({
    items,
    renderItem,
  }: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
  }) => <div>{items.map((item, index) => <div key={index}>{renderItem(item, index)}</div>)}</div>,
}));

describe('CertificatesList', () => {
  it('renders certificate title, issuer, and date', () => {
    render(
      <ThemeProvider>
        <CertificatesList
          certificates={[
            { title: 'AWS Solutions Architect', issuer: 'Amazon', date: 'Jan 2024' },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument();
    expect(screen.getByText('Amazon issued on Jan 2024')).toBeInTheDocument();
  });

  it('renders a View Certificate link when certificate has a link', () => {
    render(
      <ThemeProvider>
        <CertificatesList
          certificates={[
            { title: 'CKA', issuer: 'CNCF', date: 'Mar 2024', link: 'https://example.com/cert' },
          ]}
        />
      </ThemeProvider>
    );

    const button = screen.getByRole('link', { name: 'View Certificate' });
    expect(button).toHaveAttribute('href', 'https://example.com/cert');
    expect(button).toHaveAttribute('target', '_blank');
  });

  it('omits View Certificate button when no link is provided', () => {
    render(
      <ThemeProvider>
        <CertificatesList
          certificates={[
            { title: 'Test Cert', issuer: 'Test', date: 'Jan 2024' },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole('link', { name: 'View Certificate' })).not.toBeInTheDocument();
  });
});
