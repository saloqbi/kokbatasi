import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignalBoard from "./SignalBoard";
import Login from "./Login"; // تأكد من وجود هذا الملف

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signals" element={<ProtectedRoute><SignalBoard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
