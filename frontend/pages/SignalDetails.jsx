// ✅ SignalDetails.jsx - نسخة نهائية مدمجة بالكامل مع التحليل الفني + x/y scale
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart_TimeBased from "../components/charts/CandlestickChart_TimeBased_SafeFinal";
import AllDrawingTools from "../tools/AllDrawingTools";
import ToolSelector from "../tools/ToolSelector";
import Sidebar from "../components/Sidebar";
import { ToolProvider } from "../context/ToolContext";
import { SignalContext } from "../context/SignalContext";
import { detectABCDPatterns } from "../utils/patterns/ABCDPatternDetector";
import { detectHarmonicPatterns } from "../utils/patterns/HarmonicDetector";
import { detectPriceActionPatterns } from "../utils/patterns/PriceActionDetector";
import dayjs from "dayjs";

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

  const handleScalesReady = (x, y) => {
    setXScale(() => x);
    setYScale(() => y);
  };

  useEffect(() => {
    const fetchBinanceCandles = async () => {
      try {
        if (!signal?.symbol || !signal.symbol.toUpperCase().includes("USDT")) return;

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${signal.symbol.toUpperCase()}&interval=1m&limit=30`);
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
        if (candles && candles.length > 0) {
          setLiveData(candles);
          setSignal(prev => ({ ...prev, data: candles }));
        }
      });
    }
  }, [signal]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const signalRes = await axios.get(`${apiBase}/api/signals/${id}`);
        const signalData = signalRes.data;
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

const combinedData = Array.isArray(signal?.data) && signal.data.length > 0
  ? signal.data
  : (Array.isArray(liveData) ? liveData : []);

  if (loading) return <div className="text-center p-8 text-gray-300">⏳ جاري التحميل...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <ToolProvider>
      <SignalContext.Provider value={{ selectedSignal: signal }}>
        <div className="flex h-screen text-white bg-[#0f0f0f] flex-row-reverse">
          <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="flex-1 p-4 overflow-auto mr-64">
            <h2 className="text-2xl font-bold text-center text-white bg-[#1a1a1a] py-4 rounded-lg shadow mb-4 tracking-widest">
              📊 تفاصيل التوصية: <span className="text-yellow-400">{signal?.symbol}</span> ({signal?.action})
            </h2>

            <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
              {(selectedTab === "candles" || selectedTab === "draw") && (
                <>
                  {signal?._id && (
                    <CandlestickChart_TimeBased
                      data={combinedData.map(c => ({
                        timestamp: c.time || c.timestamp,
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                      }))}
                      signalId={signal._id}
                      onScalesReady={handleScalesReady}
                    />
                  )}
                  <AllDrawingTools
                    signalId={signal?._id}
                    savedLines={lines}
                    onSaveLines={setLines}
                    xScale={xScale}
                    yScale={yScale}
                    activeTool={activeTool}
                    zones={zones}
                    fractals={fractals}
                    waves={waves}
                    abcdPatterns={abcdPatterns}
                    harmonicPatterns={harmonicPatterns}
                    priceActions={priceActions}
                  />
                </>
              )}

              {selectedTab === "analysis" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-yellow-300 font-bold mb-1">📏 خطوط الاتجاه</h3>
                    <p>{lines.length} خطوط</p>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-green-300 font-bold mb-1">📦 مناطق الدعم/المقاومة</h3>
                    <p>{zones.length} مناطق</p>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-purple-300 font-bold mb-1">🔺 موجات إليوت</h3>
                    <p>{waves.length} نماذج</p>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-blue-300 font-bold mb-1">🧬 نماذج ABCD</h3>
                    <p>{abcdPatterns.length} نماذج</p>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-yellow-300 font-bold mb-1">🎯 Price Action</h3>
                    <p>{priceActions.length} أنماط</p>
                  </div>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 shadow">
                    <h3 className="text-pink-400 font-bold mb-1">🌀 Harmonic</h3>
                    <p>{harmonicPatterns.length} نماذج</p>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <ToolSelector activeTool={activeTool} onToolChange={setActiveTool} />
              </div>
            </div>
          </div>
        </div>
      </SignalContext.Provider>
    </ToolProvider>
  );
};

export default SignalDetails;