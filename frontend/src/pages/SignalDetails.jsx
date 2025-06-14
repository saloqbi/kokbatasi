
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signals`);
      const data = await res.json();
      const match = data.find(sig => sig._id === id);
      setSignal(match);
    };
    fetchSignal();
  }, [id]);

  if (!signal) return <p className="p-4">⏳ جاري تحميل التوصية...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 تفاصيل التوصية</h2>
      <p><strong>📈 الأصل:</strong> {signal.symbol}</p>
      <p><strong>🎯 العملية:</strong> {signal.action}</p>
      <p><strong>💰 السعر:</strong> {signal.price}</p>
      <p><strong>🧠 النوع:</strong> {signal.type}</p>
      <p><strong>🕒 التاريخ:</strong> {new Date(signal.date).toLocaleString()}</p>
    </div>
  );
};

export default SignalDetails;
