import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const CandlestickChart_TimeBased = ({ data, signalId, width = 800, height = 400, onScalesReady }) => {
  const svgRef = useRef();
  const [drawMode, setDrawMode] = useState("line");
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;
    const fetchTools = async () => {
      try {
        const res = await fetch(`https://kokbatasi.onrender.com/api/tools/${signalId}`);
        if (!res.ok) throw new Error("❌ فشل في جلب الأدوات");
        const tools = await res.json();
        const validTools = tools.filter(t => t && t._id);
        setShapes(validTools);
      } catch (err) {
        console.error("❌ Error fetching tools:", err.message);
      }
    };
    if (signalId) fetchTools();
  }, [signalId]);

  const saveToolToServer = async (tool) => {
    try {
      const res = await fetch("https://kokbatasi.onrender.com/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool),
      });
      if (!res.ok) throw new Error("❌ فشل الحفظ");
      return await res.json();
    } catch (err) {
      console.error("❌ Save tool error:", err.message);
    }
  };

  const updateToolOnServer = async (id, tool) => {
    try {
      await fetch(`https://kokbatasi.onrender.com/api/tools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool),
      });
    } catch (err) {
      console.error("❌ Update error:", err.message);
    }
  };

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;
    if (!data || data.length === 0) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const parsedData = data
      .map(d => ({ ...d, date: new Date(d.timestamp) }))
      .filter(d => !isNaN(d.date.getTime()) && d.open && d.close && d.high && d.low);

    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(parsedData, d => d.low), d3.max(parsedData, d => d.high)])
      .nice()
      .range([innerHeight, 0]);

    // 🟢 تمرير المقاييس بعد إنشائها
    if (typeof onScalesReady === "function") {
      onScalesReady({ xScale, yScale });
    }

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const candleWidth = innerWidth / parsedData.length * 0.7;

    g.selectAll(".candle")
      .data(parsedData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.date) - candleWidth / 2)
      .attr("y", d => yScale(Math.max(d.open, d.close)))
      .attr("width", candleWidth)
      .attr("height", d => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", d => (d.close > d.open ? "#4caf50" : "#f44336"));

    g.selectAll(".wick")
      .data(parsedData)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.date))
      .attr("x2", d => xScale(d.date))
      .attr("y1", d => yScale(d.high))
      .attr("y2", d => yScale(d.low))
      .attr("stroke", d => (d.close > d.open ? "#4caf50" : "#f44336"))
      .attr("stroke-width", 1);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%d/%m/%Y - %H:%M")));

    g.append("g").call(d3.axisLeft(yScale));

    const shapeGroup = g.append("g");

    shapes.filter(s => s && s._id).forEach((shape, index) => {
      if (shape.type === "line") {
        shapeGroup.append("line")
          .attr("x1", xScale(new Date(shape.x1)))
          .attr("y1", yScale(shape.y1))
          .attr("x2", xScale(new Date(shape.x2)))
          .attr("y2", yScale(shape.y2))
          .attr("stroke", "#2196f3")
          .attr("stroke-width", 2)
          .style("cursor", "move")
          .call(d3.drag().on("drag", (event) => {
            const dx = xScale.invert(event.dx + xScale(new Date(shape.x1))).getTime() - shape.x1;
            const dy = yScale.invert(yScale(shape.y1) + event.dy) - shape.y1;
            const updated = {
              ...shape,
              x1: shape.x1 + dx,
              y1: shape.y1 + dy,
              x2: shape.x2 + dx,
              y2: shape.y2 + dy,
            };
            setShapes(prev => {
              const next = [...prev];
              next[index] = updated;
              updateToolOnServer(shape._id, updated);
              return next;
            });
          }));
      }

      if (shape.type === "rect") {
        const x = xScale(new Date(Math.min(shape.x1, shape.x2)));
        const y = yScale(Math.max(shape.y1, shape.y2));
        const w = Math.abs(xScale(new Date(shape.x2)) - xScale(new Date(shape.x1)));
        const h = Math.abs(yScale(shape.y1) - yScale(shape.y2));

        shapeGroup.append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", w)
          .attr("height", h)
          .attr("fill", "rgba(255, 193, 7, 0.3)")
          .attr("stroke", "#ffc107")
          .style("cursor", "move")
          .call(d3.drag().on("drag", (event) => {
            const dx = xScale.invert(event.dx + x).getTime() - Math.min(shape.x1, shape.x2);
            const dy = yScale.invert(y + event.dy) - Math.max(shape.y1, shape.y2);
            const updated = {
              ...shape,
              x1: shape.x1 + dx,
              x2: shape.x2 + dx,
              y1: shape.y1 + dy,
              y2: shape.y2 + dy,
            };
            setShapes(prev => {
              const next = [...prev];
              next[index] = updated;
              updateToolOnServer(shape._id, updated);
              return next;
            });
          }));
      }
    });

    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", drawMode === "line" ? "crosshair" : "cell")
      .on("mousedown", (event) => {
        const [x, y] = d3.pointer(event);
        const time = xScale.invert(x).getTime();
        const price = yScale.invert(y);
        setCurrentShape({ type: drawMode, x1: time, y1: price });
      })
      .on("mouseup", async (event) => {
        if (!currentShape) return;
        const [x, y] = d3.pointer(event);
        const time = xScale.invert(x).getTime();
        const price = yScale.invert(y);
        const newShape = {
          ...currentShape,
          x2: time,
          y2: price,
          signalId,
        };
        const saved = await saveToolToServer(newShape);
        setShapes(prev => [...prev, { ...newShape, _id: saved._id }]);
        setCurrentShape(null);
      });

  }, [data, drawMode, shapes, currentShape, signalId]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        ✏️ أداة الرسم:
        <button onClick={() => setDrawMode("line")}>رسم خط</button>
        <button onClick={() => setDrawMode("rect")}>منطقة دعم</button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CandlestickChart_TimeBased;