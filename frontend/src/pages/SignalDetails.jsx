import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSignals } from "../api/signals";

export default function AllSignalsPage() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedSignals = await getSignals();
      console.log("📥 الإشارات المستلمة:", fetchedSignals);
      setSignals(fetchedSignals);
    }

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📡 جميع التوصيات</h1>
      <ul className="space-y-2">
        {signals.map((signal) => (
          <li key={signal._id}>
            <Link
              to={`/signals/${signal._id}`}
              className="text-purple-700 hover:underline"
            >
              📝 {signal.title || "بدون عنوان"} - 💡 {signal.recommendation || "بدون توصية"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
