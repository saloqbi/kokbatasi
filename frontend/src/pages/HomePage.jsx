
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">مرحباً بك في تطبيق كوكبة تاسي</h1>
      <p className="mb-4">اختر أحد الصفحات:</p>
      <ul className="space-y-2">
        <li>
          <Link to="/signals" className="text-blue-600 hover:underline">
            🚀 عرض الإشارات
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
