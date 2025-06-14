
import React, { useEffect, useState } from 'react';
import { fetchSignals } from '../api/signals';

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignals = async () => {
      try {
        const data = await fetchSignals();
        console.log("📦 Received signals:", data);
        setSignals(data);
      } catch (error) {
        console.error("❌ Failed to load signals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
  }, []);

  if (loading) {
    return <div>جاري تحميل التوصيات...</div>;
  }

  return (
    <div>
      <h1>📡 جميع التوصيات</h1>
      <ul>
        {signals.map((signal, index) => (
          <li key={index}>
            <strong>📌 ID:</strong> {signal._id || '-'}<br />
            <strong>📋 Title:</strong> {signal.title || '-'}<br />
            <strong>💡 Recommendation:</strong> {signal.recommendation || '-'}<br />
            <strong>🕓 Created At:</strong> {signal.createdAt || '-'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllSignalsPage;
