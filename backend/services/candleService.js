const axios = require("axios");

const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
const ALPHA_BASE = "https://www.alphavantage.co/query";
const BINANCE_BASE = "https://api.binance.com/api/v3/klines";

// ✅ Helper: Convert Alpha Vantage data
function parseAlpha(data) {
  const timeSeries = data["Time Series (5min)"] || data["Time Series (1min)"] || {};
  return Object.entries(timeSeries).map(([time, ohlc]) => ({
    time,
    open: parseFloat(ohlc["1. open"]),
    high: parseFloat(ohlc["2. high"]),
    low: parseFloat(ohlc["3. low"]),
    close: parseFloat(ohlc["4. close"]),
    volume: parseFloat(ohlc["5. volume"] || "0")
  })).reverse();
}

// ✅ Helper: Convert Binance data
function parseBinance(data) {
  return data.map(([time, open, high, low, close, , , , , volume]) => ({
    time: new Date(time).toISOString(),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume || "0")
  }));
}

// ✅ Main fetcher
async function fetchCandles(symbol) {
  // Try Alpha Vantage first
  try {
    const alphaRes = await axios.get(ALPHA_BASE, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol,
        interval: "5min",
        outputsize: "compact",
        apikey: ALPHA_API_KEY,
      },
    });

    console.log("✅ Alpha response keys:", Object.keys(alphaRes.data));
    console.log("✅ Alpha Time Series count:", Object.keys(alphaRes.data["Time Series (5min)"] || {}).length);

    if (
      alphaRes.data &&
      alphaRes.data["Time Series (5min)"] &&
      Object.keys(alphaRes.data["Time Series (5min)"]).length > 0
    ) {
      return { source: "alpha", data: parseAlpha(alphaRes.data) };
    } else {
      throw new Error("Alpha response missing time series");
    }
  } catch (err) {
    console.warn("⚠️ Alpha Vantage failed:", err.message);
  }

  // Fallback to Binance
  try {
    const binanceSymbol = symbol.toLowerCase() + "usdt";
    const binanceRes = await axios.get(BINANCE_BASE, {
      params: {
        symbol: binanceSymbol.toUpperCase(),
        interval: "5m",
        limit: 100,
      },
    });

    console.log("✅ Binance data received:", binanceRes.data.length, "candles");
    return { source: "binance", data: parseBinance(binanceRes.data) };
  } catch (err) {
    console.error("❌ Binance fetch error:", err.message);
    throw new Error("Failed to fetch candlestick data from all sources.");
  }
}

module.exports = { fetchCandles };
