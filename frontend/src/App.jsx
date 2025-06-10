
// 📁 src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignalsPage from './pages/SignalsPage';
import AdminSignals from './pages/AdminSignals';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/signals"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <SignalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-signals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSignals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
