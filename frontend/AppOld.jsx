import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AllSignals from "./pages/AllSignalsPage";
import SignalDetails from "./pages/SignalDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllSignals />} />
        <Route path="/signals" element={<AllSignals />} /> {/* ✅ تم إضافته هنا */}
	<Route path="/signals" element={<AllSignalsPage />} />
        <Route path="/signals/:id" element={<SignalDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
