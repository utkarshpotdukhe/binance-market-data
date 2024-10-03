import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(...registerables);

// Component to render the candlestick chart using Chart.js
const CandlestickChart = ({ data }) => {
  const chartData = {
    labels: data.map((point) => new Date(point.time)),
    datasets: [
      {
        label: 'Price',
        data: data.map((point) => ({
          x: point.time,
          y: [point.open, point.high, point.low, point.close],
        })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default CandlestickChart;
