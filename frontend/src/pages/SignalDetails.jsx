// النسخة النهائية من SignalDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Legend,
  ReferenceLine,
  LabelList
} from "recharts";

const tabs = ["المعلومات", "المتوسط المتحرك", "الرسم البياني", "الشموع اليابانية", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("المعلومات");
  const [manualLines, setManualLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const chartRef = useRef();

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`
        );
        const data = await response.json();
        setSignal(data);
        setManualLines(data.lines || []);
      } catch (error) {
        console.error("❌ فشل في جلب تفاصيل الإشارة:", error);
      }
    };
    fetchSignal();
  }, [id]);

  const saveLines = async (lines) => {
    try {
      await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}/lines`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
    } catch (err) {
      console.error("❌ فشل في حفظ الخطوط:", err);
    }
  };

  const handleChartClick = (e) => {
    if (!isDrawing || !e?.activePayload) return;
    const y = e.activePayload[0]?.payload?.close;
    if (!y) return;
    const newLines = [...manualLines, { y }];
    setManualLines(newLines);
    saveLines(newLines);
    setIsDrawing(false);
  };

  const handleDrag = (index, deltaY) => {
    const chartHeight = chartRef.current?.offsetHeight || 250;
    const max = Math.max(...signal.data.map(d => d.high));
    const min = Math.min(...signal.data.map(d => d.low));
    const priceRange = max - min;
    const priceDelta = -deltaY / chartHeight * priceRange;
    const updated = [...manualLines];
    updated[index].y = +(updated[index].y + priceDelta).toFixed(2);
    setManualLines(updated);
    saveLines(updated);
  };

  if (!signal) return <div className="text-center text-gray-500 p-10">...جاري التحميل</div>;
  const hasChartData = Array.isArray(signal.data) && signal.data.length > 0;
  const hasCandleData = hasChartData && signal.data[0]?.open !== undefined;

  const getIcon = (rec) => rec === "buy" ? "📈" : rec === "sell" ? "📉" : "🔍";

  const calculateSMA = (data, period = 3) => {
    return data.map((d, i) => {
      const slice = data.slice(Math.max(0, i - period + 1), i + 1);
      const avg = slice.reduce((sum, p) => sum + (p.close || p.price || 0), 0) / slice.length;
      return { ...d, sma: +avg.toFixed(2) };
    });
  };

  const formatArabicDate = (d) => new Date(d).toLocaleString("ar-EG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true
  });

  const chartData = hasChartData ? calculateSMA(signal.data) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-2xl text-right">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center justify-end gap-2">
        {signal.title || "عنوان غير متوفر"} {getIcon(signal.recommendation)}
      </h1>

      <div className="flex flex-wrap justify-end gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "المعلومات" && (
        <div className="space-y-2 text-gray-700 dark:text-white">
          <p>💬 <b>نوع التوصية:</b> {signal.recommendation}</p>
          <p>💰 <b>السعر:</b> {signal.price}</p>
          <p>🕒 <b>الوقت:</b> {formatArabicDate(signal.createdAt)}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">← رجوع</button>
        </div>
      )}

      {activeTab === "المتوسط المتحرك" && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" name="الإغلاق" stroke="#3b82f6" />
            <Line type="monotone" dataKey="sma" name="المتوسط" stroke="#f59e0b" />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "الشموع اليابانية" && hasCandleData && (
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={signal.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Bar dataKey="high" fill="#8884d8" />
            <Bar dataKey="low" fill="#82ca9d" />
            <LabelList dataKey="close" position="top" />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "الرسم البياني" && hasChartData && (
        <div>
          <button onClick={() => setIsDrawing(true)} className="mb-2 px-4 py-1 bg-yellow-500 text-white rounded">🎯 رسم خط</button>
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={signal.data} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />
                <Line dataKey="close" stroke="#0ea5e9" />
                {manualLines.map((line, i) => (
                  <ReferenceLine key={i} y={line.y} stroke="#ef4444" strokeDasharray="3 3"
                    label={{ value: `خط ${i + 1}`, position: "right", fill: "#ef4444" }}
                    ifOverflow="extendDomain"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "التحليل الفني" && (
        <div className="text-gray-800 dark:text-white space-y-2">
          <h4 className="font-bold">📊 تحليل فني ذكي:</h4>
          <ul className="list-disc pl-5">
            <li>✅ نمط رأس وكتفين (اكتشف يدوياً حالياً)</li>
            <li>✅ نمط مثلث صاعد</li>
            <li>🚧 دعم ومقاومة سيتم تفعيله تلقائيًا لاحقًا</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SignalDetails;
