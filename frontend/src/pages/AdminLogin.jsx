import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // كلمة المرور المؤقتة
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          تسجيل دخول المشرف
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
