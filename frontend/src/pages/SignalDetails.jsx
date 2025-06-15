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
  Customized
} from "recharts";

const SignalDetails = () => {
  const { id } = useParams();
  const chartRef = useRef();
  const [signal, setSignal] = useState(null);
  const [activeTab, setActiveTab] = useState("الرسم البياني");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(import.meta.env.VITE_REACT_APP_API_URL + `/api/signals/${id}`);
      const data = await res.json();
      setSignal(data);
    };
    fetchData();
  }, [id]);

  const calculateSMA = (data, period = 3) => {
    return data.map((d, i) => {
      if (i < period - 1) return { ...d, sma: null };
      const avg = data
        .slice(i - period + 1, i + 1)
        .reduce((sum, val) => sum + val.close, 0) / period;
      return { ...d, sma: parseFloat(avg.toFixed(2)) };
    });
  };

  const CandleSticks = ({ points, data }) => {
    return (
      <g>
        {data.map((d, index) => {
          const x = points[index]?.x;
          const candleWidth = 6;
          const openY = points[index]?.payload?.open;
          const closeY = points[index]?.payload?.close;
          const highY = points[index]?.payload?.high;
          const lowY = points[index]?.payload?.low;
          const up = closeY >= openY;

          return (
            <g key={index}>
              <line
                x1={x}
                x2={x}
                y1={points[index].y + (up ? -Math.abs(highY - closeY) : -Math.abs(highY - openY))}
                y2={points[index].y + (up ? Math.abs(lowY - openY) : Math.abs(lowY - closeY))}
                stroke={up ? "#4ade80" : "#f87171"}
              />
              <rect
                x={x - candleWidth / 2}
                y={Math.min(points[index].payload.open, points[index].payload.close)}
                width={candleWidth}
                height={Math.abs(points[index].payload.open - points[index].payload.close)}
                fill={up ? "#4ade80" : "#f87171"}
              />
            </g>
          );
        })}
      </g>
    );
  };

  if (!signal) return <div className="text-center p-10">جاري التحميل...</div>;

  const smaData = calculateSMA(signal.data);
  const minLow = Math.min(...signal.data.map(d => d.low));
  const maxHigh = Math.max(...signal.data.map(d => d.high));

  return (
    <div className="max-w-5xl mx-auto p-4 text-right">
      <h1 className="text-2xl font-bold mb-4">{signal.title}</h1>

      <div className="flex gap-2 justify-end mb-4">
        {["الرسم البياني", "المتوسط المتحرك", "الشموع اليابانية"].map((tab) => (
          <button
            key={tab}
            className={\`px-4 py-1 rounded \${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"}\`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "الرسم البياني" && (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={signal.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[minLow * 0.98, maxHigh * 1.02]} />
            <Tooltip />
            <Legend />
            <Line dataKey="close" stroke="#3b82f6" dot={true} />
          </ComposedChart>
        </ResponsiveContainer>
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
            <Customized component={<CandleSticks />} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SignalDetails;