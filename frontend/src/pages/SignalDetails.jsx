import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import DrawingTools from "../components/DrawingTools";
import Tabs from "../components/Tabs";
import ToolSelector from "../tools/ToolSelector";
import { ToolProvider, ToolContext } from "../context/ToolContext";
import { SignalContext } from "../context/SignalContext";
import { detectABCDPatterns } from "../utils/patterns/ABCDPatternDetector";
import { detectHarmonicPatterns } from "../utils/patterns/HarmonicDetector";
import { detectPriceActionPatterns } from "../utils/patterns/PriceActionDetector";
import { subscribeToCandles } from "../utils/websocket";

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
  const [liveData, setLiveData] = useState([]);

  const { activeTool } = useContext(ToolContext); // ✅ تم إضافته هنا
  const apiBase = import.meta.env.VITE_REACT_APP_API_URL;

  const detectFractals = (candles) => {
    const points = [];
    for (let i = 2; i < candles.length - 2; i++) {
      const prev = candles.slice(i - 2, i);
      const next = candles.slice(i + 1, i + 3);
      const curr = candles[i];
      const isTop = prev.every(p => p.high < curr.high) && next.every(n => n.high < curr.high);
      const isBottom = prev.every(p => p.low > curr.low) && next.every(n => n.low < curr.low);
      if (isTop || isBottom) {
        points.push({ index: i, price: isTop ? curr.high : curr.low, type: isTop ? "top" : "bottom" });
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
        const signalData = signalRes.data;
        if (!signalData || !signalData.symbol) throw new Error("❌ التوصية غير صالحة");

        const candles = Array.isArray(signalData.data) && signalData.data.length > 0
          ? signalData.data
          : liveData;

        if (!signalData.data || signalData.data.length === 0) {
          subscribeToCandles(signalData.symbol, (newCandle) => {
            setLiveData(prev => [...prev.slice(-29), newCandle]);
          });
        }

        const fractals = detectFractals(candles);
        const waves = detectElliottWaves(fractals);
        const abcd = detectABCDPatterns(candles);
        const harmonic = detectHarmonicPatterns(candles);
        const priceAction = detectPriceActionPatterns(candles);

        setSignal(signalData);
        setLines(signalData.lines || []);
        setZones(signalData.zones || []);
        setFractals(fractals);
        setWaves(waves);
        setABCDPatterns(abcd);
        setHarmonicPatterns(harmonic);
        setPriceActions(priceAction);
      } catch (err) {
        console.error("❌ فشل تحميل:", err);
        setError("فشل تحميل التوصية.");
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
        lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions,
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions]);

  const combinedData = Array.isArray(signal?.data) ? signal.data : liveData;

  if (loading) return <div>📊 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <ToolProvider>
      <SignalContext.Provider value={{ selectedSignal: signal }}>
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold text-center">
            تفاصيل التوصية: {signal.symbol} ({signal.action})
          </h2>

          <Tabs
            tabs={[
              { key: "candles", label: "الشموع اليابانية" },
              { key: "analysis", label: "📊 التحليل الفني" },
              { key: "draw", label: "✍️ أدوات الرسم" },
            ]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />

          <div className="border rounded-xl p-3 shadow bg-white">
            {selectedTab === "candles" && (
              combinedData.length > 0
                ? <CandlestickChart symbol={signal.symbol} data={combinedData} />
                : <div className="text-yellow-600">⚠️ لا توجد بيانات.</div>
            )}

            {selectedTab === "analysis" && (
              <>
                <TechnicalAnalysisTab lines={lines} zones={zones} />
                <ToolSelector />
              </>
            )}

            {selectedTab === "draw" && (
              <>
                <ToolSelector />
                <DrawingTools
                  activeTool={activeTool} // ✅ تمرير الأداة النشطة
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
