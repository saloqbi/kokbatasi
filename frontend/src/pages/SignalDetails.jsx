
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CandlestickChart from "../components/CandlestickChart";
import TechnicalAnalysisTab from "../components/TechnicalAnalysisTab";
import DrawingTools from "../components/DrawingTools";
import Tabs from "../components/Tabs";

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("candles");
  const [lines, setLines] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const res = await axios.get(`/api/signals/${id}`);
        setSignal(res.data);
      } catch (err) {
        console.error("فشل في تحميل التوصية:", err);
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

    fetchSignal();
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

  if (!signal) return <div>📊 جاري تحميل التوصية...</div>;

  return (
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
        {selectedTab === "candles" && signal && (
          <CandlestickChart symbol={signal.symbol} />
        )}

        {selectedTab === "analysis" && (
          <TechnicalAnalysisTab lines={lines} zones={zones} />
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
  );
};

export default SignalDetails;
