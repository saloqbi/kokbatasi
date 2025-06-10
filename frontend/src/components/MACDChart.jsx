import { useEffect, useState, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { SignalContext } from "../context/SignalContext";
import axios from "axios";

const MACDChart = () => {
  const { selectedSignal } = useContext(SignalContext);
  const [macdData, setMacdData] = useState([]);

  useEffect(() => {
    if (!selectedSignal || !selectedSignal.symbol) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/market-data/${selectedSignal.symbol}`);
        const rawData = res.data;

        if (!rawData || rawData.length < 26) return;

        const ema = (data, period) => {
          const k = 2 / (period + 1);
          let emaArray = [];
          let emaPrev = data[0].close;
          data.forEach((point) => {
            emaPrev = point.close * k + emaPrev * (1 - k);
            emaArray.push({ ...point, ema: emaPrev });
          });
          return emaArray;
        };

        const ema12 = ema(rawData, 12);
        const ema26 = ema(rawData, 26);

        const macd = ema12.map((point, i) => ({
          ...point,
          macd: ema12[i].ema - ema26[i].ema,
        }));

        const signal = ema(macd, 9).map((point, i) => ({
          ...point,
          signal: point.ema,
        }));

        const final = signal.map((point, i) => {
          const candleLabel = detectCandlePattern(rawData[i]);
          const harmonicLabel = detectHarmonicPattern(rawData, i);
          const elliottLabel = detectElliottWave(rawData, i);
          return {
            time: point.time,
            macd: macd[i].macd,
            signal: point.signal,
            label: elliottLabel || harmonicLabel || candleLabel,
          };
        });

        setMacdData(final);
      } catch (err) {
        console.error("Error fetching market data:", err);
      }
    };

    fetchData();
  }, [selectedSignal]);

  const detectCandlePattern = (bar) => {
    const body = Math.abs(bar.open - bar.close);
    const range = bar.high - bar.low;
    const upperShadow = bar.high - Math.max(bar.open, bar.close);
    const lowerShadow = Math.min(bar.open, bar.close) - bar.low;

    if (body <= range * 0.3 && upperShadow >= range * 0.4 && lowerShadow < range * 0.1) return "Shooting Star";
    if (body <= range * 0.3 && lowerShadow >= range * 0.4 && upperShadow < range * 0.1) return "Hammer";
    if (bar.open < bar.close && bar.open > bar.low && bar.close < bar.high) return "Bullish";
    if (bar.open > bar.close && bar.close > bar.low && bar.open < bar.high) return "Bearish";
    return null;
  };

  const detectHarmonicPattern = (data, i) => {
    if (i < 3) return null;
    const A = data[i - 3].close;
    const B = data[i - 2].close;
    const C = data[i - 1].close;
    const D = data[i].close;

    const ab = Math.abs(B - A);
    const cd = Math.abs(D - C);
    const abcdRatio = cd / ab;
    const gartley = abcdRatio >= 0.618 && abcdRatio <= 0.786;
    const abcd = Math.abs(ab - cd) / ab < 0.1;

    if (abcd) return "ABCD";
    if (gartley) return "Gartley";
    return null;
  };

  const detectElliottWave = (data, i) => {
    if (i < 4) return null;
    const close = (idx) => data[idx].close;
    if (close(i - 4) < close(i - 3) && close(i - 3) > close(i - 2) && close(i - 2) < close(i - 1) && close(i - 1) > close(i)) {
      return "Elliott Wave";
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-bold mb-2">MACD + الشموع + الهارمونيك + إليوت</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={macdData}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="macd" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="signal" stroke="#82ca9d" dot={false} />
          <LabelList dataKey="label" position="top" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MACDChart;
