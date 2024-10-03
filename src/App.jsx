import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const binanceWSUrl = 'wss://stream.binance.com:9443/ws';

const coins = {
  ETHUSDT: 'ethusdt',
  BNBUSDT: 'bnbusdt',
  DOTUSDT: 'dotusdt',
};

const intervals = ['1m', '3m', '5m'];

export default function App() {
  const [selectedCoin, setSelectedCoin] = useState('ethusdt');
  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [chartData, setChartData] = useState([]);
  const ws = useRef(null);

  // Function to establish WebSocket connection
  const connectWebSocket = () => {
    const streamUrl = `${binanceWSUrl}/${selectedCoin}@kline_${selectedInterval}`;
    ws.current = new WebSocket(streamUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candlestick = {
        time: new Date(data.k.t).toLocaleTimeString(),
        open: data.k.o,
        high: data.k.h,
        low: data.k.l,
        close: data.k.c,
      };

      setChartData((prevData) => {
        const newData = [...prevData, candlestick];
        // Limit data points for performance
        if (newData.length > 100) newData.shift();
        return newData;
      });
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed. Reconnecting...');
      connectWebSocket(); // Automatically reconnect
    };
  };

  // Close WebSocket connection on unmount
  useEffect(() => {
    if (ws.current) ws.current.close();
    connectWebSocket();

    return () => ws.current.close();
  }, [selectedCoin, selectedInterval]);

  const handleCoinChange = (e) => {
    setSelectedCoin(e.target.value);
  };

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  // Prepare chart data
  const data = {
    labels: chartData.map((data) => data.time),
    datasets: [
      {
        label: `${selectedCoin.toUpperCase()} Price`,
        data: chartData.map((data) => data.close),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="App">
      <h1>Binance Cryptocurrency Chart</h1>

      {/* Dropdown for selecting coin */}
      <label>
        Select Coin:
        <select value={selectedCoin} onChange={handleCoinChange}>
          {Object.entries(coins).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* Dropdown for selecting interval */}
      <label>
        Select Interval:
        <select value={selectedInterval} onChange={handleIntervalChange}>
          {intervals.map((interval) => (
            <option key={interval} value={interval}>
              {interval}
            </option>
          ))}
        </select>
      </label>

      {/* Candlestick chart */}
      <Line data={data} />
    </div>
  );
}
