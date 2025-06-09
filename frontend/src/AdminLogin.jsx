
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة أو حدث خطأ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">تسجيل دخول المشرف</h2>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
