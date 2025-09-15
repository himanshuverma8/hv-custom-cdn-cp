'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`} 
        />
      </div>
      
      {/* Liquid glass effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent dark:from-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </button>
  );
}
