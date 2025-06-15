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

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
        </select> {/* ✅ تم إغلاق الوسم هنا */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSignals.map((signal) => (
          <Link
            key={signal._id}
            to={`/signals/${signal._id}`}
            className="bg-white dark:bg-gray-800 border shadow-sm rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg truncate">
                {signal.title || "عنوان غير متوفر"}
              </span>
              <span
                className={`text-sm font-bold px-2 py-1 rounded ${
                  signal.recommendation?.toLowerCase() === "buy"
                    ? "bg-green-100 text-green-800"
                    : signal.recommendation?.toLowerCase() === "sell"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {signal.recommendation || "بدون توصية"}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              السعر: {signal.price || "غير متوفر"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-400">
              📅 {new Date(signal.createdAt).toLocaleString("ar-EG")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllSignalsPage;
