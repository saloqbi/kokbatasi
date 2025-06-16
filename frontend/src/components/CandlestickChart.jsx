import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CandlestickChart = ({ symbol, data }) => {
  const ref = useRef();
  const API_KEY = "32V0QSYPVZZYK9GR"; // Alpha Vantage API Key

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const drawCandles = (candles) => {
      if (!candles || candles.length === 0) return;

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
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d")));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
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

    // ✅ إذا البيانات متوفرة من props → استخدمها مباشرة
    if (data && data.length > 0) {
      const formatted = data.map(d => ({
        date: new Date(d.time || d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
      }));
      drawCandles(formatted);
      return;
    }

    // ❌ إذا لم تتوفر البيانات → جلبها من API حسب الرمز
    if (!symbol) {
      console.warn("⛔ لا يوجد symbol لطلب البيانات.");
      return;
    }

    const fetchData = async () => {
      try {
        let candles = [];

        if (symbol.endsWith("USDT")) {
          const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1d&limit=30`;
          const res = await fetch(url);
          const raw = await res.json();
          candles = raw.map(d => ({
            date: new Date(d[0]),
            open: +d[1],
            high: +d[2],
            low: +d[3],
            close: +d[4],
          }));
        } else {
          const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          const data = json["Time Series (Daily)"];
          if (!data) {
            console.warn("⛔ Alpha Vantage لم يرجع بيانات.");
            return;
          }
          candles = Object.entries(data).slice(0, 30).map(([dateStr, v]) => ({
            date: new Date(dateStr),
            open: +v["1. open"],
            high: +v["2. high"],
            low: +v["3. low"],
            close: +v["4. close"],
          })).reverse();
        }

        drawCandles(candles);
      } catch (err) {
        console.error("⚠️ خطأ في جلب بيانات الشموع:", err);
      }
    };

    fetchData();
  }, [symbol, data]);

  return <svg ref={ref}></svg>;
};

export default CandlestickChart;
