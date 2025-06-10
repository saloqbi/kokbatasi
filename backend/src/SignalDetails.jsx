import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SignalDetails() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/signals/${id}`);
        setSignal(res.data);
      } catch (error) {
        console.error("Error loading signal:", error);
      }
    };

    fetchSignal();
  }, [id]);

  if (!signal) return <p className="p-4">جارٍ تحميل تفاصيل الإشارة...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">تفاصيل الإشارة</h1>

      <div className="space-y-2">
        <p><strong>السوق:</strong> {signal.market}</p>
        <p><strong>نوع التحليل:</strong> {signal.type}</p>
        <p><strong>الدخول:</strong> {signal.entry}</p>
        <p><strong>الخروج:</strong> {signal.exit}</p>
        <p><strong>الحالة:</strong> {signal.status}</p>
        <p><strong>الثقة:</strong> {signal.confidence}%</p>
        <p><strong>التاريخ:</strong> {new Date(signal.date).toLocaleDateString()}</p>
        <p><strong>ملاحظات:</strong> {signal.notes || "لا توجد"}</p>
      </div>

      <a href="/" className="inline-block mt-4 text-blue-600 underline">↩ الرجوع إلى قائمة الإشارات</a>
    </div>
  );
}
