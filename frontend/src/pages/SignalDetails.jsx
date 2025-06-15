import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const tabs = ["المعلومات", "المتوسط المتحرك", "الرسم البياني", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("المعلومات");

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

  const hasChartData = Array.isArray(signal.data) && signal.data.length > 0;

  const getIcon = (rec) => {
    if (rec === "buy") return "📈";
    if (rec === "sell") return "📉";
    return "🔍";
  };

  const calculateSMA = (data, period = 3) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - period + 1);
      const slice = data.slice(start, i + 1);
      const sum = slice.reduce((acc, d) => acc + Number(d.close || d.price), 0);
      const avg = sum / slice.length;
      result.push({ ...data[i], sma: avg });
    }
    return result;
  };

  const formatArabicDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const chartData = hasChartData ? calculateSMA(signal.data) : [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-2xl text-right">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center justify-end gap-2">
        {signal.title || "عنوان غير متوفر"} {getIcon(signal.recommendation)}
      </h1>

      <div className="flex flex-wrap justify-end gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "المعلومات" && (
        <div className="space-y-2 text-gray-700 dark:text-white">
          <p>💬 <b>نوع التوصية:</b> {signal.recommendation}</p>
          <p>💰 <b>السعر:</b> {signal.price || "غير متوفر"}</p>
          <p>🕒 <b>الوقت:</b> {formatArabicDate(signal.createdAt)}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← رجوع
          </button>
        </div>
      )}

      {activeTab === "المتوسط المتحرك" && chartData.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                name="سعر الإغلاق"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="sma"
                name="SMA متوسط متحرك"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "الرسم البياني" && hasChartData && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={signal.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                name="سعر الإغلاق"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "التحليل الفني" && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white space-y-4">
          <h4 className="text-lg font-bold">📊 مستويات الدعم والمقاومة</h4>
          <p>سيتم عرض المستويات هنا قريبًا...</p>

          <h4 className="text-lg font-bold mt-4">🧠 نماذج فنية</h4>
          <ul className="list-disc pl-5 text-sm">
            <li>✅ نمط رأس وكتفين</li>
            <li>✅ نمط قاع مزدوج</li>
            <li>✅ نمط مثلث</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SignalDetails;
