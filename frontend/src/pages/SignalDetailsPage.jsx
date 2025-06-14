
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

function SignalDetailsPage() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await fetch(`${API_URL}/api/signals/${id}`);
        const data = await response.json();
        setSignal(data);
      } catch (error) {
        console.error("خطأ في جلب تفاصيل التوصية:", error);
      }
    };
    fetchSignal();
  }, [id]);

  if (!signal) {
    return <div>جاري تحميل التفاصيل...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">تفاصيل التوصية</h1>
      <p><strong>المعرف:</strong> {signal._id}</p>
      <p><strong>الأصل:</strong> {signal.symbol}</p>
      <p><strong>الإجراء:</strong> {signal.action}</p>
      <p><strong>السعر:</strong> {signal.price}</p>
      <p><strong>التاريخ:</strong> {new Date(signal.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default SignalDetailsPage;
