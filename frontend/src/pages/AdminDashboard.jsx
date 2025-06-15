import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenerateRandomSignalsButton from "../components/GenerateRandomSignalsButton";

const AdminDashboard = () => {
  const [signals, setSignals] = useState([]);
  const navigate = useNavigate();

  // تحقق من الصلاحية
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // جلب التوصيات
  const fetchSignals = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_REACT_APP_API_URL + "/api/signals"
      );
      const data = await response.json();
      setSignals(data);
    } catch (error) {
      console.error("❌ فشل في جلب التوصيات:", error);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // حذف توصية
  const handleDelete = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه التوصية؟");
    if (!confirmed) return;

    try {
      await fetch(
        import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`,
        { method: "DELETE" }
      );
      setSignals(signals.filter((s) => s._id !== id));
    } catch (error) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧑‍⚖️ لوحة تحكم المشرف</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-2">📊 عدد التوصيات</h3>
          <p className="text-3xl font-bold text-blue-600">{signals.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-2">👥 عدد المستخدمين</h3>
          <p className="text-3xl font-bold text-green-600">—</p> {/* placeholder */}
        </div>
      </div>

      <div className="mb-8">
        <GenerateRandomSignalsButton />
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">📋 التوصيات الحالية</h3>
        <ul className="space-y-2">
          {signals.map((signal) => (
            <li key={signal._id} className="flex justify-between items-center border-b pb-2">
              <span>
                <span className="font-semibold">{signal.title}</span> -{" "}
                <span className="text-sm text-gray-500">{signal.recommendation}</span>
              </span>
              <button
                onClick={() => handleDelete(signal._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
