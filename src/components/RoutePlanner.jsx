import React, { useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaSearch, FaTrafficLight } from 'react-icons/fa';

const RoutePlanner = ({ onRouteCalculated, trafficEnabled, onTrafficToggle }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const geocode = async (place) => {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
        limit: 1
      }
    });
    if (res.data.length > 0) {
      return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
    } else {
      throw new Error('Location not found');
    }
  };

  const handleRoute = async () => {
    try {
      setLoading(true);
      const [startCoords, endCoords] = await Promise.all([
        geocode(start),
        geocode(end)
      ]);

      const res = await axios.get('https://router.project-osrm.org/route/v1/driving/' +
        `${startCoords[1]},${startCoords[0]};${endCoords[1]}, ${endCoords[0]}`,
        { params: { overview: 'full', geometries: 'geojson' } }
      );

      const coords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      onRouteCalculated(coords);
    } catch (error) {
      alert('Could not calculate route: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block font-medium">Start Location</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="e.g. Andheri"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">End Location</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="e.g. Dadar"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          disabled={loading}
        >
          <FaSearch /> {loading ? 'Calculating...' : 'Get Route'}
        </button>
        <button
          onClick={onTrafficToggle}
          className="bg-gray-300 px-4 py-2 rounded flex items-center gap-2"
        >
          <FaTrafficLight /> {trafficEnabled ? 'Hide Traffic' : 'Show Traffic'}
        </button>
      </div>
    </div>
  );
};

export default RoutePlanner;