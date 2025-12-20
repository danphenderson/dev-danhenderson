import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './ThemeProvider';
import { WelcomeAudioProvider } from './WelcomeAudioProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <ThemeProvider>
    <WelcomeAudioProvider>
      <App />
    </WelcomeAudioProvider>
  </ThemeProvider>
);
