import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './ThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);