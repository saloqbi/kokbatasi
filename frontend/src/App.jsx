
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllSignals from './pages/AllSignals';
import SignalDetails from './pages/SignalDetails';
import { SignalProvider } from './context/SignalContext';

const App = () => (
  <SignalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AllSignals />} />
        <Route path="/signals/:id" element={<SignalDetails />} />
	<Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Router>
  </SignalProvider>
);

export default App;
