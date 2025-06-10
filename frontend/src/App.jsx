import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div style={{ fontSize: "24px", padding: "20px" }}>🎉 الصفحة تعمل الآن بنجاح!</div>} />
      </Routes>
    </BrowserRouter>
  );
}
