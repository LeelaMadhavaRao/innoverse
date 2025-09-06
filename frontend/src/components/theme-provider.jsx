import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  const defaultTheme = import.meta.env.VITE_DEFAULT_THEME || 'dark';
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, [defaultTheme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
