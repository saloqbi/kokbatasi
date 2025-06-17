import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import DrawingTools from "../components/DrawingTools";
import Tabs from "../components/Tabs";
import ToolSelector from "../tools/ToolSelector";
import { SignalContext } from "../context/SignalContext";
import { detectABCDPatterns } from "../utils/patterns/ABCDPatternDetector";
import { detectHarmonicPatterns } from "../utils/patterns/HarmonicDetector";
import { detectPriceActionPatterns } from "../utils/patterns/PriceActionDetector"; // ✅ جديد

const SignalDetails = () => {
  const { id } = useParams();
  const { activeTool } = useContext(ToolContext);
  const [signalData, setSignalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("chart");

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        setLoading(true);

        // بيانات وهمية عند id خاص
        if (id === "mock-harmonic-test") {
          setSignalData({
            symbol: "TEST",
            timeframe: "1h",
            candles: [],
            lines: [{ price: 101 }, { price: 99 }],
            zones: [{ from: 100, to: 98 }, { from: 95, to: 92 }],
            fractals: [
              { index: 1, price: 102, type: "top" },
              { index: 3, price: 97, type: "bottom" }
            ],
            waves: [
              { index: 1, price: 100, label: "1" },
              { index: 2, price: 104, label: "2" },
              { index: 3, price: 99, label: "3" }
            ],
            abcdPatterns: [
              {
                direction: "bullish",
                points: {
                  A: { index: 1, price: 100 },
                  B: { index: 2, price: 105 },
                  C: { index: 3, price: 102 },
                  D: { index: 4, price: 108 }
                }
              }
            ],
            harmonicPatterns: [
              {
                name: "Gartley",
                direction: "bullish",
                points: {
                  X: { index: 0, price: 100 },
                  A: { index: 1, price: 110 },
                  B: { index: 2, price: 105 },
                  C: { index: 3, price: 108 },
                  D: { index: 4, price: 103 }
                }
              }
            ],
            priceActions: [
              { index: 2, type: "Doji", direction: "neutral" },
              { index: 4, type: "Engulfing", direction: "bullish" }
            ]
          });
        } else {
          const res = await axios.get(`/api/signals/${id}`);
          setSignalData(res.data);
        }
      } catch (err) {
        setError("فشل في تحميل البيانات. تأكد من الاتصال");
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
  }, [id]);

  if (loading) return <div>📡 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">❌ {error}</div>;
  if (!signalData) return <div>🚫 لا توجد بيانات</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 تفاصيل الإشارة ({signalData.symbol})</h2>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "chart" && (
        <CandlestickChart symbol={signalData.symbol} candles={signalData.candles} />
      )}

      {activeTab === "analysis" && (
        <TechnicalAnalysisTab
          fractals={signalData.fractals}
          waves={signalData.waves}
          abcdPatterns={signalData.abcdPatterns}
          harmonicPatterns={signalData.harmonicPatterns}
          priceActions={signalData.priceActions}
        />
      )}

      {activeTab === "draw" && (
        <>
          <ToolSelector />
          <DrawingTools
            lines={signalData.lines}
            zones={signalData.zones}
            fractals={signalData.fractals}
            waves={signalData.waves}
            abcdPatterns={signalData.abcdPatterns}
            harmonicPatterns={signalData.harmonicPatterns}
            priceActions={signalData.priceActions}
          />
        </>
      )}
    </div>
  );
};

export default SignalDetails;
