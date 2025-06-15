
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ symbol }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };

    // Generate fake candle data for demo
    const candles = Array.from({ length: 20 }, (_, i) => ({
      date: new Date(2024, 0, i + 1),
      open: 100 + Math.random() * 10,
      high: 110 + Math.random() * 10,
      low: 90 + Math.random() * 10,
      close: 95 + Math.random() * 10,
    }));

    const x = d3.scaleBand()
      .domain(candles.map(d => d.date))
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
      .attr("transform", \`translate(0,\${height - margin.bottom})\`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d")));

    svg.append("g")
      .attr("transform", \`translate(\${margin.left},0)\`)
      .call(d3.axisLeft(y));

    svg.selectAll(".candle")
      .data(candles)
      .enter()
      .append("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(Math.max(d.open, d.close)))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.abs(y(d.open) - y(d.close)))
      .attr("fill", d => d.close > d.open ? "green" : "red");

    svg.selectAll("line.stem")
      .data(candles)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", d => x(d.date) + x.bandwidth() / 2)
      .attr("x2", d => x(d.date) + x.bandwidth() / 2)
      .attr("y1", d => y(d.high))
      .attr("y2", d => y(d.low))
      .attr("stroke", "black");
  }, [symbol]);

  return (
    <svg ref={ref}></svg>
  );
};

export default CandlestickChart;
