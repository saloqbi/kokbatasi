import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ symbol, data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const drawCandles = (candles) => {
      if (!candles || candles.length === 0) return;

      const width = 600;
      const height = 300;
      const margin = { top: 10, right: 30, bottom: 30, left: 60 };

      const x = d3.scaleBand()
        .domain(candles.map((d, i) => i)) // استخدم الفهرس كـ X
        .range([margin.left, width - margin.right])
        .padding(0.3);

      const y = d3.scaleLinear()
        .domain([
          d3.min(candles, d => d.low),
          d3.max(candles, d => d.high)
        ])
        .range([height - margin.bottom, margin.top]);

      svg.attr("width", width).attr("height", height);

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => i));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.selectAll(".candle")
        .data(candles)
        .enter()
        .append("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", d => y(Math.max(d.open, d.close)))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(y(d.open) - y(d.close)))
        .attr("fill", d => d.close > d.open ? "green" : "red");

      svg.selectAll("line.stem")
        .data(candles)
        .enter()
        .append("line")
        .attr("x1", (_, i) => x(i) + x.bandwidth() / 2)
        .attr("x2", (_, i) => x(i) + x.bandwidth() / 2)
        .attr("y1", d => y(d.high))
        .attr("y2", d => y(d.low))
        .attr("stroke", "black");
    };

    // ✅ تنسيق البيانات وتمريرها إلى الرسم
    if (data && data.length > 0) {
      const formatted = data.map(d => ({
        date: new Date(d.time || d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
      }));
      drawCandles(formatted);
    }
  }, [symbol, data]);

  return <svg ref={ref}></svg>;
};

export default CandlestickChart;
