import { deepOrange, blue, grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ReactNode } from 'react';


const theme = createTheme({
  palette: {
    primary: blue,
    secondary: deepOrange,
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
    background: {
      default: '#eee',
      paper: '#fff',
    },
    divider: grey[300],
  },
  spacing: 4,
  typography: {
    fontFamily: [
      'Roboto',
    ].join(','),
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {},
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
  },
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