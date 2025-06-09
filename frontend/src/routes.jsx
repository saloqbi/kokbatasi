import React from "react";
import { Routes, Route } from "react-router-dom";
import NewHome from "./pages/NewHome";
import SignalDetails from "./pages/SignalDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewHome />} />
      <Route path="/signal/:id" element={<SignalDetails />} />
    </Routes>
  );
}
