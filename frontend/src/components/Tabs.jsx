
import React from "react";

const Tabs = ({ tabs, selected, onChange }) => {
  return (
    <div className="flex space-x-2 mb-3">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={\`px-4 py-2 rounded \${selected === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
