import React from "react";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col justify-between p-5 border-r border-gray-800 shadow-lg rounded-l-2xl font-[Cairo] fixed right-0 top-0 bottom-0 z-50">
      <div>
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">🌌 كوكبة تاسي لتوصيات الذكية</h1>

        <nav className="space-y-4">
          <div className="text-xs text-gray-400 uppercase mb-1">القائمة</div>
          <ul className="space-y-2">
            <li className="hover:bg-[#1f1f1f] px-3 py-2 rounded-md cursor-pointer transition">📈 الإشارات</li>
            <li className="hover:bg-[#1f1f1f] px-3 py-2 rounded-md cursor-pointer transition">➕ إضافة توصية</li>
            <li className="hover:bg-[#1f1f1f] px-3 py-2 rounded-md cursor-pointer transition">⚙️ لوحة التحكم</li>
            <li className="hover:bg-[#1f1f1f] px-3 py-2 rounded-md cursor-pointer transition">🔐 تسجيل الدخول</li>
          </ul>

          <div className="mt-6 text-xs text-gray-400 uppercase mb-1">أدوات التحليل</div>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer px-3 py-2 rounded-md transition ${selectedTab === "candles" ? "bg-[#2e2e2e] text-yellow-400" : "hover:text-yellow-300 hover:bg-[#1f1f1f]"}`}
              onClick={() => setSelectedTab("candles")}
            >
              🕯️ الشموع اليابانية
            </li>
            <li
              className={`cursor-pointer px-3 py-2 rounded-md transition ${selectedTab === "analysis" ? "bg-[#2e2e2e] text-yellow-400" : "hover:text-yellow-300 hover:bg-[#1f1f1f]"}`}
              onClick={() => setSelectedTab("analysis")}
            >
              📊 تحليل فني
            </li>
            <li
              className={`cursor-pointer px-3 py-2 rounded-md transition ${selectedTab === "draw" ? "bg-[#2e2e2e] text-yellow-400" : "hover:text-yellow-300 hover:bg-[#1f1f1f]"}`}
              onClick={() => setSelectedTab("draw")}
            >
              ✍️ أدوات الرسم
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-center text-[10px] text-gray-500 mt-6">جميع الحقوق محفوظة © 2025</div>
    </aside>
  );
};

export default Sidebar;
