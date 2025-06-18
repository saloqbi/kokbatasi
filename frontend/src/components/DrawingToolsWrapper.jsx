// 📁 المسار: frontend/src/components/DrawingToolsWrapper.jsx

import React from "react";
import DrawingTools from "./DrawingTools";
import { ToolProvider } from "../context/ToolContext";

const DrawingToolsWrapper = (props) => {
  return (
    <ToolProvider>
      <DrawingTools {...props} />
    </ToolProvider>
  );
};

export default DrawingToolsWrapper;
