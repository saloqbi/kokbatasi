import React from "react";

const Tabs = ({ tabs, selected, onChange }) => {
  const handleClick = (tab, index) => {
    console.log("🔍 tab =", tab);
    console.log("🔍 tab index =", index);
    console.log("🔍 typeof onChange =", typeof onChange);
    console.log("🔍 selected =", selected);

    try {
      if (typeof onChange === "function") {
        onChange(tab.key);
      } else {
        console.error("❌ onChange is not a function:", onChange);
      }
    } catch (e) {
      console.error("🔥 Exception in onClick:", e);
    }
  };

  return (
    <div className="flex space-x-2 rtl:space-x-reverse mb-4">
      {tabs.map((tab, index) => (
        <button
          key={tab.key || index}
          className={`px-4 py-2 rounded text-sm border ${
            selected === tab.key
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => handleClick(tab, index)}
        >
          {tab.label || `🚫 لا يوجد label`}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
