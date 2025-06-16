import React from "react";

const Tabs = ({ tabs, selected, onChange }) => {
  const handleClick = (tab) => {
    if (typeof onChange === "function") {
      onChange(tab.key);
    } else {
      console.error("❌ onChange is not a function:", onChange);
    }
console.log("🔍 handleClick tab =", tab);
console.log("🔍 typeof onChange =", typeof onChange);
console.log("🔍 selected =", selected);

  };

  return (
    <div className="flex space-x-2 rtl:space-x-reverse mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-4 py-2 rounded text-sm border ${
            selected === tab.key
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => handleClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
