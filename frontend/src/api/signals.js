// frontend/src/api/signals.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// 📥 جلب جميع الإشارات
export const getSignals = async () => {
  const response = await fetch(`${API_URL}/api/signals`);
  if (!response.ok) throw new Error("فشل في جلب الإشارات");
  return await response.json();
};

// ➕ إرسال إشارة جديدة
export const createSignal = async (signalData) => {
  const response = await fetch(`${API_URL}/api/signals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signalData),
  });
  if (!response.ok) throw new Error("فشل في إنشاء الإشارة");
  return await response.json();
};

// 📄 جلب تفاصيل إشارة حسب ID
export const getSignalById = async (id) => {
  const response = await fetch(`${API_URL}/api/signals/${id}`);
  if (!response.ok) throw new Error("فشل في جلب تفاصيل الإشارة");
  return await response.json();
};

// 🗑️ حذف إشارة
export const deleteSignal = async (id)
