// ... (نفس الاستيرادات)

const SignalDetails = () => {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("candles");
  const [lines, setLines] = useState([]);
  const [zones, setZones] = useState([]);
  const [fractals, setFractals] = useState([]);
  const [waves, setWaves] = useState([]);
  const [abcdPatterns, setABCDPatterns] = useState([]);
  const [harmonicPatterns, setHarmonicPatterns] = useState([]);
  const [priceActions, setPriceActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState([]);

  const [activeTool, setActiveTool] = useState("line"); // ✅ مضافة

  const apiBase = import.meta.env.VITE_REACT_APP_API_URL;

  // ... باقي الدوال مثل detectFractals و detectElliottWaves ...

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let signalData;

        if (id === "mock-harmonic-test") {
          signalData = {
            symbol: "MOCK",
            action: "buy",
            data: [/* ... بيانات الشموع ... */]
          };
        } else {
          const signalRes = await axios.get(`${apiBase}/api/signals/${id}`);
          signalData = typeof signalRes.data === "object" ? signalRes.data : null;
        }

        if (!signalData) throw new Error("❌ التوصية غير موجودة أو غير صالحة.");
        signalData.action = signalData.action || signalData.type?.toLowerCase();
        if (!signalData.symbol) throw new Error("❌ لا يوجد رمز صالح للتوصية.");

        const hasData = Array.isArray(signalData.data) && signalData.data.length > 0;
        const candles = hasData ? signalData.data : liveData;

        if (!hasData) {
          subscribeToCandles(signalData.symbol, (newCandle) => {
            setLiveData(prev => [...prev.slice(-29), newCandle]);
          });
        }

        const fractalDetected = detectFractals(candles);
        const waveDetected = detectElliottWaves(fractalDetected);
        const abcdDetected = detectABCDPatterns(candles);
        const harmonicDetected = detectHarmonicPatterns(candles);
        const priceActionDetected = detectPriceActionPatterns(candles);

        setSignal(signalData);
        setLines(signalData.lines || []);
        setZones(signalData.zones || []);
        setFractals(fractalDetected);
        setWaves(waveDetected);
        setABCDPatterns(abcdDetected);
        setHarmonicPatterns(harmonicDetected);
        setPriceActions(priceActionDetected);
      } catch (err) {
        console.error("❌ فشل تحميل التوصية:", err);
        setError("فشل في تحميل البيانات. تأكد من الاتصال ووجود التوصية.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, liveData]);

  useEffect(() => {
    if (!signal || id === "mock-harmonic-test") return;
    const timeout = setTimeout(() => {
      axios.put(`${apiBase}/api/signals/${id}/drawings`, {
        lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions]);

  if (loading) return <div>📊 جاري تحميل التوصية...</div>;
  if (error) return <div className="text-red-600">❌ {error}</div>;
  if (!signal) return <div>⚠️ لا توجد توصية.</div>;

  const combinedData = Array.isArray(signal.data) && signal.data.length > 0 ? signal.data : liveData;

  return (
    <ToolProvider>
      <SignalContext.Provider value={{ selectedSignal: signal }}>
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold text-center">
            تفاصيل التوصية: {signal.symbol || "?"} ({signal.action || "?"})
          </h2>

          <Tabs
            tabs={[
              { key: "candles", label: "الشموع اليابانية" },
              { key: "analysis", label: "📊 تحليل فني" },
              { key: "draw", label: "✍️ أدوات الرسم" }
            ]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />

          <div className="border rounded-xl p-3 shadow bg-white">
            {selectedTab === "candles" && (
              combinedData.length > 0 ? (
                <CandlestickChart symbol={signal.symbol} data={combinedData} />
              ) : (
                <div className="text-yellow-600">⚠️ لا توجد بيانات شموع متاحة لهذا الرمز.</div>
              )
            )}

            {selectedTab === "analysis" && (
              <>
                <TechnicalAnalysisTab lines={lines} zones={zones} />
                <ToolSelector activeTool={activeTool} onToolChange={setActiveTool} />
              </>
            )}

            {selectedTab === "draw" && (
              <>
                <div className="mb-2 text-sm text-gray-700">
                  🌀 عدد الفراكتلات: {fractals.length} | 🌊 إليوت: {waves.length} | 🔷 ABCD: {abcdPatterns.length} | 🎯 Harmonic: {harmonicPatterns.length} | ⭐️ Price Action: {priceActions.length}
                </div>
                <ToolSelector activeTool={activeTool} onToolChange={setActiveTool} />
                <DrawingTools
                  activeTool={activeTool}
                  lines={lines}
                  zones={zones}
                  fractals={fractals}
                  waves={waves}
                  abcdPatterns={abcdPatterns}
                  harmonicPatterns={harmonicPatterns}
                  priceActions={priceActions}
                  onLinesChange={setLines}
                  onZonesChange={setZones}
                  onFractalsChange={setFractals}
                  onWavesChange={setWaves}
                />
              </>
            )}
          </div>
        </div>
      </SignalContext.Provider>
    </ToolProvider>
  );
};

export default SignalDetails;
