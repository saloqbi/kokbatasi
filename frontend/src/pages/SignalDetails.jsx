import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
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

  const getIcon = (rec) => {
    if (rec === "buy") return "📈";
    if (rec === "sell") return "📉";
    return "🔍";
  };

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

      {activeTab === "التحليل الفني" && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white space-y-4">
          {hasCandleData && (
            <div className="w-full h-[250px]">
              <CandleChart data={signal.data} />
            </div>
          )}

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
