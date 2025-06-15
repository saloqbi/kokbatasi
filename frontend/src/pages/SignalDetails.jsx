import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

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
        setSignal(data);
      } catch (error) {
        console.error("❌ فشل في جلب تفاصيل الإشارة:", error);
      }
    };

    fetchSignal();
  }, [id]);

  if (!signal) return <div className="text-center text-gray-500 p-10">...جاري التحميل</div>;

  // بيانات تجريبية للرسم (يمكن لاحقًا جلبها من backend أو من signal.data)
  const chartData = [
    { time: "09:00", price: signal.price - 10 },
    { time: "10:00", price: signal.price - 5 },
    { time: "11:00", price: signal.price },
    { time: "12:00", price: signal.price + 8 },
    { time: "13:00", price: signal.price + 4 },
  ];

  const getIcon = (rec) => {
    if (rec === "buy") return "📈";
    if (rec === "sell") return "📉";
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
            signal.recommendation === "buy"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {signal.recommendation}
        </span>
      </div>

      <div className="text-gray-700 dark:text-gray-200 mb-2">
        💰 السعر: {signal.price || "غير متوفر"}
      </div>

      <div className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        📅 التاريخ: {new Date(signal.createdAt).toLocaleString("ar-EG")}
      </div>

      {/* 🟢 الرسم البياني */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        الرسم البياني للسعر
      </h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
