
import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 لوحة التحكم</h2>
      <p>عدد الأدوات: 6</p>
      <p>الإشارات الفعالة: 12</p>
      <p>آخر تحديث: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Dashboard;
