import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const res = await fetch('https://kokbatasi.onrender.com/webhook/signals');
        const data = await res.json();
        const match = data.find(sig => sig._id === id);
        setSignal(match);
      } catch (err) {
        console.error("❌ فشل تحميل التوصية:", err);
      }
    };
    fetchSignal();
  }, [id]);

  if (!signal) return <p className="p-4">⏳ جاري تحميل التوصية...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 تفاصيل التوصية</h2>
      <p><strong>📌 العنوان:</strong> {signal.title}</p>
      <p><strong>💡 التوصية:</strong> {signal.recommendation}</p>
      <p><strong>🕒 تم الإنشاء:</strong> {new Date(signal.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default SignalDetails;
