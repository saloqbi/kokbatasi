
import React, { useEffect, useState } from "react";
import { getSignals } from "../api/signals";
import { toast } from "react-toastify";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSignals();
        setSignals(data);
      } catch (error) {
        console.error("فشل في جلب الإشارات:", error);
        toast.error("حدث خطأ أثناء تحميل التوصيات.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // ✅ استدعاء الدالة async من داخل useEffect
  }, []);

  if (loading) {
    return <div>⏳ جاري تحميل التوصيات...</div>;
  }

  if (signals.length === 0) {
    return <div>📭 لا توجد توصيات حالياً.</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>📡 جميع التوصيات</h1>
      <ul>
        {signals.map((signal) => (
          <li key={signal._id}>
            <strong>{signal.symbol}</strong> — {signal.action} @ {signal.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllSignalsPage;
