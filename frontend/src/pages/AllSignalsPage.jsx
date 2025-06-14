
import React, { useEffect, useState } from "react";
import { getSignals } from "../api/signals";
import { toast } from "react-toastify";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
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

    fetchSignals(); // ✅ استدعاء async داخل useEffect
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (signals.length === 0) {
    return <div>لا توجد توصيات حالياً.</div>;
  }

  return (
    <div>
      <h1>📡 جميع التوصيات</h1>
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
