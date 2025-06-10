// ✅ Gann Grid الزمنية
const [gannGridLines, setGannGridLines] = useState([]);
const [gannLevels, setGannLevels] = useState([]);
const [timeCycles, setTimeCycles] = useState([]);
const [octaveLines, setOctaveLines] = useState([]);
const [square144, setSquare144] = useState([]);
const [autoTrendLines, setAutoTrendLines] = useState([]);
const [harmonicPatterns, setHarmonicPatterns] = useState([]);
const [fractalManual, setFractalManual] = useState([]);
const [fractalAuto, setFractalAuto] = useState([]);
const [elliottManual, setElliottManual] = useState([]);
const [elliottAuto, setElliottAuto] = useState([]);

// داخل handleSignalSelect:
setGannGridLines([]);
setGannLevels([]);
setTimeCycles([]);
setOctaveLines([]);
setSquare144([]);
setAutoTrendLines([]);
setHarmonicPatterns([]);
setFractalManual([]);
setFractalAuto([]);
setElliottManual([]);
setElliottAuto([]);

// باقي أدوات Gann محفوظة هنا...

if (signal.drawHarmonic) {
  const patterns = [
    { points: [x, y, x + 60, y - 40, x + 120, y - 20, x + 180, y - 60], label: "ABCD" },
    { points: [x, y, x + 40, y - 60, x + 80, y - 10, x + 120, y - 80, x + 160, y - 30], label: "Gartley" },
  ];
  setHarmonicPatterns(patterns);
}

if (signal.drawFractalManual) {
  const points = [
    { x: x + 20, y: y - 60 },
    { x: x + 60, y: y + 20 },
    { x: x + 100, y: y - 40 }
  ];
  setFractalManual(points);
}

if (signal.drawFractalAuto) {
  const points = [];
  for (let i = 1; i <= 5; i++) {
    points.push({ x: x + i * 40, y: y + (i % 2 === 0 ? -30 : 30) });
  }
  setFractalAuto(points);
}

if (signal.drawElliottManual) {
  const wave = [
    { x: x, y: y },
    { x: x + 40, y: y - 50 },
    { x: x + 80, y: y + 20 },
    { x: x + 120, y: y - 80 },
    { x: x + 160, y: y + 30 }
  ];
  setElliottManual(wave);
}

if (signal.drawElliottAuto) {
  const wave = [];
  for (let i = 0; i < 5; i++) {
    wave.push({ x: x + i * 50, y: y + (i % 2 === 0 ? -40 : 40) });
  }
  setElliottAuto(wave);
}

// داخل <Layer>:
{toolLayers.fractal && fractalManual.map((p, i) => (
  <Circle key={`fr-m-${i}`} x={p.x} y={p.y} radius={4} fill="#f59e0b" />
))}

{toolLayers.fractal && fractalAuto.map((p, i) => (
  <Circle key={`fr-a-${i}`} x={p.x} y={p.y} radius={4} fill="#ef4444" />
))}

{toolLayers.elliott && elliottManual.map((p, i) => (
  i > 0 && <Line key={`el-m-${i}`} points={[elliottManual[i-1].x, elliottManual[i-1].y, p.x, p.y]} stroke="#3b82f6" strokeWidth={1.5} />
))}

{toolLayers.elliott && elliottAuto.map((p, i) => (
  i > 0 && <Line key={`el-a-${i}`} points={[elliottAuto[i-1].x, elliottAuto[i-1].y, p.x, p.y]} stroke="#0ea5e9" strokeWidth={1.5} dash={[2, 2]} />
))}

// طبقات إضافية
toolLayers.harmonic: true,
toolLayers.fractal: true,
toolLayers.elliott: true,

{key === "harmonic" && "🌀 نماذج هارمونيك"}
{key === "fractal" && "🧬 نمط فركتالي"}
{key === "elliott" && "🌊 موجات إليوت"}
