import React from "react";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col justify-between p-4 border-l border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">🌌 كوكبة</h1>

        <nav className="space-y-3">
          <div className="text-sm text-gray-400 uppercase mb-2">القائمة</div>
          <ul className="space-y-2">
            <li className="hover:text-yellow-400 cursor-pointer">📈 الإشارات</li>
            <li className="hover:text-yellow-400 cursor-pointer">➕ إضافة توصية</li>
            <li className="hover:text-yellow-400 cursor-pointer">⚙️ لوحة التحكم</li>
            <li className="hover:text-yellow-400 cursor-pointer">🔐 تسجيل الدخول</li>
          </ul>

          <div className="mt-6 text-sm text-gray-400 uppercase mb-2">أدوات التحليل</div>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer px-2 py-1 rounded-md ${selectedTab === "candles" ? "bg-[#333] text-yellow-300" : "hover:text-yellow-300"}`}
              onClick={() => setSelectedTab("candles")}
            >
              الشموع اليابانية
            </li>
            <li
              className={`cursor-pointer px-2 py-1 rounded-md ${selectedTab === "analysis" ? "bg-[#333] text-yellow-300" : "hover:text-yellow-300"}`}
              onClick={() => setSelectedTab("analysis")}
            >
              📊 تحليل فني
            </li>
            <li
              className={`cursor-pointer px-2 py-1 rounded-md ${selectedTab === "draw" ? "bg-[#333] text-yellow-300" : "hover:text-yellow-300"}`}
              onClick={() => setSelectedTab("draw")}
            >
              ✍️ أدوات الرسم
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">جميع الحقوق محفوظة © 2025</div>
    </aside>
  );
};

export default Sidebar;
