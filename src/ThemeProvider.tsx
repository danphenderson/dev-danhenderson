import { deepOrange, blue, grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, SxProps, Theme, useTheme as useMuiTheme } from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

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

export const useCvStyles = () => {
  const theme = useMuiTheme();

  const styles = useMemo(() => {
    const accentColor = theme.palette.primary.main;

    const glassPanelSx: SxProps<Theme> = {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
      border: '1px solid rgba(255,255,255,0.65)',
      boxShadow: '0 20px 80px rgba(15,23,42,0.18)',
      backdropFilter: 'blur(12px)',
    };

    const contentCardSx: SxProps<Theme> = {
      borderRadius: 2,
      border: `1px solid ${theme.palette.primary.light}33`,
      backgroundColor: 'rgba(255,255,255,0.78)',
      boxShadow: '0 10px 40px rgba(15,23,42,0.08)',
      p: { xs: 2, md: 2.5 },
    };

    const overlineSx: SxProps<Theme> = {
      color: accentColor,
      letterSpacing: 2,
      fontWeight: 700,
    };

    const linkStyle = { color: 'inherit', textDecoration: 'none' as const };

    return {
      accentColor,
      glassPanelSx,
      contentCardSx,
      overlineSx,
      linkStyle,
    };
  }, [theme]);

  return styles;
};

export default ThemeProvider;
