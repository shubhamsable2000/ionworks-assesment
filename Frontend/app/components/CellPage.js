'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CellPage = () => {
  const [model, setModel] = useState('SPM');
  const [thermal, setThermal] = useState('isothermal');
  const [parameterSet, setParameterSet] = useState('Ai2020');
  const [cellName, setCellName] = useState('');
  const [error, setError] = useState(null);
  const [cells, setCells] = useState([]);

  useEffect(() => {
    setCellName(`${model}_${parameterSet}`);
  }, [model, parameterSet]);

  const handleAddCell = async () => {
    if (!cellName.trim()) {
      setError('Please enter a valid cell name.');
      return;
    }
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/parameterize', {
        model,
        thermal,
        parameter_set: parameterSet,
        cell_name: cellName,
      });
      setCells((prevCells) => [...prevCells, response.data.cell_config]);
      setCellName('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to add cell.');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="bg-dark-secondary p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Create New Cell
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="model-select" className="text-gray-100">
              Model
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-gray-700 p-2 rounded text-gray-100"
            >
              <option value="SPM">SPM</option>
              <option value="SPMe">SPMe</option>
              <option value="DFN">DFN</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="thermal-select" className="text-gray-100">
              Thermal
            </label>
            <select
              id="thermal-select"
              value={thermal}
              onChange={(e) => setThermal(e.target.value)}
              className="bg-gray-700 p-2 rounded text-gray-100"
            >
              <option value="isothermal">Isothermal</option>
              <option value="lumped">Lumped</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="parameter-set-select" className="text-gray-100">
              Parameter Set
            </label>
            <select
              id="parameter-set-select"
              value={parameterSet}
              onChange={(e) => setParameterSet(e.target.value)}
              className="bg-gray-700 p-2 rounded text-gray-100"
            >
              <option value="Ai2020">Ai2020</option>
              <option value="Chen2020">Chen2020</option>
              <option value="Chen2020_composite">Chen2020_composite</option>
              <option value="ECM_Example">ECM_Example</option>
              <option value="Ecker2015">Ecker2015</option>
              <option value="Ecker2015_graphite_halfcell">
                Ecker2015_graphite_halfcell
              </option>
              <option value="MSMR_Example">MSMR_Example</option>
              <option value="Marquis2019">Marquis2019</option>
              <option value="Mohtat2020">Mohtat2020</option>
              <option value="NCA_Kim2011">NCA_Kim2011</option>
              <option value="OKane2022">OKane2022</option>
              <option value="OKane2022_graphite_SiOx_halfcell">
                OKane2022_graphite_SiOx_halfcell
              </option>
              <option value="ORegan2022">ORegan2022</option>
              <option value="Prada2013">Prada2013</option>
              <option value="Ramadass2004">Ramadass2004</option>
              <option value="Sulzer2019">Sulzer2019</option>
              <option value="Xu2019">Xu2019</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="cell-name" className="text-gray-100">
              Cell Name
            </label>
            <input
              id="cell-name"
              type="text"
              value={cellName}
              readOnly
              className="bg-gray-700 p-2 rounded text-gray-100"
              placeholder="Enter cell name"
            />
          </div>
          <button
            onClick={handleAddCell}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            + Add Cell
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {cells.length > 0 && (
        <div className="bg-dark-secondary p-8 rounded-3xl shadow-2xl mt-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            Manage Cells
          </h2>
          <table className="w-full text-left text-gray-100">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Thermal</th>
                <th className="px-4 py-2">Library</th>
                <th className="px-4 py-2">Parameters</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cells.map((cell, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2 text-purple-500 underline">
                    {cell.cell_name}
                  </td>
                  <td className="px-4 py-2">{cell.model_type}</td>
                  <td className="px-4 py-2">{cell.thermal_type}</td>
                  <td className="px-4 py-2">PyBaMM</td>
                  <td className="px-4 py-2">{cell.parameter_set}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="text-purple-500">
                      <i className="fas fa-chart-bar"></i>
                    </button>
                    <button className="text-purple-500">
                      <i className="fas fa-search"></i>
                    </button>
                    <button className="text-purple-500">
                      <i className="fas fa-font"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CellPage;
