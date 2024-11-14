// Dashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
import SimulationParameters from './SimulationParameters';

const Dashboard = () => {
  const [simulationParams, setSimulationParams] = useState({
    temperature: 28.0,
    chargeRate: 1.0,
  });

  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleParamsChange = (newParams) => {
    setSimulationParams(newParams);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setBatteryData(null);

        const simulationParamsToSend = {
          temperature: simulationParams.temperature,
          charge_rate: simulationParams.chargeRate,
        };

        console.log('Sending simulation parameters:', simulationParamsToSend);

        const response = await axios.post(
          'http://127.0.0.1:8000/simulate',
          simulationParamsToSend,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('API response:', response.data);

        if (response.data.time && response.data.voltage) {
          setBatteryData(response.data);
        } else if (response.data.error) {
          setError(response.data.error);
        } else {
          setError('Invalid data received from the simulation.');
        }
      } catch (error) {
        console.error('Error fetching battery data:', error);
        setError('Failed to fetch simulation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [simulationParams]);

  return (
    <div className="p-8 space-y-8">
      <SimulationParameters
        temperature={simulationParams.temperature}
        chargeRate={simulationParams.chargeRate}
        onParamsChange={handleParamsChange}
      />

      <div className="bg-dark-secondary p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Battery Voltage Over Time
        </h2>
        {loading ? (
          <p className="text-gray-200">Loading battery data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : batteryData ? (
          <LineChart data={batteryData} />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
