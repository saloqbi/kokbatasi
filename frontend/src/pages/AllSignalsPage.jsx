import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="satellite">📡</span> جميع التوصيات
      </h1>
      <ul className="list-disc pl-5 space-y-2">
        {signals.map((signal) => (
          <li key={signal._id}>
            <Link
              to={`/signals/${signal._id}`}
              className="text-blue-700 hover:underline"
            >
              {signal.title || "عنوان غير متوفر"} - 💡{" "}
              {signal.recommendation || "توصية غير متوفرة"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllSignalsPage;
