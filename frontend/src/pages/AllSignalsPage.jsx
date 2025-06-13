
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SignalContext } from "../context/SignalContext";
import axios from "axios";
import useSignalWebSocket from "../websocket/useSignalWebSocket";



const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const { setSelectedSignal } = useContext(SignalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await axios.get("/api/signals");
        setSignals(res.data);
      } catch (err) {
        console.error("Error fetching signals:", err);
      }
    };

    fetchSignals();
  }, []);

  useSignalWebSocket((newSignal) => {
    setSignals((prev) => [newSignal, ...prev]);
  });

  const handleSelect = (signal) => {
    setSelectedSignal(signal);
    navigate("/analysis");
  };

  const generateRandomSignals = async () => {
    try {
      const res = await axios.post("/api/signals/random");
      console.log("✅ Generated:", res.data);
    } catch (err) {
      console.error("❌ Error generating random signals:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📜 كل التوصيات السابقة</h2>
        <button
          onClick={generateRandomSignals}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          🔄 توليد توصيات عشوائية
        </button>
      </div>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">🕒 التاريخ</th>
            <th className="p-2 border">📈 الأصل</th>
            <th className="p-2 border">🎯 السعر</th>
            <th className="p-2 border">📊 نوع التوصية</th>
            <th className="p-2 border">🔎 عرض التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{signal.date}</td>
              <td className="p-2 border">{signal.symbol}</td>
              <td className="p-2 border">{signal.price}</td>
              <td className="p-2 border">{signal.type}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleSelect(signal)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  📊 عرض التحليل
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllSignalsPage;
