import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllSignals from "./pages/AllSignals";
import ManualSignal from "./pages/ManualSignal";
import SignalDetails from "./pages/SignalDetails";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signals" element={<AllSignals />} />
        <Route path="/manual-signal" element={<ManualSignal />} />
        <Route path="/signals/:id" element={<SignalDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
