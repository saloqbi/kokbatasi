// frontend/src/utils/patterns/ABCDPatternDetector.js

/**
 * Detects ABCD patterns in an array of candle data.
 * Each pattern consists of four points: A, B, C, D
 * where AB and CD are similar in length and direction,
 * and BC is a correction.
 */

export function detectABCDPatterns(candles) {
  const patterns = [];

  for (let i = 0; i < candles.length - 4; i++) {
    const A = candles[i];
    const B = candles[i + 1];
    const C = candles[i + 2];
    const D = candles[i + 3];

    const AB = B.close - A.close;
    const BC = C.close - B.close;
    const CD = D.close - C.close;

    const abLength = Math.abs(AB);
    const cdLength = Math.abs(CD);

    const abcdRatio = cdLength / abLength;

    const isValidABCD =
      Math.sign(AB) === Math.sign(CD) &&
      Math.sign(BC) === -Math.sign(AB) &&
      abcdRatio >= 0.9 && abcdRatio <= 1.1;

    if (isValidABCD) {
      patterns.push({
        points: {
          A: { index: i, price: A.close },
          B: { index: i + 1, price: B.close },
          C: { index: i + 2, price: C.close },
          D: { index: i + 3, price: D.close },
        },
        direction: AB > 0 ? 'bullish' : 'bearish',
        abcdRatio: abcdRatio.toFixed(2),
      });
    }
  }

  return patterns;
}
