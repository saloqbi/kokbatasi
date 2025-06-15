import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllSignals from './pages/AllSignals';
import AllSignalsPage from './pages/AllSignalsPage'; // ✅ استيراد الصفحة المحسّنة
import SignalDetails from './pages/SignalDetails';
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from './pages/AdminDashboard';
import ManualSignal from "./pages/ManualSignal";
import { SignalProvider } from './context/SignalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <SignalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AllSignals />} />
        <Route path="/signals" element={<AllSignalsPage />} /> {/* ✅ التوجيه الصحيح */}
        <Route path="/signals/:id" element={<SignalDetails />} />
	<Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
	<Route path="/manual-signal" element={<ManualSignal />} />

      </Routes>
      <ToastContainer />
    </Router>
  </SignalProvider>
);

export default App;
