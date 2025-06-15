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
        console.log("📡 الإشارات المستلمة:", data);
        setSignals(data);
      } catch (error) {
        console.error("❌ فشل في جلب الإشارات:", error);
      }
    };

    fetchSignals();
  }, []);

  const filteredSignals =
    filter === "all"
      ? signals
      : signals.filter((signal) => signal.recommendation?.toLowerCase() === filter);

  const getIcon = (rec) => {
    const type = rec?.toLowerCase();
    if (type === "buy") return "⬆️";
    if (type === "sell") return "⬇️";
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
        {filteredSignals.map((signal) => (
          <Link
            key={signal._id}
            to={`/signals/${signal._id}`}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold truncate text-gray-800 dark:text-white">
                {getIcon(signal.recommendation)} {signal.title || "عنوان غير متوفر"}
              </h2>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  signal.recommendation?.toLowerCase() === "buy"
                    ? "bg-green-100 text-green-700"
                    : signal.recommendation?.toLowerCase() === "sell"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {signal.recommendation || "غير محددة"}
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
