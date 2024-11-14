'use client';

import React from 'react';

const SimulationParameters = ({ temperature, chargeRate, onParamsChange }) => {
  const handleTemperatureChange = (e) => {
    const value = parseFloat(e.target.value);
    onParamsChange({ temperature: value, chargeRate });
  };

  const handleChargeRateChange = (e) => {
    const value = parseFloat(e.target.value);
    onParamsChange({ temperature, chargeRate: value });
  };

  return (
    <div className="bg-dark-secondary p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Simulation Parameters
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-gray-200">
          <label htmlFor="temperature" className="mr-4">
            Temperature (°C):
          </label>
          <input
            id="temperature"
            type="number"
            value={temperature}
            onChange={handleTemperatureChange}
            className="w-24 p-1 rounded bg-gray-700 text-gray-100"
          />
        </div>
        <div className="flex items-center justify-between text-gray-200">
          <label htmlFor="chargeRate" className="mr-4">
            Charge Rate (C):
          </label>
          <input
            id="chargeRate"
            type="number"
            value={chargeRate}
            onChange={handleChargeRateChange}
            className="w-24 p-1 rounded bg-gray-700 text-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationParameters;
