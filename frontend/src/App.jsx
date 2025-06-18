import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AllSignals from "./pages/AllSignals";
import ManualSignal from "./pages/ManualSignal";
import SignalDetails from "./pages/SignalDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AllSignalsPage from "./pages/AllSignalsPage";
import { SignalProvider } from "./context/SignalContext";
import { ToolProvider } from "./context/ToolContext";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => (
  <SignalProvider>
    <ToolProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AllSignals />} />
          <Route path="/signals" element={<AllSignalsPage />} />
          <Route path="/signals/:id" element={<SignalDetails />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manual-signal" element={<ManualSignal />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ToolProvider>
  </SignalProvider>
);

export default App;
