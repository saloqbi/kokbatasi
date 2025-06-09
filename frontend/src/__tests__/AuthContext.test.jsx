import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { describe, it, expect } from 'vitest';
import React from 'react';

function TestComponent() {
  const { user, setUser } = useAuth();
  return (
    <div>
      <div>{user ? `مرحبًا ${user.name}` : 'لا يوجد مستخدم'}</div>
      <button onClick={() => setUser({ name: 'Shadi' })}>تسجيل دخول</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('should render without user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText(/لا يوجد مستخدم/i)).toBeInTheDocument();
  });

  it('should update and show user after login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const button = screen.getByText('تسجيل دخول');
    button.click();
    expect(await screen.findByText('مرحبًا Shadi')).toBeInTheDocument();
  });
});
