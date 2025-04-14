
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadSegment, TrafficLightData, EmergencyVehicle } from '@/types/traffic';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TrafficMapProps {
  roads: RoadSegment[];
  trafficLights: TrafficLightData[];
  emergencyVehicles: EmergencyVehicle[];
}

const createTrafficLightIcon = (status: string) => {
  let color = '#999';
  
  if (status === 'red') color = '#ef4444';
  if (status === 'yellow') color = '#f59e0b';
  if (status === 'green') color = '#10b981';
  
  return L.divIcon({
    className: 'custom-traffic-light',
    html: `<div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const createEmergencyVehicleIcon = (type: string) => {
  let color = '#3b82f6'; // default blue for police
  
  if (type === 'ambulance') color = '#ef4444';
  if (type === 'fire') color = '#f97316';
  
  return L.divIcon({
    className: 'custom-emergency-vehicle',
    html: `<div style="width: 14px; height: 14px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5); animation: pulse 1.5s infinite;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

// Custom Marker component with properly typed props
interface CustomMarkerProps {
  position: [number, number];
  icon: L.DivIcon | L.Icon;
  eventHandlers?: {
    mouseover: () => void;
    mouseout: () => void;
  };
  children: React.ReactNode;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, icon, eventHandlers, children }) => {
  // Create the marker instance
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    // Create the marker with the specified icon
    const marker = L.marker(position, { icon });
    markerRef.current = marker;
    
    // Add event handlers if provided
    if (eventHandlers) {
      if (eventHandlers.mouseover) marker.on('mouseover', eventHandlers.mouseover);
      if (eventHandlers.mouseout) marker.on('mouseout', eventHandlers.mouseout);
    }
    
    // Add the marker to the map
    marker.addTo(map);
    
    // Cleanup function
    return () => {
      marker.removeFrom(map);
    };
  }, [map, position, icon, eventHandlers]);
  
  return null;
};

const SetInitialView = () => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([40.7128, -74.0060], 13);
  }, [map]);
  
  return null;
};

// Display road segments on the map
const RoadSegments: React.FC<{ roads: RoadSegment[] }> = ({ roads }) => {
  return (
    <>
      {roads.map(road => (
        <Polyline
          key={road.id}
          positions={[road.startPoint, road.endPoint]}
          pathOptions={{
            color: 
              road.congestionLevel === 'severe' ? '#ef4444' :
              road.congestionLevel === 'high' ? '#f97316' :
              road.congestionLevel === 'moderate' ? '#f59e0b' : 
              '#10b981',
            weight: 4,
            opacity: 0.8
          }}
        >
          <Popup>
            <div>
              <strong>{road.name}</strong><br/>
              <span>Congestion: {road.congestionLevel}</span>
            </div>
          </Popup>
        </Polyline>
      ))}
    </>
  );
};

const MapContent: React.FC<{
  roads: RoadSegment[];
  trafficLights: TrafficLightData[];
  emergencyVehicles: EmergencyVehicle[];
}> = ({ roads, trafficLights, emergencyVehicles }) => {
  const map = useMap();
  const [hoveredIntersection, setHoveredIntersection] = useState<string | null>(null);
  
  const activeEmergencyVehicles = emergencyVehicles.filter(v => v.status === 'active');

  // Display road network
  useEffect(() => {
    if (roads.length > 0) {
      // Create bounds to fit all road segments
      const bounds = L.latLngBounds([]);
      
      roads.forEach(road => {
        bounds.extend(road.startPoint);
        bounds.extend(road.endPoint);
      });
      
      // Fit map to show all roads
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [roads, map]);

  const getRandomLocation = (centerLng: number, centerLat: number, radius: number) => {
    const y0 = centerLat;
    const x0 = centerLng;
    const rd = radius / 111300;
    
    const u = Math.random();
    const v = Math.random();
    
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    
    const lat = y + y0;
    const lng = x + x0;
    
    return [lat, lng];
  };

  return (
    <>
      {/* Display road segments */}
      <RoadSegments roads={roads} />
      
      {/* Display traffic lights */}
      {trafficLights.map(light => {
        const [lat, lng] = getRandomLocation(-74.0060, 40.7128, 0.03);
        const lightIcon = createTrafficLightIcon(light.status);
        
        return (
          <div key={light.id}>
            <CustomMarker
              position={[lat, lng]}
              icon={lightIcon}
              eventHandlers={{
                mouseover: () => setHoveredIntersection(light.location),
                mouseout: () => setHoveredIntersection(null),
              }}
            >
              <></>
            </CustomMarker>
            <Popup position={[lat, lng]}>
              <div>
                <strong>Intersection:</strong> {light.location}<br />
                <strong>Status:</strong> {light.status}<br />
                <strong>Last Updated:</strong> {new Date(light.lastUpdated).toLocaleTimeString()}
              </div>
            </Popup>
          </div>
        );
      })}

      {/* Display emergency vehicles */}
      {activeEmergencyVehicles.map(vehicle => {
        const [lat, lng] = vehicle.location;
        const destLat = vehicle.destination[1];
        const destLng = vehicle.destination[0];
        const vehicleIcon = createEmergencyVehicleIcon(vehicle.type);
        
        return (
          <React.Fragment key={vehicle.id}>
            <div>
              <CustomMarker position={[lat, lng]} icon={vehicleIcon}>
                <></>
              </CustomMarker>
              <Popup position={[lat, lng]}>
                <div>
                  <strong>{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</strong><br />
                  <strong>ID:</strong> {vehicle.id}<br />
                  <strong>Status:</strong> {vehicle.status}
                </div>
              </Popup>
            </div>
            
            <Polyline
              positions={[[lat, lng], [destLat, destLng]]}
              pathOptions={{
                color: vehicle.type === 'ambulance' ? '#ff0000' : 
                        vehicle.type === 'fire' ? '#ff6600' : '#0066ff',
                weight: 3,
                dashArray: '5, 5',
                opacity: 0.8
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

const TrafficMap: React.FC<TrafficMapProps> = ({ roads, trafficLights, emergencyVehicles }) => {
  const activeEmergencyVehicles = emergencyVehicles.filter(v => v.status === 'active');
  
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Traffic Map</CardTitle>
          <div className="flex space-x-2">
            {activeEmergencyVehicles.length > 0 && (
              <Badge variant="destructive" className="pulse">
                {activeEmergencyVehicles.length} Emergency Vehicles
              </Badge>
            )}
            <Badge variant="outline">Live</Badge>
          </div>
        </div>
        <CardDescription>Real-time city traffic visualization</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full border rounded-md bg-secondary/20 overflow-hidden"
        >
          <MapContainer
            style={{ height: '300px', width: '100%' }}
          >
            <SetInitialView />
            <ZoomControl position="topright" />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapContent 
              roads={roads} 
              trafficLights={trafficLights} 
              emergencyVehicles={emergencyVehicles} 
            />
          </MapContainer>
          
          <div className="absolute top-2 left-2 bg-background/90 p-2 rounded text-xs shadow-md border">
            <div className="flex items-center mb-1">
              <span className="inline-block w-3 h-2 bg-green-500 mr-2"></span>
              <span>Low Traffic</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="inline-block w-3 h-2 bg-orange-500 mr-2"></span>
              <span>Moderate</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-2 bg-red-500 mr-2"></span>
              <span>Heavy</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TrafficMap;
