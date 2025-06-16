import React, { createContext, useState } from "react";

export const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null);
  const [toolSettings, setToolSettings] = useState({});

  const activateTool = (tool) => {
    setActiveTool(tool);
  };

  const deactivateTool = () => {
    setActiveTool(null);
  };

  const isActive = (tool) => activeTool === tool;

  const updateToolSettings = (tool, settings) => {
    setToolSettings((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], ...settings },
    }));
  };

  return (
    <ToolContext.Provider
      value={{
        activeTool,
        setActiveTool, // ✅ تم إضافتها لحل المشكلة
        toolSettings,
        activateTool,
        deactivateTool,
        isActive,
        updateToolSettings,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};
