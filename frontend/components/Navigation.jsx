import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav className="p-4 bg-gray-200 flex gap-4">
    <Link to="/" className="font-bold hover:underline">🏠 الرئيسية</Link>
    <Link to="/signals" className="hover:underline">📡 كل الإشارات</Link>
    <Link to="/manual-signal" className="hover:underline">✍️ إدخال توصية</Link>
  </nav>
);

export default Navigation;