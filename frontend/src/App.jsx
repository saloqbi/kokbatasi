import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './index'; // هذا هو ملف routes الذي يحتوي على <Routes>

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
