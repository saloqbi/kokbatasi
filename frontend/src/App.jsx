import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllSignalsPage from './pages/AllSignalsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignalDetailsPage from './pages/SignalDetailsPage';
import ManualSignalPage from './pages/ManualSignalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllSignalsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/signals/:id" element={<SignalDetailsPage />} />
        <Route path="/manual-signal" element={<ManualSignalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
