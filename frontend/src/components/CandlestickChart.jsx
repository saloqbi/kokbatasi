import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Stage } from "react-konva";
import AllDrawingTools from "../tools/AllDrawingTools";

const CandlestickChart = ({
  signalId,
  data,
  activeTool,
  lines = [],
  setLines = () => {},
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
}) => {
  const svgRef = useRef();
  const [tempPoints, setTempPoints] = useState([]);
  const width = 800;
  const height = 400;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data || data.length === 0) {
      svg
        .append("text")
        .attr("x", 50)
        .attr("y", 50)
        .text("⚠️ لا توجد بيانات للعرض")
        .attr("fill", "red")
        .attr("font-size", "18px");
      return;
    }

    const margin = { top: 20, right: 60, bottom: 30, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, chartWidth])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low);
    const yMax = d3.max(data, (d) => d.high);
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([chartHeight, 0]);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fff")
      .on("dblclick", async function (event) {
        if (activeTool !== "line") return;

        const [x, y] = d3.pointer(event);
        const index = Math.round((x - margin.left) / xScale.step());
        const price = yScale.invert(y - margin.top);

        const nearestIndex = Math.max(0, Math.min(data.length - 1, index));
        const point = { index: nearestIndex, price };

        const updated = [...tempPoints, point];
        setTempPoints(updated);

        if (updated.length === 2) {
          const newLine = { start: updated[0], end: updated[1] };
          const newLines = [...lines, newLine];
          setLines(newLines);
          setTempPoints([]);

          try {
            await fetch(`/api/signals/${signalId}/tools/lines`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lines: newLines }),
            });
            console.log("✅ تم حفظ الخط في MongoDB");
          } catch (err) {
            console.error("❌ فشل الحفظ:", err);
          }
        }
      })
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close > d.open ? "green" : "red"));

    g.selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("x2", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", "black");

    lines.forEach((line) => {
      g.append("line")
        .attr("x1", xScale(line.start.index))
        .attr("y1", yScale(line.start.price))
        .attr("x2", xScale(line.end.index))
        .attr("y2", yScale(line.end.price))
        .attr("stroke", "blue")
        .attr("stroke-width", 2);
    });
  }, [data, lines, activeTool, tempPoints]);

  return (
    <div style={{ position: "relative", width, height }}>
      <Stage width={width} height={height} style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}>
        <AllDrawingTools />
      </Stage>
      <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}></svg>
    </div>
  );
};

export default CandlestickChart;
