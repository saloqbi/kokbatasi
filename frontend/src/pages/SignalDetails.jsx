import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import AllDrawingTools from "../tools/AllDrawingTools";
import Tabs from "../components/Tabs";
import ToolSelector from "../tools/ToolSelector";
import { ToolProvider } from "../context/ToolContext";
import { SignalContext } from "../context/SignalContext";
import { detectABCDPatterns } from "../utils/patterns/ABCDPatternDetector";
import { detectHarmonicPatterns } from "../utils/patterns/HarmonicDetector";
import { detectPriceActionPatterns } from "../utils/patterns/PriceActionDetector";

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
  const [activeTool, setActiveTool] = useState("line");
  const [xScale, setXScale] = useState(null);
  const [yScale, setYScale] = useState(null);

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
    const fetchBinanceCandles = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${signal.symbol.toUpperCase()}USDT&interval=1m&limit=30`);
        const data = await res.json();
        const candles = data.map(d => ({
          time: d[0],
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        setLiveData(candles);
      } catch (err) {
        console.error('فشل في جلب بيانات Binance', err);
      }
    };

    if (signal && (!Array.isArray(signal.data) || signal.data.length === 0)) {
      fetchBinanceCandles().then(candles => {
        setLiveData(candles);
        setSignal(prev => ({ ...prev, data: candles }));
      });
    }
  }, [signal]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const signalRes = await axios.get(`${apiBase}/api/signals/${id}`);
        const signalData = signalRes.data;

        if (!signalData || !signalData.symbol) throw new Error("❌ التوصية غير صالحة");

        const hasData = Array.isArray(signalData.data) && signalData.data.length > 0;
        const candles = hasData ? signalData.data : liveData;

        setSignal(signalData);
        setLines(signalData.lines || signalData.tools?.lines || []);
        setZones(signalData.zones || []);
        setFractals(detectFractals(candles));
        setWaves(detectElliottWaves(detectFractals(candles)));
        setABCDPatterns(detectABCDPatterns(candles));
        setHarmonicPatterns(detectHarmonicPatterns(candles));
        setPriceActions(detectPriceActionPatterns(candles));
      } catch (err) {
        setError("❌ فشل تحميل التوصية");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const combinedData = Array.isArray(signal?.data) && signal.data.length > 0 ? signal.data : liveData;

  if (loading) return <div className="text-center p-8 text-gray-300">⏳ جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <ToolProvider>
      <SignalContext.Provider value={{ selectedSignal: signal }}>
        <div className="flex h-screen text-white bg-[#0f0f0f]">

          <div className="w-64 bg-[#1a1a1a] p-4 border-l border-gray-800">
            <h2 className="text-lg font-bold mb-4 text-center">🔍 قائمة التبويبات</h2>
            <Tabs
              tabs={[
                { key: "candles", label: "الشموع اليابانية" },
                { key: "analysis", label: "📊 تحليل فني" },
                { key: "draw", label: "✍️ أدوات الرسم" }
              ]}
              selected={selectedTab}
              onChange={setSelectedTab}
            />
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <h2 className="text-xl font-bold text-center mb-4">
              تفاصيل التوصية: {signal.symbol} ({signal.action})
            </h2>

            <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
              {(selectedTab === "candles" || selectedTab === "analysis" || selectedTab === "draw") && (
                <CandlestickChart
                  signalId={signal._id}
                  data={combinedData}
                  activeTool={activeTool}
                  lines={lines}
                  setLines={setLines}
                  zones={zones}
                  fractals={fractals}
                  waves={waves}
                  abcdPatterns={abcdPatterns}
                  harmonicPatterns={harmonicPatterns}
                  priceActions={priceActions}
                  onReady={({ xScale, yScale }) => {
                    setXScale(() => xScale);
                    setYScale(() => yScale);
                  }}
                />
              )}

              {selectedTab === "analysis" && (
                <>
                  <TechnicalAnalysisTab lines={lines} zones={zones} />
                  <ToolSelector activeTool={activeTool} onToolChange={setActiveTool} />
                </>
              )}

              {selectedTab === "draw" && (
                <>
                  <AllDrawingTools
                    activeTool={activeTool}
                    lines={lines}
                    setLines={setLines}
                    zones={zones}
                    fractals={fractals}
                    waves={waves}
                    abcdPatterns={abcdPatterns}
                    harmonicPatterns={harmonicPatterns}
                    priceActions={priceActions}
                  />
                  <div className="mt-4">
                    <ToolSelector activeTool={activeTool} onToolChange={setActiveTool} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SignalContext.Provider>
    </ToolProvider>
  );
};

export default SignalDetails;
