import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllSignalsPage from "./pages/AllSignalsPage";
import AdminDashboard from "./pages/AdminDashboard";
import MACDChart from "./components/MACDChart";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1 className="p-4 text-xl">🏠 الصفحة الرئيسية</h1>} />
        <Route path="/all-signals" element={<AllSignalsPage />} />
        <Route path="/analysis" element={<MACDChart />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
