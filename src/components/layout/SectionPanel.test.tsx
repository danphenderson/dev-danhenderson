import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { SectionPanel } from './SectionPanel';

describe('SectionPanel', () => {
  it('renders children with panel styling', () => {
    render(
      <ThemeProvider>
        <SectionPanel data-testid="panel">Panel content</SectionPanel>
      </ThemeProvider>
    );

    expect(screen.getByTestId('panel')).toBeInTheDocument();
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });
});
