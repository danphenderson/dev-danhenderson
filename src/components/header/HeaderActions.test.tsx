import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../ThemeProvider';
import { HeaderActions } from './HeaderActions';

const renderHeaderActions = (props: Partial<React.ComponentProps<typeof HeaderActions>> = {}) =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <HeaderActions
          iconButtonSize="medium"
          headerIconSx={{ fontSize: 24 }}
          {...props}
        />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('HeaderActions', () => {
  it('renders the avatar button linking to home when showAvatar is true', () => {
    renderHeaderActions({ showAvatar: true, avatarSrc: '/avatar.jpg' });

    expect(screen.getByRole('link', { name: 'Go to home' })).toBeInTheDocument();
    expect(screen.getByAltText('Daniel Henderson')).toBeInTheDocument();
  });

  it('hides the avatar when showAvatar is false', () => {
    renderHeaderActions({ showAvatar: false });

    expect(screen.queryByRole('link', { name: 'Go to home' })).not.toBeInTheDocument();
  });

  it('renders the play button when showAudioControl is true and not playing', () => {
    renderHeaderActions({ showAudioControl: true, isPlaying: false });

    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeInTheDocument();
  });

  it('renders the pause button when playing', () => {
    renderHeaderActions({ showAudioControl: true, isPlaying: true });

    expect(screen.getByRole('button', { name: 'Pause welcome audio' })).toBeInTheDocument();
  });

  it('calls onToggleAudio when the audio button is clicked', () => {
    const onToggleAudio = jest.fn();
    renderHeaderActions({ showAudioControl: true, onToggleAudio });

    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));

    expect(onToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('renders the theme toggle when showThemeControl is true', () => {
    renderHeaderActions({ showThemeControl: true, mode: 'light' });

    expect(screen.getByRole('button', { name: 'Toggle color theme' })).toBeInTheDocument();
  });

  it('calls onToggleTheme when the theme button is clicked', () => {
    const onToggleTheme = jest.fn();
    renderHeaderActions({ showThemeControl: true, onToggleTheme });

    fireEvent.click(screen.getByRole('button', { name: 'Toggle color theme' }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});
