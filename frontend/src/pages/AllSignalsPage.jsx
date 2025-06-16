import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_API_URL + "/api/signals"
        );
        const data = await response.json();
        setSignals(data);
      } catch (error) {
        console.error("❌ فشل في جلب الإشارات:", error);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 10000);
    return () => clearInterval(interval);
  }, []);

  const normalize = (text) => {
    if (!text) return "";
    const val = text.trim().toLowerCase();
    if (val.includes("شراء") || val.includes("buy")) return "buy";
    if (val.includes("بيع") || val.includes("sell")) return "sell";
    return "";
  };

  const filteredSignals =
    filter === "all"
      ? signals
      : signals.filter((signal) => normalize(signal.action || signal.recommendation) === normalize(filter));

  const getIcon = (rec) => {
    const norm = normalize(rec);
    if (norm === "buy") return "⬆️";
    if (norm === "sell") return "⬇️";
    return "🔍";
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span role="img" aria-label="satellite">📡</span> جميع التوصيات
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="all">الكل</option>
          <option value="buy">شراء</option>
          <option value="sell">بيع</option>
        </select>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSignals
          .filter((signal) => signal.symbol)
          .map((signal) => (
            <Link
              key={signal._id}
              to={`/signals/${signal._id}`}
              className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold truncate text-gray-800 dark:text-white">
                  {getIcon(signal.action)} {signal.symbol}
                </h2>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    normalize(signal.action) === "buy"
                      ? "bg-green-100 text-green-700"
                      : normalize(signal.action) === "sell"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {signal.action || "غير محددة"}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                💰 السعر: {signal.price || "غير متوفر"}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                📅 {new Date(signal.createdAt).toLocaleString("ar-EG")}
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default AllSignalsPage;
