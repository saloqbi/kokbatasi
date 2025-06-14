import React, { useEffect, useState } from 'react';
import { getSignals } from '../api/signals';
import { Link } from 'react-router-dom';

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSignals();
        console.log("📦 الإشارات المستلمة:", data);
        if (Array.isArray(data)) {
          setSignals(data);
        } else {
          console.warn("⚠️ البيانات غير مصفوفة:", data);
        }
      } catch (error) {
        console.error("❌ فشل جلب الإشارات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6">⏳ جارٍ تحميل التوصيات...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📡 جميع التوصيات</h1>
      {signals.length === 0 ? (
        <p>⚠️ لا توجد إشارات حالياً.</p>
      ) : (
        <ul className="list-disc ml-6">
          {signals.map((signal) => (
            <li key={signal._id}>
              <Link to={`/signals/${signal._id}`} className="text-purple-600 underline">
                📌 العنوان: {signal.title || 'غير متوفر'} - 💡 التوصية: {signal.recommendation || 'غير متوفرة'}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllSignalsPage;
