// websocket.js
let socket;

export function subscribeToCandles(symbol, onData) {
  if (socket) socket.close();

  socket = new WebSocket("wss://stream.tradingview.com/socket.io/websocket");

  socket.onopen = () => {
    console.log("✅ TradingView WebSocket connected");

    const session = `qs_${Math.random().toString(36).substring(2, 15)}`;

    // إنشاء جلسة
    socket.send(`~m~40~m~`);

    // إنشاء قناة بيانات
    socket.send(`~m~42~m~["quote_create_session","${session}"]`);
    socket.send(`~m~42~m~["quote_add_symbols","${session}","${symbol}"]`);
  };

  socket.onmessage = (event) => {
    const msg = event.data;

    if (msg.includes("~m~")) {
      const jsonPart = msg.split("~m~")[2];
      if (!jsonPart) return;

      try {
        const parsed = JSON.parse(jsonPart);
        if (Array.isArray(parsed) && parsed[0] === "qsd") {
          const data = parsed[1];

          if (data && data.lp && data.ltp) {
            const candle = {
              date: new Date(),
              open: data.ltp,
              high: data.lp,
              low: data.lp,
              close: data.lp,
            };
            onData(candle);
          }
        }
      } catch (e) {
        console.warn("❌ Failed to parse WebSocket data:", e);
      }
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket Error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket closed.");
  };
}
