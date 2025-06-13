
import React, { createContext, useState, useContext } from 'react';

const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null);
  const [toolSettings, setToolSettings] = useState({});

  const activateTool = (toolName) => setActiveTool(toolName);
  const deactivateTool = () => setActiveTool(null);
  const isActive = (toolName) => activeTool === toolName;

  const updateToolSettings = (toolName, settings) => {
    setToolSettings(prev => ({ ...prev, [toolName]: settings }));
  };

  return (
    <ToolContext.Provider value={{
      activeTool,
      toolSettings,
      activateTool,
      deactivateTool,
      isActive,
      updateToolSettings
    }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useToolContext = () => useContext(ToolContext);
