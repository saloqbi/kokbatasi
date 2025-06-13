
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🚀 كوكبة تاسي</h1>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">📋 التوصيات</Link></li>
        <li><Link to="/analysis" className="hover:underline">📊 التحليل الفني</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
