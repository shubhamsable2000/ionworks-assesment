'use client';

import React, { useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Brush,
  ResponsiveContainer,
} from 'recharts';

const LineChart = ({ data }) => {
  console.log(data);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  if (!data || !data.time) {
    console.error('Invalid data:', data);
    return null;
  }

  const keys = Object.keys(data);
  const seriesNames = keys.filter((key) => key !== 'time');

  const transformedData = data.time.map((time, index) => {
    const dataPoint = { time };
    seriesNames.forEach((seriesName) => {
      dataPoint[seriesName] = data[seriesName][index];
    });
    return dataPoint;
  });

  const handleLegendClick = (legendData) => {
    const { dataKey } = legendData;
    if (hiddenSeries.includes(dataKey)) {
      setHiddenSeries(hiddenSeries.filter((key) => key !== dataKey));
    } else {
      setHiddenSeries([...hiddenSeries, dataKey]);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickFormatter={(time) => new Date(time * 1000).toLocaleTimeString()}
          label={{
            value: 'Time [s]',
            position: 'insideBottomRight',
            offset: -10,
          }}
        />

        <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend onClick={handleLegendClick} />
        {seriesNames.map((seriesName) => (
          <Line
            key={seriesName}
            type="monotone"
            dataKey={seriesName}
            stroke="#8884d8"
            hide={hiddenSeries.includes(seriesName)}
          />
        ))}
        <Brush
          dataKey="time"
          height={30}
          stroke="#8884d8"
          tickFormatter={(time) => new Date(time * 1000).toLocaleTimeString()}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
