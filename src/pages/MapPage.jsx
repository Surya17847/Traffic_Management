import React, { useState, useEffect, useRef } from "react";
import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";
import { motion } from "framer-motion";

const MapPage = () => {
  const [route, setRoute] = useState(null);
  const [trafficEnabled, setTrafficEnabled] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleRouteCalculated = (routeData) => {
    setRoute(routeData);
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row h-full"
      >
        {/* Sidebar for route planning */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-4 shadow-lg z-10">
          <RoutePlanner
            onRouteCalculated={handleRouteCalculated}
            trafficEnabled={trafficEnabled}
            onTrafficToggle={() => setTrafficEnabled(!trafficEnabled)}
          />
        </div>

        {/* Map container */}
        <div className="flex-grow relative">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
              <div className="animate-pulse text-gray-500">Loading map...</div>
            </div>
          )}
          <MapView
            route={route}
            trafficEnabled={trafficEnabled}
            onMapLoaded={() => setMapLoaded(true)}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MapPage;
