import React from "react";
import { Line } from "react-konva";

const TrendlineTool = () => {
  return (
    <Line
      points={[50, 250, 300, 150]}
      stroke="blue"
      strokeWidth={2}
      dash={[5, 5]}
    />
  );
};

export default TrendlineTool;
