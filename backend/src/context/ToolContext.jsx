
import React, { createContext, useContext, useState } from 'react';

const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null);
  const activateTool = (tool) => setActiveTool(tool);
  const deactivateTool = () => setActiveTool(null);
  return (
    <ToolContext.Provider value={{ activeTool, activateTool, deactivateTool }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useToolContext = () => useContext(ToolContext);
