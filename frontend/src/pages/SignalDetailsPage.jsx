// frontend/src/pages/SignalDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SignalDetailsPage = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/signals/${id}`);
        const data = await response.json();
        setSignal(data);
      } catch (error) {
        console.error("Error fetching signal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
  }, [id]);

  if (loading) return <div>🔄 Loading...</div>;
  if (!signal) return <div>⚠️ Signal not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📍 Signal Details</h2>
      <div className="border rounded-lg p-4 shadow">
        <p><strong>ID:</strong> {signal._id}</p>
        <p><strong>Symbol:</strong> {signal.symbol}</p>
        <p><strong>Action:</strong> {signal.action}</p>
        <p><strong>Created At:</strong> {new Date(signal.createdAt).toLocaleString()}</p>
        {/* أضف أي تفاصيل إضافية هنا حسب الحقول */}
      </div>
    </div>
  );
};

export default SignalDetailsPage;
