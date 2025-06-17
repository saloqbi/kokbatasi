// frontend/src/utils/patterns/PriceActionDetector.js

export function detectPriceActionPatterns(candles) {
  const patterns = [];

  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];

    const body = Math.abs(curr.close - curr.open);
    const upperWick = curr.high - Math.max(curr.close, curr.open);
    const lowerWick = Math.min(curr.close, curr.open) - curr.low;
    const totalRange = curr.high - curr.low;
    const isBullish = curr.close > curr.open;
    const isBearish = curr.open > curr.close;

    // ✅ Hammer
    if (body / totalRange < 0.4 && lowerWick / totalRange > 0.5) {
      patterns.push({ index: i, type: "Hammer", direction: "bullish" });
    }

    // ✅ Shooting Star
    if (body / totalRange < 0.4 && upperWick / totalRange > 0.5) {
      patterns.push({ index: i, type: "Shooting Star", direction: "bearish" });
    }

    // ✅ Doji
    if (body / totalRange < 0.1) {
      patterns.push({ index: i, type: "Doji", direction: "neutral" });
    }

    // ✅ Engulfing Bullish
    if (
      isBullish &&
      prev.open > prev.close &&
      curr.open < prev.close &&
      curr.close > prev.open
    ) {
      patterns.push({ index: i, type: "Bullish Engulfing", direction: "bullish" });
    }

    // ✅ Engulfing Bearish
    if (
      isBearish &&
      prev.close > prev.open &&
      curr.open > prev.close &&
      curr.close < prev.open
    ) {
      patterns.push({ index: i, type: "Bearish Engulfing", direction: "bearish" });
    }

    // ✅ Inside Bar
    if (
      curr.high < prev.high &&
      curr.low > prev.low
    ) {
      patterns.push({ index: i, type: "Inside Bar", direction: "neutral" });
    }

    // ✅ Pin Bar (based on large wick and small body)
    if (
      totalRange > 0 &&
      body / totalRange < 0.3 &&
      (upperWick / totalRange > 0.6 || lowerWick / totalRange > 0.6)
    ) {
      patterns.push({ index: i, type: "Pin Bar", direction: upperWick > lowerWick ? "bearish" : "bullish" });
    }
  }

  return patterns;
}
