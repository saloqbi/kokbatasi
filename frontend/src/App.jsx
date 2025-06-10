import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './index';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}