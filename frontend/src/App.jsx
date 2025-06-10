import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ManualSignal from './pages/ManualSignal';
import AllSignals from './pages/AllSignals';
import SignalDetails from './pages/SignalDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manual-signal" element={<ManualSignal />} />
        <Route path="/signals" element={<AllSignals />} />
        <Route path="/signals/:id" element={<SignalDetails />} />
      </Routes>
    </BrowserRouter>
  );
}