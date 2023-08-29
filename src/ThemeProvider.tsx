import { deepOrange, blue, amber, grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';



const lightTheme = createTheme({
  palette: {
    primary: blue,
    secondary: deepOrange,
    text: {
      primary: grey[900],
      secondary: grey[900],
    },
    background: {
      default: '#eee',
      paper: '#fff',
    },
    divider: grey[300],
  },
  spacing: 10,
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

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // This is important. It instructs MUI to apply dark mode styles
    primary: blue,
    secondary: deepOrange,
    text: {
      primary: grey[100],
      secondary: grey[300],
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
    divider: grey[800],
  },
  spacing: 10,
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


// Create a context for the theme
const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
})


// Explicitly define the type of the children prop
interface ThemeProviderProps extends PropsWithChildren<{}> {}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(lightTheme)

  // Toggles between the light and dark theme
  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme)
  }

  if (!children) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Create a custom hook for easy access to the theme context
export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider;