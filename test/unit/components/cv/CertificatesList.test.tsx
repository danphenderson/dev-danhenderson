import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CertificatesList } from '../../../../src/components/cv/CertificatesList';

const mockAnimatedContentList = jest.fn();

jest.mock('../../../../src/components/AnimatedContentList', () => ({
  AnimatedContentList: (props: {
    items: unknown[];
    renderItem: (item: unknown, index: number) => ReactNode;
    itemSurface?: string;
    mountItemsOnView?: boolean;
  }) => {
    mockAnimatedContentList(props);

    return (
      <div
        data-testid="certificates-list"
        data-item-surface={props.itemSurface ?? ''}
        data-mount-items-on-view={String(Boolean(props.mountItemsOnView))}
      >
        {props.items.map((item, index) => (
          <div key={index}>{props.renderItem(item, index)}</div>
        ))}
      </div>
    );
  },
}));

describe('CertificatesList', () => {
  afterEach(() => {
    mockAnimatedContentList.mockClear();
  });

  it('renders certificate details and waits for the section to enter view before mounting items', () => {
    render(
      <ThemeProvider>
        <CertificatesList
          certificates={[
            {
              title: 'AWS Certified Developer',
              issuer: 'Amazon Web Services',
              date: 'March 2025',
              link: 'https://example.com/certificate',
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
    expect(screen.getByText('Amazon Web Services issued on March 2025')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Certificate' })).toHaveAttribute(
      'href',
      'https://example.com/certificate'
    );
    expect(screen.getByTestId('certificates-list')).toHaveAttribute('data-item-surface', 'panel');
    expect(screen.getByTestId('certificates-list')).toHaveAttribute(
      'data-mount-items-on-view',
      'true'
    );
  });
});
