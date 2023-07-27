import { blue, pink, grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ReactNode } from 'react';


const theme = createTheme({
})

// Explicitly define the type of the children prop
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  if (!children) return null; // Handle the null case here
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;