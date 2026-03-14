import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HintPopover } from '../../../../src/components/header/HintPopover';

describe('HintPopover', () => {
  it('renders title, body, and dismiss button when open', () => {
    const anchorEl = document.createElement('button');
    document.body.appendChild(anchorEl);

    render(
      <ThemeProvider>
        <HintPopover
          id="test-popover"
          open={true}
          anchorEl={anchorEl}
          title="Hint Title"
          body="Hint body text"
          onClose={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Hint Title')).toBeInTheDocument();
    expect(screen.getByText('Hint body text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Okay' })).toBeInTheDocument();

    document.body.removeChild(anchorEl);
  });

  it('calls onClose when the dismiss button is clicked', () => {
    const anchorEl = document.createElement('button');
    document.body.appendChild(anchorEl);
    const onClose = jest.fn();

    render(
      <ThemeProvider>
        <HintPopover
          id="test-popover"
          open={true}
          anchorEl={anchorEl}
          title="Title"
          body="Body"
          onClose={onClose}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));

    expect(onClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(anchorEl);
  });
});
