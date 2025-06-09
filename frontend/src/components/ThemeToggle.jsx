import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-sm rounded bg-gray-300 dark:bg-gray-700"
    >
      {theme === 'dark' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي'}
    </button>
  );
}
