
import { useEffect, useRef } from 'react';

export default function useSignalWebSocket(onNewSignal) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_signal') {
        onNewSignal(data.payload);
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onNewSignal]);
}
