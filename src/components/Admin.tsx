import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '../ThemeProvider';

const ThemeToggleButton = () => {
  const { toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>Toggle Theme</Button>
  )
}

export default ThemeToggleButton;