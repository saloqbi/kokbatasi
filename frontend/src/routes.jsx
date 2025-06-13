
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllSignals from './pages/AllSignals';
import SignalDetails from './pages/SignalDetails';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AllSignals />} />
    <Route path="/signals/:id" element={<SignalDetails />} />
  </Routes>
);

export default AppRoutes;
