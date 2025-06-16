// frontend/src/utils/patterns/HarmonicDetector.js

/**
 * Detects harmonic patterns (Gartley, Bat, Butterfly) in candle data.
 * Uses price points: X, A, B, C, D
 */

function isWithin(value, target, tolerance = 0.1) {
  return Math.abs(value - target) <= tolerance * target;
}

function getPatternName(ratios) {
  const { ab, bc, cd, xa } = ratios;

  // Gartley Pattern
  if (
    isWithin(ab / xa, 0.618) &&
    bc >= 0.382 * ab && bc <= 0.886 * ab &&
    isWithin(cd / xa, 0.786)
  ) return "Gartley";

  // Bat Pattern
  if (
    isWithin(ab / xa, 0.5) &&
    bc >= 0.382 * ab && bc <= 0.886 * ab &&
    isWithin(cd / xa, 0.886)
  ) return "Bat";

  // Butterfly Pattern
  if (
    isWithin(ab / xa, 0.786) &&
    bc >= 0.382 * ab && bc <= 0.886 * ab &&
    cd / xa >= 1.27 && cd / xa <= 1.618
  ) return "Butterfly";

  return null;
}

export function detectHarmonicPatterns(candles) {
  const patterns = [];

  for (let i = 0; i < candles.length - 5; i++) {
    const X = candles[i];
    const A = candles[i + 1];
    const B = candles[i + 2];
    const C = candles[i + 3];
    const D = candles[i + 4];

    const xa = A.close - X.close;
    const ab = B.close - A.close;
    const bc = C.close - B.close;
    const cd = D.close - C.close;

    const ratios = { xa, ab, bc, cd };
    const name = getPatternName(ratios);

    if (name) {
      patterns.push({
        name,
        points: {
          X: { index: i, price: X.close },
          A: { index: i + 1, price: A.close },
          B: { index: i + 2, price: B.close },
          C: { index: i + 3, price: C.close },
          D: { index: i + 4, price: D.close },
        },
        direction: xa > 0 ? 'bullish' : 'bearish',
      });
    }
  }

  return patterns;
}
