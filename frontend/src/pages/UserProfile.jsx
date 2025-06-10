import React from 'react';

const UserProfile = () => {
  // مثال على بيانات المستخدم (يمكن ربطها لاحقًا من API)
  const user = {
    name: 'Abdullah Aloqbi',
    email: 'abdullah@example.com',
    role: 'User',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👤 ملف المستخدم</h1>
      <p><strong>الاسم:</strong> {user.name}</p>
      <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
      <p><strong>الدور:</strong> {user.role}</p>
    </div>
  );
};

export default UserProfile;
