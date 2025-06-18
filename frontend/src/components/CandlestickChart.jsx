import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({
  symbol,
  data,
  activeTool,
  lines = [],
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 30, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, chartWidth])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low);
    const yMax = d3.max(data, (d) => d.high);
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([chartHeight, 0]);

    // Candles
    g.selectAll(".candle")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "candle")
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close > d.open ? "green" : "red"));

    // Wicks
    g.selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "wick")
      .attr("x1", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("x2", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", (d) => (d.close > d.open ? "green" : "red"));

    // أدوات التحليل الفني

    // خطوط
    lines.forEach((line) => {
      const [x1, y1] = [xScale(line.start.index), yScale(line.start.price)];
      const [x2, y2] = [xScale(line.end.index), yScale(line.end.price)];
      g.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "blue")
        .attr("stroke-width", 2);
    });

    // مناطق
    zones.forEach((zone) => {
      const x = xScale(zone.startIndex);
      const w = xScale(zone.endIndex) - x;
      const y = yScale(zone.high);
      const h = yScale(zone.low) - y;
      g.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "orange")
        .attr("opacity", 0.2);
    });

    // فراكتلات
    fractals.forEach((f) => {
      const x = xScale(f.index) + xScale.bandwidth() / 2;
      const y = yScale(f.price);
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", f.type === "top" ? "purple" : "pink");
    });

    // موجات إليوت
    waves.forEach((w) => {
      const x = xScale(w.index);
      const y = yScale(w.price);
      g.append("text")
        .attr("x", x)
        .attr("y", y - 10)
        .attr("fill", "darkblue")
        .attr("font-size", "12px")
        .text(w.label);
    });

  }, [data, lines, zones, fractals, waves]);

  return <svg ref={svgRef}></svg>;
};

export default CandlestickChart;
