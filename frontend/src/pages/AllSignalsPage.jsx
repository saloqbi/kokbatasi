import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllSignalsPage() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/signals`);
        const data = await response.json();
        console.log("📡 الإشارات المستلمة:", data);

        if (Array.isArray(data)) {
          setSignals(data);
        } else if (Array.isArray(data.data)) {
          setSignals(data.data);
        } else {
          setSignals([]);
        }
      } catch (error) {
        console.error("❌ خطأ في جلب الإشارات:", error);
        setSignals([]);
      }
    }

    fetchSignals();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📡 جميع التوصيات</h1>
      <ul className="list-disc pl-5 space-y-2">
        {signals.length === 0 && <li>لا توجد إشارات متاحة حالياً.</li>}
        {signals.map((signal) => (
          <li key={signal._id}>
            <Link
              to={`/signals/${signal._id}`}
              className="text-purple-700 underline hover:text-purple-900"
            >
              📝 {signal.title || "بدون عنوان"} - 💡 {signal.recommendation || "لا توجد توصية"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllSignalsPage;
