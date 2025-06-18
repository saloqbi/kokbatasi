import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ symbol, data, activeTool, lines = [], zones = [], fractals = [], waves = [], abcdPatterns = [], harmonicPatterns = [], priceActions = [] }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("🚫 لا توجد بيانات شموع صالحة:", data);
      return;
    }

    console.log("✅ بيانات الشموع:", data.slice(0, 5)); // طباعة نموذج

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    const candles = data.map((d, i) => ({ ...d, index: i }));

    const x = d3.scaleBand()
      .domain(candles.map(d => d.index))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([
        d3.min(candles, d => +d.low),
        d3.max(candles, d => +d.high)
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.attr("width", width).attr("height", height);

    // اختبار مبدأي لرسم مستطيل دائمًا
    svg.append("rect")
      .attr("x", 50)
      .attr("y", 50)
      .attr("width", 100)
      .attr("height", 50)
      .attr("fill", "lightblue")
      .attr("opacity", 0.3);

    // رسم المحاور
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => i));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // رسم الشموع
    svg.selectAll(".candle")
      .data(candles)
      .enter()
      .append("rect")
      .attr("x", d => x(d.index))
      .attr("y", d => y(Math.max(+d.open, +d.close)))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.abs(y(+d.open) - y(+d.close)))
      .attr("fill", d => +d.close > +d.open ? "green" : "red");

    svg.selectAll("line.stem")
      .data(candles)
      .enter()
      .append("line")
      .attr("x1", d => x(d.index) + x.bandwidth() / 2)
      .attr("x2", d => x(d.index) + x.bandwidth() / 2)
      .attr("y1", d => y(+d.high))
      .attr("y2", d => y(+d.low))
      .attr("stroke", "black");

    // أدوات الرسم (كما كانت)
    const indexToX = i => x(i) + x.bandwidth() / 2;
    const priceToY = p => y(p);

    if (activeTool === "line") {
      lines.forEach(line => {
        svg.append("line")
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
          .attr("y1", priceToY(line.price))
          .attr("y2", priceToY(line.price))
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "4");
      });
    }

    if (activeTool === "zone") {
      zones.forEach(zone => {
        svg.append("rect")
          .attr("x", margin.left)
          .attr("width", width - margin.left - margin.right)
          .attr("y", priceToY(Math.max(zone.from, zone.to)))
          .attr("height", Math.abs(priceToY(zone.from) - priceToY(zone.to)))
          .attr("fill", "orange")
          .attr("opacity", 0.1);
      });
    }

    if (activeTool === "fractal") {
      fractals.forEach(p => {
        svg.append("text")
          .attr("x", indexToX(p.index))
          .attr("y", p.type === "top" ? priceToY(p.price) - 10 : priceToY(p.price) + 15)
          .attr("font-size", 18)
          .attr("fill", p.type === "top" ? "red" : "blue")
          .attr("text-anchor", "middle")
          .text(p.type === "top" ? "⬆️" : "⬇️");
      });
    }

    if (activeTool === "elliott") {
      for (let i = 0; i < waves.length - 1; i++) {
        const p1 = waves[i];
        const p2 = waves[i + 1];
        svg.append("line")
          .attr("x1", indexToX(p1.index))
          .attr("y1", priceToY(p1.price))
          .attr("x2", indexToX(p2.index))
          .attr("y2", priceToY(p2.price))
          .attr("stroke", "green")
          .attr("stroke-width", 2);
        svg.append("text")
          .attr("x", indexToX(p1.index))
          .attr("y", priceToY(p1.price) - 8)
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
          .text(p1.label);
      }
    }
  }, [data, activeTool, lines, zones, fractals, waves]);

  return <svg ref={ref}></svg>;
};

export default CandlestickChart;
