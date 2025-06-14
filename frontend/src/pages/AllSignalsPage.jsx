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
          console.error("❌ البيانات غير متوقعة:", data);
          setSignals([]);
        }
      } catch (error) {
        console.error("❌ خطأ أثناء جلب الإشارات:", error);
        setSignals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📡 جميع التوصيات</h1>

      {loading ? (
        <p>🔄 جاري التحميل...</p>
      ) : signals.length === 0 ? (
        <p>⚠️ لا توجد إشارات متاحة حالياً.</p>
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
