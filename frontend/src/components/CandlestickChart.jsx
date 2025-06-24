import React, { useRef, useEffect, useState, useContext } from "react";
import * as d3 from "d3";
import { Stage } from "react-konva";
import AllDrawingTools from "../tools/AllDrawingTools";
import { ToolContext } from "../context/ToolContext";

const CandlestickChart = ({
  signalId,
  data,
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
  const { activeTool } = useContext(ToolContext);

  const xScaleRef = useRef();
  const yScaleRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!data || data.length === 0) {
      svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .text("⚠️ لا توجد بيانات للعرض")
        .attr("fill", "red")
        .attr("font-size", "18px");
      return;
    }

    const margin = { top: 40, right: 60, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    xScaleRef.current = d3.scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, chartWidth])
      .padding(0.4);

    const yMin = d3.min(data, d => d.low);
    const yMax = d3.max(data, d => d.high);
    yScaleRef.current = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([chartHeight, 0]);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#1a1a1a")
      .on("dblclick", async function (event) {
        if (activeTool !== "line") return;
        const [x, y] = d3.pointer(event);
        const index = Math.round((x - margin.left) / xScaleRef.current.step());
        const price = yScaleRef.current.invert(y - margin.top);
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
          } catch (err) {
            console.error("❌ فشل الحفظ:", err);
          }
        }
      })
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const candleWidth = 6;
    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScaleRef.current(i) + xScaleRef.current.bandwidth() / 2 - candleWidth / 2)
      .attr("y", d => yScaleRef.current(Math.max(d.open, d.close)))
      .attr("width", candleWidth)
      .attr("height", d => Math.max(1, Math.abs(yScaleRef.current(d.open) - yScaleRef.current(d.close))))
      .attr("fill", d => d.close > d.open ? "#4ade80" : "#f87171");

    g.selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (_, i) => xScaleRef.current(i) + xScaleRef.current.bandwidth() / 2)
      .attr("x2", (_, i) => xScaleRef.current(i) + xScaleRef.current.bandwidth() / 2)
      .attr("y1", d => yScaleRef.current(d.high))
      .attr("y2", d => yScaleRef.current(d.low))
      .attr("stroke", "#e0e0e0");

    g.selectAll(".timestamp")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (_, i) => xScaleRef.current(i) + xScaleRef.current.bandwidth() / 2)
      .attr("y", chartHeight + 12)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#aaa")
      .text(d => {
        if (!d.time || isNaN(new Date(d.time))) return "-";
        return d3.timeFormat("%d/%m/%Y - %H:%M")(new Date(d.time));
      });

    // ✅ عرض بيانات الشمعة الأخيرة أعلى الشارت
    const last = data[data.length - 1];
    svg.append("text")
      .attr("x", margin.left + 10)
      .attr("y", 20)
      .text(
        `📅 ${d3.timeFormat("%d/%m/%Y - %H:%M")(new Date(last.time))} | O: ${last.open} | C: ${last.close} | H: ${last.high} | L: ${last.low}`
      )
      .attr("fill", "#f9f9f9")
      .attr("font-size", "12px");

    // 🕒 الإطار الزمني
    svg.append("text")
      .attr("x", width - 20)
      .attr("y", 20)
      .text("⏱ الإطار الزمني: 1m")
      .attr("fill", "#facc15")
      .attr("font-size", "13px")
      .attr("text-anchor", "end");

    lines.forEach((line) => {
      if (!line?.start || !line?.end) return;
      g.append("line")
        .attr("x1", xScaleRef.current(line.start.index))
        .attr("y1", yScaleRef.current(line.start.price))
        .attr("x2", xScaleRef.current(line.end.index))
        .attr("y2", yScaleRef.current(line.end.price))
        .attr("stroke", "blue")
        .attr("stroke-width", 2);
    });
  }, [data, lines, activeTool, tempPoints]);

  return (
    <div style={{ position: "relative", width, height }}>
      <Stage
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}
      >
        <AllDrawingTools
          signalId={signalId}
          savedLines={lines}
          onSaveLines={setLines}
          xScale={xScaleRef.current}
          yScale={yScaleRef.current}
        />
      </Stage>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
    </div>
  );
};

export default CandlestickChart;
