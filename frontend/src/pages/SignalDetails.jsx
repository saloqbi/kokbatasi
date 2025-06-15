// ✅ النسخة النهائية من SignalDetails.jsx تشمل رسم الخطوط والمناطق والدعم الكامل
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
  Bar,
  Legend
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
    const fetchSignal = async () => {
      const res = await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`);
      const data = await res.json();
      setSignal(data);
      setManualLines(data.lines || []);
      setManualZones(data.zones || []);
    };
    fetchSignal();
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

  if (!signal) return <div className="text-center">...جاري التحميل</div>;

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={signal.data} onClick={handleChartClick}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="close" stroke="#0ea5e9" />
        <Bar dataKey="low" fill="#a5b4fc" />
        <Bar dataKey="high" fill="#818cf8" />

        {manualLines.map((line, i) => (
          <ReferenceLine
            key={i}
            y={line.y}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              value: `خط ${i + 1}`,
              position: "right",
              fill: "#ef4444",
            }}
          />
        ))}

        {manualZones.map((zone, i) => (
          <React.Fragment key={i}>
            <ReferenceLine y={zone.from} stroke="#a78bfa" strokeDasharray="3 3" />
            <ReferenceLine y={zone.to} stroke="#a78bfa" strokeDasharray="3 3" />
          </React.Fragment>
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 text-right">
      <h1 className="text-2xl font-bold mb-4">{signal.title}</h1>

      <div className="flex justify-end flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "الرسم البياني" && (
        <>
          <div className="flex gap-2 mb-3">
            <button
              className="bg-yellow-500 text-white px-4 py-1 rounded"
              onClick={() => setIsDrawingLine(true)}
            >
              🎯 رسم خط
            </button>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() => setIsDrawingZone(true)}
            >
              📦 رسم منطقة
            </button>
          </div>
          <div>{renderChart()}</div>
        </>
      )}
    </div>
  );
};

export default SignalDetails;