import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSignalById } from '../api/api';

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      const data = await getSignalById(id);
      setSignal(data);
    };
    fetchSignal();
  }, [id]);

  if (!signal) return <div className="p-4">جاري التحميل...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📍 تفاصيل التوصية</h2>
      <p><strong>الأصل:</strong> {signal.symbol}</p>
      <p><strong>العملية:</strong> {signal.action}</p>
      <p><strong>السعر:</strong> {signal.price}</p>
    </div>
  );
};

export default SignalDetails;