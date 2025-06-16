import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import DrawingTools from "../components/DrawingTools";
import Tabs from "../components/Tabs";
import ToolSelector from "../tools/ToolSelector";
import { SignalContext } from "../context/SignalContext";

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("candles");
  const [lines, setLines] = useState([]);
  const [zones, setZones] = useState([]);
  const [fractals, setFractals] = useState([]);
  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_REACT_APP_API_URL;

  // ✅ تم توسيع مجموعة fallback لتسمح بالكشف عن الفراكتلات والموجات
  const fallbackMock = [
    { time: "2025-06-10", open: 105, high: 110, low: 100, close: 108 },
    { time: "2025-06-11", open: 108, high: 114, low: 107, close: 112 },
    { time: "2025-06-12", open: 112, high: 118, low: 110, close: 116 },
    { time: "2025-06-13", open: 116, high: 120, low: 114, close: 115 },
    { time: "2025-06-14", open: 115, high: 117, low: 111, close: 112 },
    { time: "2025-06-15", open: 112, high: 114, low: 109, close: 110 },
    { time: "2025-06-16", open: 110, high: 113, low: 108, close: 111 },
  ];

  const detectFractals = (candles) => {
    const points = [];
    for (let i = 2; i < candles.length - 2; i++) {
      const prev = candles.slice(i - 2, i);
      const next = candles.slice(i + 1, i + 3);
      const curr = candles[i];
      const isTop = prev.every(p => p.high < curr.high) && next.every(n => n.high < curr.high);
      const isBottom = prev.every(p => p.low > curr.low) && next.every(n => n.low > curr.low);
      if (isTop || isBottom) {
        points.push({ index: i, price: isTop ? curr.high : curr.low, type: isTop ? 'top' : 'bottom' });
      }
    }
    return points;
  };

  const detectElliottWaves = (fractalPoints) => {
    const waves = [];
    if (fractalPoints.length < 5) return waves;
    for (let i = 0; i <= fractalPoints.length - 5; i++) {
      const seq = fractalPoints.slice(i, i + 5);
      waves.push(...seq.map((p, idx) => ({
        label: `${idx + 1}`,
        index: p.index,
        price: p.price
      })));
      break;
    }
    return waves;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const signalRes = await axios.get(`${apiBase}/api/signals/${id}`);
        const signalData = typeof signalRes.data === "object" ? signalRes.data : null;

        if (!signalData) throw new Error("❌ التوصية غير موجودة أو غير صالحة.");
        signalData.action = signalData.action || signalData.type?.toLowerCase();

        if (!signalData.symbol) throw new Error("❌ لا يوجد رمز صالح للتوصية.");

        if (signalData.data?.length > 0) {
          console.log("📊 Using embedded signal data");
        } else {
          try {
            const candlesRes = await axios.get(`${apiBase}/api/candles/${signalData.symbol}`);
            signalData.data = candlesRes.data?.data || fallbackMock;
          } catch {
            signalData.data = fallbackMock;
          }
        }

        const fractalDetected = detectFractals(signalData.data);
        const waveDetected = detectElliottWaves(fractalDetected);

        console.log("🌀 Fractals:", fractalDetected);
        console.log("🌊 Elliott Waves:", waveDetected);

        setSignal(signalData);
        setLines(signalData.lines || []);
        setZones(signalData.zones || []);
        setFractals(fractalDetected);
        setWaves(waveDetected);
      } catch (err) {
        console.error("❌ فشل تحميل التوصية:", err);
        setError("فشل في تحميل البيانات. تأكد من الاتصال ووجود التوصية.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  useEffect(() => {
    if (!signal) return;
    const timeout = setTimeout(() => {
      axios.put(`${apiBase}/api/signals/${id}/drawings`, {
        lines,
        zones,
        fractals,
        waves,
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [lines, zones, fractals, waves]);

  if (loading) return <div>📊 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">❌ {error}</div>;
  if (!signal) return <div>⚠️ لا توجد توصية.</div>;

  return (
    <SignalContext.Provider value={{ selectedSignal: signal }}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-center">
          تفاصيل التوصية: {signal.symbol || "?"} ({signal.action || "?"})
        </h2>

        <Tabs
          tabs={[
            { key: "candles", label: "الشموع اليابانية" },
            { key: "analysis", label: "📊 تحليل فني" },
            { key: "draw", label: "✍️ أدوات الرسم" },
          ]}
          selected={selectedTab}
          onChange={setSelectedTab}
        />

        <div className="border rounded-xl p-3 shadow bg-white">
          {selectedTab === "candles" && (
            signal.data?.length > 0 ? (
              <CandlestickChart symbol={signal.symbol} data={signal.data} />
            ) : (
              <div className="text-yellow-600">⚠️ لا توجد بيانات شموع متاحة لهذا الرمز.</div>
            )
          )}

          {selectedTab === "analysis" && (
            <>
              <TechnicalAnalysisTab lines={lines} zones={zones} />
              <ToolSelector />
            </>
          )}

          {selectedTab === "draw" && (
            <>
              <div className="mb-2 text-sm text-gray-700">
                🌀 عدد الفراكتلات: {fractals.length} | 🌊 عدد موجات إليوت: {waves.length}
              </div>
              <DrawingTools
                lines={lines}
                zones={zones}
                fractals={fractals}
                waves={waves}
                onLinesChange={setLines}
                onZonesChange={setZones}
                onFractalsChange={setFractals}
                onWavesChange={setWaves}
              />
            </>
          )}
        </div>
      </div>
    </SignalContext.Provider>
  );
};

export default SignalDetails;
