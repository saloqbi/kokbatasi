// ملف إعدادات API موحد

const BASE_URL = "https://kokbatasi.onrender.com/api";

// استعلام الإشارات
export const getSignals = async () => {
  try {
    const response = await fetch(`${BASE_URL}/signals`);
    if (!response.ok) {
      throw new Error("فشل في جلب الإشارات");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ خطأ في getSignals:", error.message);
    return null;
  }
};