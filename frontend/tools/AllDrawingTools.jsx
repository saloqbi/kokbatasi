// ✅ AllDrawingTools_FINAL_MERGED.jsx
import React, { useState, useContext } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { ToolContext } from "../context/ToolContext";

const API_BASE = import.meta.env.VITE_REACT_APP_API_URL;

const AllDrawingTools = ({
  signalId,
  savedLines,
  onSaveLines,
  xScale,
  yScale,
}) => {
  const { activeTool } = useContext(ToolContext);
  const [temp, setTemp] = useState([]);

  const handleClick = (e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (!pointer || !xScale || !yScale) return;

    const x = pointer.x;
    const y = pointer.y;
    const time = xScale.invert(x).getTime();
    const price = yScale.invert(y);

    if (temp.length === 0) {
      setTemp([{ time, price }]);
    } else if (temp.length === 1) {
      const newLine = {
        x1: temp[0].time,
        y1: temp[0].price,
        x2: time,
        y2: price,
        type: "line",
        signalId,
      };

      fetch(`${API_BASE}/api/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLine),
      })
        .then((res) => res.json())
        .then((saved) => {
          onSaveLines((prev) => [...prev, { ...newLine, _id: saved._id }]);
          setTemp([]);
        });
    }
  };

  return (
    <Stage width={850} height={400} onClick={handleClick}>
      <Layer>
        {/* خطوط الاتجاه المحفوظة */}
        {savedLines.map((line, i) => (
          <Line
            key={i}
            points={[
              xScale(new Date(line.x1)),
              yScale(line.y1),
              xScale(new Date(line.x2)),
              yScale(line.y2),
            ]}
            stroke="#00e676"
            strokeWidth={2}
            lineCap="round"
            tension={0}
            draggable
            onDragEnd={(e) => {
              const dx = e.target.x() - xScale(new Date(line.x1));
              const dy = e.target.y() - yScale(line.y1);
              const newX1 = xScale.invert(xScale(new Date(line.x1)) + dx).getTime();
              const newY1 = yScale.invert(yScale(line.y1) + dy);
              const newX2 = xScale.invert(xScale(new Date(line.x2)) + dx).getTime();
              const newY2 = yScale.invert(yScale(line.y2) + dy);

              const updated = {
                ...line,
                x1: newX1,
                y1: newY1,
                x2: newX2,
                y2: newY2,
              };

              onSaveLines((prev) => {
                const copy = [...prev];
                copy[i] = updated;
                return copy;
              });

              fetch(`${API_BASE}/api/tools/${line._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              });
            }}
          />
        ))}

        {/* مؤقتًا: عرض الخط أثناء الرسم */}
        {temp.length === 1 && (
          <Line
            points={[
              xScale(new Date(temp[0].time)),
              yScale(temp[0].price),
              xScale.invert ? xScale.invert(0).getTime() : 0,
              yScale.invert ? yScale.invert(0) : 0,
            ]}
            stroke="#888"
            strokeWidth={1}
            dash={[4, 4]}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default AllDrawingTools;