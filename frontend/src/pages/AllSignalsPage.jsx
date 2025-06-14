import React, { useEffect, useState } from 'react';
import { getSignals } from '../api/signals';

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSignals();
        setSignals(data);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب الإشارات:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h1>📡 جميع التوصيات</h1>
      <ul>
        {signals.map((signal) => (
          <li key={signal._id}>
            <strong>📌 العنوان:</strong> {signal.title} <br />
            <strong>📈 التوصية:</strong> {signal.recommendation} <br />
            <strong>🕒 التاريخ:</strong> {new Date(signal.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllSignalsPage;
