import { useEffect, useRef } from 'react';

export default function useSignalWebSocket(onNewSignal) {
  const ws = useRef(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_BASE.replace(/^http/, 'ws');
    ws.current = new WebSocket(`${socketUrl}`);

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
