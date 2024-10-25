import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(deviceTheme || 'light');

  useEffect(() => {
    if (deviceTheme) {
      setTheme(deviceTheme);
    }
  }, [deviceTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  background: '#F5F5F5',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#5856D6',
  // Add more colors as needed
};

export const darkTheme = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  // Add more colors as needed
};
