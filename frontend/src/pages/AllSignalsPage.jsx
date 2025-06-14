import React, { useEffect, useState } from "react";
import { getSignals } from "../api/signals";
import { Link } from "react-router-dom";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await getSignals();
        setSignals(response.data); // ✅ هذا هو التعديل المهم
      } catch (error) {
        console.error("Failed to fetch signals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📡 جميع التوصيات</h1>
      {loading ? (
        <p>جاري تحميل التوصيات...</p>
      ) : (
        <ul>
          {signals.map((signal) => (
            <li key={signal._id}>
              <Link to={`/signals/${signal._id}`}>
                {signal.title} - {signal.recommendation} -{" "}
                {new Date(signal.createdAt).toLocaleDateString("ar-EG")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllSignalsPage;
