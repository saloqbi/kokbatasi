// SignalDetails.jsx ✅ النسخة النهائية الكاملة

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  ReferenceLine,
  Line,
  Rectangle,
  Legend,
  Customized,
} from "recharts";

const tabs = ["المعلومات", "الرسم البياني", "المتوسط المتحرك", "الشموع اليابانية", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
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
      const avg = data
        .slice(i - period + 1, i + 1)
        .reduce((sum, val) => sum + val.close, 0) / period;
      return { ...d, sma: parseFloat(avg.toFixed(2)) };
    });
  };

  const renderCandleSticks = ({ xAxisMap, yAxisMap, offset, data }) => {
    const xMap = Object.values(xAxisMap)[0];
    const yMap = Object.values(yAxisMap)[0];
    const xScale = xMap.scale;
    const yScale = yMap.scale;
    const candleWidth = 8;

    return (
      <g>
        {data.map((d, index) => {
          const x = xScale(d.time);
          const openY = yScale(d.open);
          const closeY = yScale(d.close);
          const highY = yScale(d.high);
          const lowY = yScale(d.low);
          const up = d.close >= d.open;
          const color = up ? "#4ade80" : "#f87171";

          return (
            <g key={index}>
              <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} />
              <rect
                x={x - candleWidth / 2}
                y={Math.min(openY, closeY)}
                width={candleWidth}
                height={Math.abs(closeY - openY)}
                fill={color}
              />
            </g>
          );
        })}
      </g>
    );
  };

  if (!signal) return <div className="text-center p-10">...جاري التحميل</div>;

  const smaData = calculateSMA(signal.data);
  const minLow = Math.min(...signal.data.map(d => d.low));
  const maxHigh = Math.max(...signal.data.map(d => d.high));

  return (
    <div className="max-w-5xl mx-auto p-4 text-right">
      <h1 className="text-2xl font-bold mb-6">{signal.title || "عنوان غير متوفر"}</h1>

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
              <YAxis domain={[minLow * 0.98, maxHigh * 1.02]} />
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
                <Rectangle
                  key={i}
                  y={Math.min(zone.from, zone.to)}
                  height={Math.abs(zone.to - zone.from)}
                  width="100%"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                />
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
            <YAxis domain={[minLow * 0.98, maxHigh * 1.02]} />
            <Tooltip />
            <Legend />
            <Line dataKey="close" stroke="#3b82f6" dot={false} />
            <Line dataKey="sma" stroke="#f59e0b" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "الشموع اليابانية" && (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={signal.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[minLow * 0.98, maxHigh * 1.02]} />
            <Tooltip />
            <Legend />
            <Customized component={(props) => renderCandleSticks({ ...props, data: signal.data })} />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {activeTab === "التحليل الفني" && (
        <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-2">
          <h4 className="font-bold text-lg">📊 تحليل فني</h4>
          <p>✅ عدد الخطوط: {manualLines.length}</p>
          <p>✅ عدد مناطق الدعم/المقاومة: {manualZones.length}</p>
          <ul className="list-disc pl-5 text-sm">
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