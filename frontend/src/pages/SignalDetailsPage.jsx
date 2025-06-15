import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SignalDetailsPage = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await fetch(
          `https://kokbatasi.onrender.com/api/signals/${id}`
        );
        const result = await response.json();
        setSignal(result);
      } catch (error) {
        console.error("Error fetching signal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
  }, [id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (!signal) return <div>تعذر تحميل بيانات الإشارة.</div>;

  const { title, recommendation, createdAt, data } = signal;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">تفاصيل الإشارة</h1>
      <p><strong>العنوان:</strong> {title}</p>
      <p><strong>التوصية:</strong> {recommendation}</p>
      <p><strong>تاريخ الإنشاء:</strong> {new Date(createdAt).toLocaleString()}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">بيانات الإشارة:</h2>
      {Array.isArray(data) && data.length > 0 ? (
        <ul className="list-disc pl-6">
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <p>لا توجد بيانات إضافية.</p>
      )}
    </div>
  );
};

export default SignalDetailsPage;
