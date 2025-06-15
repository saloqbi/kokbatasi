import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  ReferenceLine,
  Legend,
  Bar
} from "recharts";

const tabs = ["المعلومات", "الرسم البياني", "المتوسط المتحرك", "الشموع اليابانية", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
  const chartRef = useRef();
  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("المعلومات");
  const [manualLines, setManualLines] = useState([]);
  const [manualZones, setManualZones] = useState([]);
  const [zoneDraft, setZoneDraft] = useState(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [isDrawingZone, setIsDrawingZone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`);
      const data = await res.json();
      setSignal(data);
      setManualLines(data.lines || []);
      setManualZones(data.zones || []);
    };
    fetchData();
  }, [id]);

  const saveLines = async (lines) => {
    await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}/lines`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines }),
    });
  };

  const saveZones = async (zones) => {
    await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}/zones`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zones }),
    });
  };

  const handleChartClick = (e) => {
    if (isDrawingLine && e?.activePayload?.[0]?.payload) {
      const y = e.activePayload[0].payload.close;
      const updated = [...manualLines, { y }];
      setManualLines(updated);
      saveLines(updated);
      setIsDrawingLine(false);
    }

    if (isDrawingZone && e?.activePayload?.[0]?.payload) {
      const y = e.activePayload[0].payload.close;
      if (!zoneDraft) {
        setZoneDraft({ from: y });
      } else {
        const zone = { from: zoneDraft.from, to: y };
        const updated = [...manualZones, zone];
        setManualZones(updated);
        saveZones(updated);
        setZoneDraft(null);
        setIsDrawingZone(false);
      }
    }
  };

  const calculateSMA = (data, period = 3) => {
    return data.map((d, i) => {
      if (i < period - 1) return { ...d, sma: null };
      const avg = data.slice(i - period + 1, i + 1).reduce((sum, val) => sum + val.close, 0) / period;
      return { ...d, sma: +avg.toFixed(2) };
    });
  };

  if (!signal) return <div className="text-center p-10">جاري تحميل التوصية...</div>;

  const smaData = calculateSMA(signal.data);

  return (
    <div className="max-w-5xl mx-auto p-4 text-right">
      <h1 className="text-2xl font-bold mb-4">{signal.title || "توصية بدون عنوان"}</h1>

      <div className="flex flex-wrap gap-2 justify-end mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "المعلومات" && (
        <div className="space-y-2">
          <p>📌 نوع التوصية: <strong>{signal.recommendation}</strong></p>
          <p>💰 السعر: <strong>{signal.price}</strong></p>
          <p>📅 التاريخ: <strong>{new Date(signal.createdAt).toLocaleString("ar-EG")}</strong></p>
        </div>
      )}

      {activeTab === "الرسم البياني" && (
        <>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setIsDrawingLine(true)} className="bg-yellow-500 text-white px-4 py-1 rounded">
              🎯 رسم خط
            </button>
            <button onClick={() => setIsDrawingZone(true)} className="bg-green-600 text-white px-4 py-1 rounded">
              📦 رسم منطقة
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={signal.data} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="close" stroke="#3b82f6" />

              {manualLines.map((line, i) => (
                <ReferenceLine
                  key={i}
                  y={line.y}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: `خط ${i + 1}`, position: "right", fill: "#ef4444" }}
                />
              ))}

              {manualZones.map((zone, i) => (
                <React.Fragment key={i}>
                  <ReferenceLine y={zone.from} stroke="#8b5cf6" strokeDasharray="2 2" />
                  <ReferenceLine y={zone.to} stroke="#8b5cf6" strokeDasharray="2 2" />
                </React.Fragment>
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </>
      )}

      {activeTab === "المتوسط المتحرك" && (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={smaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="close" stroke="#3b82f6" />
            <Line dataKey="sma" stroke="#f59e0b" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "الشموع اليابانية" && (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={signal.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" fill="#f87171" />
            <Bar dataKey="low" fill="#34d399" />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "التحليل الفني" && (
        <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-2">
          <h4 className="font-bold text-lg">📊 تحليل فني</h4>
          <p>✅ عدد الخطوط: {manualLines.length}</p>
          <p>✅ عدد مناطق الدعم/المقاومة: {manualZones.length}</p>
          <ul className="list-disc pl-5">
            <li>نمط رأس وكتفين</li>
            <li>نمط قاع مزدوج</li>
            <li>مناطق تداول ضيقة</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SignalDetails;