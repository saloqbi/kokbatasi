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
import CandleChart from "../components/CandleChart";

const tabs = ["المعلومات", "المتوسط المتحرك", "الشموع اليابانية", "التحليل الفني"];

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

  const hasCandleData = Array.isArray(signal.data) && signal.data[0]?.open;

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

  const detectSupportResistance = (data, tolerance = 1.5) => {
    const levels = [];
    const closePrices = data.map((d) => Number(d.close || d.price)).filter(Boolean);

    for (let i = 2; i < closePrices.length - 2; i++) {
      const prev = closePrices[i - 1];
      const curr = closePrices[i];
      const next = closePrices[i + 1];

      if (curr < prev && curr < next) {
        const exists = levels.some((lvl) => Math.abs(lvl - curr) < tolerance);
        if (!exists) levels.push(curr);
      }

      if (curr > prev && curr > next) {
        const exists = levels.some((lvl) => Math.abs(lvl - curr) < tolerance);
        if (!exists) levels.push(curr);
      }
    }

    return levels.sort((a, b) => b - a);
  };

  const detectHeadAndShoulders = (data) => {
    const prices = data.map((d) => Number(d.close || d.price));
    for (let i = 2; i < prices.length - 2; i++) {
      const left = prices[i - 2];
      const shoulderL = prices[i - 1];
      const head = prices[i];
      const shoulderR = prices[i + 1];
      const right = prices[i + 2];

      const isPattern =
        shoulderL < head &&
        shoulderR < head &&
        Math.abs(shoulderL - shoulderR) < 2 &&
        left < shoulderL &&
        right < shoulderR;

      if (isPattern) return true;
    }
    return false;
  };

  const chartData =
    Array.isArray(signal.data) && signal.data.length > 0
      ? calculateSMA(signal.data)
      : [];

  const getIcon = (rec) => {
    if (rec === "buy") return "📈";
    if (rec === "sell") return "📉";
    return "🔍";
  };

  const hasPattern = detectHeadAndShoulders(chartData);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        {getIcon(signal.recommendation)} {signal.title || "عنوان غير متوفر"}
      </h1>

      <div className="flex space-x-2 rtl:space-x-reverse mb-6">
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

      {/* 📋 تبويب: المعلومات */}
      {activeTab === "المعلومات" && (
        <div className="space-y-2 text-gray-700 dark:text-white">
          <p>💬 <b>نوع التوصية:</b> {signal.recommendation}</p>
          <p>💰 <b>السعر:</b> {signal.price || "غير متوفر"}</p>
          <p>🕒 <b>الوقت:</b> {new Date(signal.createdAt).toLocaleString("ar-EG")}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← رجوع
          </button>
        </div>
      )}

      {/* 📈 تبويب: المتوسط المتحرك */}
      {activeTab === "المتوسط المتحرك" && chartData.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip formatter={(v) => `SAR ${v}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                name="سعر الإغلاق"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="sma"
                name="SMA متوسط متحرك"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🕯️ تبويب: الشموع اليابانية */}
      {activeTab === "الشموع اليابانية" && hasCandleData && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <CandleChart data={signal.data} />
        </div>
      )}

      {/* 🔮 تبويب: التحليل الفني */}
      {activeTab === "التحليل الفني" && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white space-y-4">
          <h4 className="text-lg font-bold">📊 مستويات الدعم والمقاومة</h4>
          {chartData.length === 0 ? (
            <p>لا توجد بيانات كافية للتحليل.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {detectSupportResistance(chartData).map((level, idx) => (
                <li key={idx}>SAR {level.toFixed(2)}</li>
              ))}
            </ul>
          )}

          <h4 className="text-lg font-bold mt-4">🧠 نماذج فنية</h4>
          {hasPattern ? (
            <p className="text-green-600 dark:text-green-400">
              ✅ تم اكتشاف نمط <b>رأس وكتفين</b> في هذه التوصية.
            </p>
          ) : (
            <p className="text-gray-500">لم يتم رصد نماذج فنية واضحة.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SignalDetails;
