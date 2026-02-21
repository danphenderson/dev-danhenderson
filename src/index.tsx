import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './ThemeProvider';
import { WelcomeAudioProvider } from './WelcomeAudioProvider';
import './styles/print.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <ThemeProvider>
    <WelcomeAudioProvider>
      <App />
    </WelcomeAudioProvider>
  </ThemeProvider>
);
