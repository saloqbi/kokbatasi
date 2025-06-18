import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import DrawingTools from "../components/DrawingTools";
import Tabs from "../components/Tabs";
import ToolSelector from "../tools/ToolSelector";
import { ToolProvider } from "../context/ToolContext";
import { SignalContext } from "../context/SignalContext";
import { detectABCDPatterns } from "../utils/patterns/ABCDPatternDetector";
import { detectHarmonicPatterns } from "../utils/patterns/HarmonicDetector";
import { detectPriceActionPatterns } from "../utils/patterns/PriceActionDetector";
import { subscribeToCandles } from "../utils/websocket"; // ✅ WebSocket دعم

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("candles");
  const [lines, setLines] = useState([]);
  const [zones, setZones] = useState([]);
  const [fractals, setFractals] = useState([]);
  const [waves, setWaves] = useState([]);
  const [abcdPatterns, setABCDPatterns] = useState([]);
  const [harmonicPatterns, setHarmonicPatterns] = useState([]);
  const [priceActions, setPriceActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState([]); // ✅ بيانات الشموع الحية

  const apiBase = import.meta.env.VITE_REACT_APP_API_URL;

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
        let signalData;

        if (id === "mock-harmonic-test") {
          signalData = {
            symbol: "MOCK",
            action: "buy",
            data: [
              { time: "T0", open: 95, high: 97, low: 93, close: 96 },
              { time: "T1", open: 100, high: 105, low: 95, close: 100 },
              { time: "T2", open: 100, high: 108, low: 98, close: 108 },
              { time: "T3", open: 108, high: 104, low: 102, close: 104 },
              { time: "T4", open: 104, high: 110, low: 103, close: 110 },
              { time: "T5", open: 110, high: 102, low: 100, close: 102 },
              { time: "T6", open: 102, high: 105, low: 99, close: 100 },
              { time: "T7", open: 100, high: 101, low: 97, close: 98 },
              { time: "T8", open: 98, high: 100, low: 95, close: 99 }
            ]
          };
        } else {
          const signalRes = await axios.get(`${apiBase}/api/signals/${id}`);
          signalData = typeof signalRes.data === "object" ? signalRes.data : null;
        }

        if (!signalData) throw new Error("❌ التوصية غير موجودة أو غير صالحة.");
        signalData.action = signalData.action || signalData.type?.toLowerCase();
        if (!signalData.symbol) throw new Error("❌ لا يوجد رمز صالح للتوصية.");

        // ✅ إذا لا توجد بيانات، اشترك مع TradingView
        if (!signalData.data || signalData.data.length === 0) {
          subscribeToCandles(signalData.symbol, (newCandle) => {
            setLiveData(prev => {
              const updated = [...prev.slice(-29), newCandle];
              return updated;
            });
          });
        }

        // ✅ اكتشاف الأنماط
        const fractalDetected = detectFractals(signalData.data || []);
        const waveDetected = detectElliottWaves(fractalDetected);
        const abcdDetected = detectABCDPatterns(signalData.data || []);
        const harmonicDetected = detectHarmonicPatterns(signalData.data || []);
        const priceActionDetected = detectPriceActionPatterns(signalData.data || []);

        setSignal(signalData);
        setLines(signalData.lines || []);
        setZones(signalData.zones || []);
        setFractals(fractalDetected);
        setWaves(waveDetected);
        setABCDPatterns(abcdDetected);
        setHarmonicPatterns(harmonicDetected);
        setPriceActions(priceActionDetected);
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
    if (!signal || id === "mock-harmonic-test") return;
    const timeout = setTimeout(() => {
      axios.put(`${apiBase}/api/signals/${id}/drawings`, {
        lines,
        zones,
        fractals,
        waves,
        abcdPatterns,
        harmonicPatterns,
        priceActions
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions]);

  if (loading) return <div>📊 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">❌ {error}</div>;
  if (!signal) return <div>⚠️ لا توجد توصية.</div>;

  const combinedData = signal.data?.length > 0 ? signal.data : liveData;

  return (
    <ToolProvider>
      <SignalContext.Provider value={{ selectedSignal: signal }}>
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold text-center">
            تفاصيل التوصية: {signal.symbol || "?"} ({signal.action || "?"})
          </h2>

          <Tabs
            tabs={[
              { key: "candles", label: "الشموع اليابانية" },
              { key: "analysis", label: "📊 تحليل فني" },
              { key: "draw", label: "✍️ أدوات الرسم" }
            ]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />

          <div className="border rounded-xl p-3 shadow bg-white">
            {selectedTab === "candles" && (
              combinedData.length > 0 ? (
                <CandlestickChart symbol={signal.symbol} data={combinedData} />
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
                  🌀 عدد الفراكتلات: {fractals.length} | 🌊 إليوت: {waves.length} | 🔷 ABCD: {abcdPatterns.length} | 🎯 Harmonic: {harmonicPatterns.length} | ⭐️ Price Action: {priceActions.length}
                </div>
                <ToolSelector />
                <DrawingTools
                  lines={lines}
                  zones={zones}
                  fractals={fractals}
                  waves={waves}
                  abcdPatterns={abcdPatterns}
                  harmonicPatterns={harmonicPatterns}
                  priceActions={priceActions}
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
    </ToolProvider>
  );
};

export default SignalDetails;
