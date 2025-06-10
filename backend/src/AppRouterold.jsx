import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignalBoard from "./SignalBoard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignalBoard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;