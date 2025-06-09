import React, { useEffect, useState } from 'react';
import { getAllSignals } from '../services/signalsService';

const SignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const data = await getAllSignals();
        setSignals(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  if (loading) return <p>جارٍ تحميل البيانات...</p>;
  if (error) return <p>❌ حدث خطأ أثناء تحميل الإشارات</p>;

  return (
    <div>
      <h1>📊 الإشارات</h1>
      <ul>
        {signals.map((signal) => (
          <li key={signal._id}>
            <strong>{signal.title}</strong>: {signal.recommendation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignalsPage;
