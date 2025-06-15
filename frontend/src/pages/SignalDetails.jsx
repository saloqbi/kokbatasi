import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  ReferenceLine,
  Legend
} from "recharts";

const tabs = ["المعلومات", "الرسم البياني", "المتوسط المتحرك", "الشموع اليابانية", "التحليل الفني"];

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef();

  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("المعلومات");
  const [manualLines, setManualLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchSignal = async () => {
      const res = await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`);
      const data = await res.json();
      setSignal(data);
      setManualLines(data.lines || []);
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

  const handleChartClick = (e) => {
    if (!isDrawing || !e?.activePayload?.[0]?.payload) return;
    const y = e.activePayload[0].payload.close;
    const updated = [...manualLines, { y }];
    setManualLines(updated);
    saveLines(updated);
    setIsDrawing(false);
  };

  const handleDragLine = (index, deltaY) => {
    const height = chartRef.current?.offsetHeight || 250;
    const max = Math.max(...signal.data.map(d => d.high));
    const min = Math.min(...signal.data.map(d => d.low));
    const range = max - min;
    const deltaValue = -deltaY / height * range;

    const updated = [...manualLines];
    updated[index].y = +(updated[index].y + deltaValue).toFixed(2);
    setManualLines(updated);
    saveLines(updated);
  };
  if (!signal) return <div className="text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-right">
      <h1 className="text-2xl font-bold mb-4">{signal.title}</h1>

      <div className="flex justify-end flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "الرسم البياني" && (
        <>
          <button
            className="mb-2 bg-yellow-500 text-white px-4 py-1 rounded"
            onClick={() => setIsDrawing(true)}
          >🎯 رسم خط</button>

          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={signal.data} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="close" stroke="#0ea5e9" />

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
                    ifOverflow="extendDomain"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
