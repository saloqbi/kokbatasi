
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const signalRes = await axios.get(`/api/signals/${id}`);
        const signalData = signalRes.data;

        // جلب بيانات الشموع من API خارجي (VPS أو ngrok)
        try {
          const candlesRes = await axios.get(`https://kokbatasi.onrender.com/api/candles/${signalData.symbol}`);
          signalData.data = candlesRes.data?.data || [];
        } catch (err) {
          console.warn("⚠️ فشل جلب بيانات الشموع، سيتم استخدام بيانات تجريبية.");
          signalData.data = [
            { time: "2025-06-15T00:00:00Z", open: 100, high: 110, low: 95, close: 105, volume: 12345 },
            { time: "2025-06-15T01:00:00Z", open: 105, high: 115, low: 100, close: 108, volume: 23456 },
            { time: "2025-06-15T02:00:00Z", open: 108, high: 112, low: 104, close: 110, volume: 34567 }
          ];
        }

        setSignal(signalData);
      } catch (err) {
        console.error("❌ فشل تحميل التوصية:", err);
        setError("فشل في تحميل البيانات. تأكد من الاتصال ووجود التوصية.");
      } finally {
        setLoading(false);
      }
    };

    const fetchDrawings = async () => {
      try {
        const res = await axios.get(`/api/drawings/${id}`);
        setLines(res.data.lines || []);
        setZones(res.data.zones || []);
      } catch (err) {
        console.error("فشل في تحميل الرسومات:", err);
      }
    };

    fetchAll();
    fetchDrawings();
  }, [id]);

  const handleLineUpdate = (newLines) => {
    setLines(newLines);
    axios.post(`/api/drawings/${id}`, { lines: newLines, zones });
  };

  const handleZoneUpdate = (newZones) => {
    setZones(newZones);
    axios.post(`/api/drawings/${id}`, { lines, zones: newZones });
  };

  if (loading) return <div>📊 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">❌ {error}</div>;
  if (!signal) return <div>⚠️ لا توجد توصية.</div>;

  return (
    <SignalContext.Provider value={{ selectedSignal: signal }}>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-center">
          تفاصيل التوصية: {signal.symbol || "?"} ({signal.action || "?"})
        </h2>

        <div className="bg-gray-100 p-3 text-sm rounded border">
          <strong>🛠 محتوى التوصية (Debug):</strong>
          <pre>{JSON.stringify(signal, null, 2)}</pre>
        </div>

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
            <DrawingTools
              lines={lines}
              zones={zones}
              onLinesChange={handleLineUpdate}
              onZonesChange={handleZoneUpdate}
            />
          )}
        </div>
      </div>
    </SignalContext.Provider>
  );
};

export default SignalDetails;
