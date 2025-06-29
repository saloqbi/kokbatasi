import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const CandlestickChart_TimeBased = ({ data, signalId, width = 800, height = 400 }) => {
  const svgRef = useRef();
  const [drawMode, setDrawMode] = useState("line");
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);

  // ✅ تحميل الأدوات من السيرفر مع فلترة
  const fetchToolsFromServer = async () => {
    try {
      const res = await fetch(`https://kokbatasi.onrender.com/api/tools/${signalId}`);
      const tools = await res.json();
      const valid = tools.filter(t =>
        t && typeof t.x1 === "number" && typeof t.y1 === "number" &&
        typeof t.x2 === "number" && typeof t.y2 === "number" &&
        !isNaN(t.x1) && !isNaN(t.y1) && !isNaN(t.x2) && !isNaN(t.y2)
      );
      setShapes(valid);
    } catch (err) {
      console.error("❌ فشل تحميل الأدوات:", err);
    }
  };

  // ✅ حفظ أداة جديدة
  const saveToolToServer = async (tool) => {
    try {
      const res = await fetch("https://kokbatasi.onrender.com/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tool)
      });
      const saved = await res.json();
      return saved;
    } catch (err) {
      console.error("❌ فشل حفظ الأداة:", err);
    }
  };

  // ✅ تحديث أداة
  const updateToolOnServer = async (toolId, updatedTool) => {
    try {
      await fetch(`https://kokbatasi.onrender.com/api/tools/${toolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTool)
      });
    } catch (err) {
      console.error("❌ فشل تحديث الأداة:", err);
    }
  };

  useEffect(() => { fetchToolsFromServer(); }, [signalId]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const parsedData = data.map(d => ({ ...d, date: new Date(d.timestamp) }))
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

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const candleWidth = innerWidth / parsedData.length * 0.7;

    // 🕯️ رسم الشموع
    g.selectAll(".candle")
      .data(parsedData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.date) - candleWidth / 2)
      .attr("y", d => yScale(Math.max(d.open, d.close)))
      .attr("width", candleWidth)
      .attr("height", d => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", d => (d.close > d.open ? "#4caf50" : "#f44336"));

    // ظلال الشموع
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

    // 📐 رسم الأدوات
    const shapeGroup = g.append("g");
    shapes.forEach((shape, index) => {
      if (shape.type === "line") {
        const x1 = xScale(new Date(shape.x1));
        const y1 = yScale(shape.y1);
        const x2 = xScale(new Date(shape.x2));
        const y2 = yScale(shape.y2);

        if ([x1, y1, x2, y2].some(v => isNaN(v))) {
          console.warn("❌ تجاهل شكل بسبب NaN:", shape);
          return;
        }

        shapeGroup.append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "#2196f3")
          .attr("stroke-width", 2)
          .style("cursor", "move")
          .call(d3.drag().on("drag", (event) => {
            const dx = xScale.invert(event.dx + x1).getTime() - shape.x1;
            const dy = yScale.invert(y1 + event.dy) - shape.y1;
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
    });

    // 🖱️ التفاعل مع الماوس للرسم
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

  }, [data, shapes, signalId, drawMode]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        ✏️ أداة الرسم:
        <button onClick={() => setDrawMode("line")}>رسم خط</button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CandlestickChart_TimeBased;