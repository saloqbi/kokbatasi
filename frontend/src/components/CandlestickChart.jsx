
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ symbol }) => {
  const ref = useRef();
  const API_KEY = "32V0QSYPVZZYK9GR"; // Alpha Vantage API Key

  useEffect(() => {
    if (!symbol) {
      console.warn("⛔ الرمز غير متوفر (symbol is undefined)");
      return;
    }

    const fetchData = async () => {
      let candles = [];

      try {
        if (symbol.endsWith("USDT")) {
          // Binance API
          const binanceSymbol = symbol.toUpperCase();
          const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=1d&limit=30`;
          const res = await fetch(url);
          const rawData = await res.json();

          candles = rawData.map(d => ({
            date: new Date(d[0]),
            open: +d[1],
            high: +d[2],
            low: +d[3],
            close: +d[4],
          }));
        } else {
          // Alpha Vantage API
          const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          const data = json["Time Series (Daily)"];

          if (!data) {
            console.warn("⛔ لم يتم العثور على بيانات الشموع لـ Alpha Vantage");
            return;
          }

          candles = Object.entries(data).slice(0, 30).map(([dateStr, values]) => ({
            date: new Date(dateStr),
            open: +values["1. open"],
            high: +values["2. high"],
            low: +values["3. low"],
            close: +values["4. close"],
          })).reverse();
        }

        drawCandles(candles);
      } catch (error) {
        console.error("⚠️ فشل في تحميل بيانات الشموع:", error);
      }
    };

    const drawCandles = (candles) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const width = 600;
      const height = 300;
      const margin = { top: 10, right: 30, bottom: 30, left: 60 };

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
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d")));

      svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
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
        .attr("x1", d => x(d.date) + x.bandwidth() / 2)
        .attr("x2", d => x(d.date) + x.bandwidth() / 2)
        .attr("y1", d => y(d.high))
        .attr("y2", d => y(d.low))
        .attr("stroke", "black");
    };

    fetchData();
  }, [symbol]);

  return <svg ref={ref}></svg>;
};

export default CandlestickChart;
