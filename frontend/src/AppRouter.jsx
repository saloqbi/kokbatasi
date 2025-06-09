
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignalsPage from './pages/SignalsPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signals" element={<SignalsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
