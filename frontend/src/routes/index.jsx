
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import ManualSignal from "@/pages/ManualSignal";

const AppRoutes = () => (
  <Routes>
    <Route path="/manual-signal" element={<ManualSignal />} />
    {/* يمكنك إضافة المزيد من المسارات هنا */}
  </Routes>
);

export default AppRoutes;
