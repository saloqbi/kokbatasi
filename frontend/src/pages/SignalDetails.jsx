import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Legend,
  ReferenceLine
} from "recharts";

const tabs = ["المعلومات", "المتوسط المتحرك", "الرسم البياني", "الشموع اليابانية", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("المعلومات");
  const [manualLines, setManualLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

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
  const hasCandleData = hasChartData && signal.data[0]?.open !== undefined;

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

  const handleChartClick = (e) => {
    if (!isDrawing || !e || !e.activeLabel || !e.activePayload) return;
    const y = e.activePayload[0]?.payload?.close || 0;
    setManualLines((prev) => [...prev, { y }]);
    setIsDrawing(false);
  };

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

      {activeTab === "الرسم البياني" && hasChartData && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <button
            onClick={() => setIsDrawing(true)}
            className="mb-2 px-4 py-1 bg-yellow-500 text-white rounded"
          >
            🎯 رسم خط يدوي
          </button>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={signal.data} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" name="سعر الإغلاق" stroke="#10b981" strokeWidth={2} dot={{ r: 1 }} />
              {manualLines.map((line, index) => (
                <ReferenceLine
                  key={index}
                  y={line.y}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: `خط ${index + 1}`, position: "right", fill: "#ef4444" }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* التبويبات الأخرى كما هي */}

    </div>
  );
};

export default SignalDetails;
