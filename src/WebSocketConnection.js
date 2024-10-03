import { useEffect, useState, useRef } from 'react';

// WebSocket connection function to retrieve live data
const useWebSocketConnection = (symbol, interval) => {
  const [chartData, setChartData] = useState([]);
  const wsRef = useRef(null);

  const handleWebSocketMessage = (message) => {
    const data = JSON.parse(message.data);
    const candlestick = data.k;
    
    // Extracting candlestick data
    if (candlestick.x) { // 'x' indicates the candlestick is closed
      setChartData((prevData) => [
        ...prevData,
        {
          time: candlestick.t,
          open: candlestick.o,
          high: candlestick.h,
          low: candlestick.l,
          close: candlestick.c,
        },
      ]);
    }
  };

  // UseEffect for WebSocket connection and cleanup
  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = handleWebSocketMessage;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, interval]);

  return chartData;
};

export default useWebSocketConnection;
