import React, { createContext, useState } from 'react';
import { Theme } from '../config/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Theme.light);
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === Theme.light ? Theme.dark : Theme.light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
