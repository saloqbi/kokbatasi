import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignalDetails from './pages/SignalDetails';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signals/:id" element={<SignalDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
