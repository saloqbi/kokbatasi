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

  
  const [channels, setChannels] = useState([]);

  const addChannel = (newChannel) => setChannels(prev => [...prev, newChannel]);
  const updateChannel = (index, updated) => {
    setChannels(prev => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };
  const removeChannel = (index) => setChannels(prev => prev.filter((_, i) => i !== index));

  const updateToolSettings = (tool, settings) => {
    setToolSettings((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], ...settings },
    }));
  };

  return (
    <ToolContext.Provider
      value={{
        channels,
        addChannel,
        updateChannel,
        removeChannel,

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
