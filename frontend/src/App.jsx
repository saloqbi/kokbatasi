import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/manual-signal" element={<ManualSignal />} />
  <Route path="/signals" element={<AllSignals />} />
</Routes>
    </BrowserRouter>
  );
}


