// backend/services/candleService.js
const axios = require("axios");

const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
const BINANCE_BASE = "https://api.binance.com/api/v3/klines";
const ALPHA_BASE = "https://www.alphavantage.co/query";

// Helper to convert Binance response
function parseBinance(data) {
  return data.map(([time, open, high, low, close]) => ({
    time: new Date(time).toISOString(),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
  }));
}

// Helper to convert Alpha Vantage response
function parseAlpha(data) {
  const timeSeries = data["Time Series (5min)"] || data["Time Series (1min)"] || {};
  return Object.entries(timeSeries).map(([time, ohlc]) => ({
    time,
    open: parseFloat(ohlc["1. open"]),
    high: parseFloat(ohlc["2. high"]),
    low: parseFloat(ohlc["3. low"]),
    close: parseFloat(ohlc["4. close"]),
  })).reverse();
}

// Main fetcher function
async function fetchCandles(symbol) {
  try {
    // Try Alpha Vantage
    const alphaRes = await axios.get(ALPHA_BASE, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol,
        interval: "5min",
        outputsize: "compact",
        apikey: ALPHA_API_KEY,
      },
    });
    if (alphaRes.data && alphaRes.data["Time Series (5min)"]) {
      return { source: "alpha", data: parseAlpha(alphaRes.data) };
    }
  } catch (err) {
    console.warn("Alpha Vantage failed, fallback to Binance...");
  }

  try {
    const binanceSymbol = symbol.toLowerCase() + "usdt";
    const binanceRes = await axios.get(BINANCE_BASE, {
      params: {
        symbol: binanceSymbol.toUpperCase(),
        interval: "5m",
        limit: 100,
      },
    });
    return { source: "binance", data: parseBinance(binanceRes.data) };
  } catch (err) {
    console.error("Binance fetch error:", err.message);
    throw new Error("Failed to fetch candlestick data from all sources.");
  }
}

module.exports = { fetchCandles };
