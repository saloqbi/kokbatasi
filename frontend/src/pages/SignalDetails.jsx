import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`
        );
        const data = await response.json();
        console.log("📍 تفاصيل الإشارة:", data);
        setSignal(data);
      } catch (error) {
        console.error("❌ فشل في جلب تفاصيل الإشارة:", error);
      }
    };

    fetchSignal();
  }, [id]);

  if (!signal) {
    return <div className="text-center text-gray-500 p-10">...جاري التحميل</div>;
  }

  const getIcon = (rec) => {
    const type = rec?.toLowerCase();
    if (type === "buy") return "📈";
    if (type === "sell") return "📉";
    return "🔍";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        {getIcon(signal.recommendation)} {signal.title || "عنوان غير متوفر"}
      </h1>

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            signal.recommendation?.toLowerCase() === "buy"
              ? "bg-green-100 text-green-700"
              : signal.recommendation?.toLowerCase() === "sell"
              ? "bg-red-100 text-red-700"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          {signal.recommendation || "بدون توصية"}
        </span>
      </div>

      <div className="text-gray-700 dark:text-gray-200 mb-2">
        💰 السعر: {signal.price || "غير متوفر"}
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-sm">
        📅 التاريخ: {new Date(signal.createdAt).toLocaleString("ar-EG")}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← رجوع
        </button>
      </div>
    </div>
  );
};

export default SignalDetails;
