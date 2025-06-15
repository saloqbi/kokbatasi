import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SignalDetailsPage() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSignal() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signals/${id}`);
        if (!response.ok) {
          throw new Error("فشل في جلب الإشارة");
        }
        const result = await response.json();
        setSignal(result);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    }

    fetchSignal();
  }, [id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;
  if (!signal) return <div>لم يتم العثور على الإشارة</div>;

  return (
    <div>
      <h2>{signal.title}</h2>
      <p>التوصية: {signal.recommendation}</p>
      <p>تاريخ الإنشاء: {new Date(signal.createdAt).toLocaleString("ar-EG")}</p>
      <h3>البيانات:</h3>
      <ul>
        {Array.isArray(signal.data) && signal.data.length > 0 ? (
          signal.data.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>لا توجد بيانات</li>
        )}
      </ul>
    </div>
  );
}

export default SignalDetailsPage;