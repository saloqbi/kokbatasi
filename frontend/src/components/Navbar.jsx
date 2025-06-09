import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
      <div className="text-xl font-bold">
        <Link to="/">🌟 كوكبة تاسي</Link>
      </div>
      <div className="space-x-4">
        <Link to="/signals" className="hover:underline">الإشارات</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
