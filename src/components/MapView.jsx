import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ route, trafficEnabled, onMapLoaded }) => {
  const trafficData = [
    {
      name: "Andheri Junction",
      lat: 19.1197,
      lon: 72.8464,
      congestion: "High",
    },
    {
      name: "Kurla Station",
      lat: 19.0728,
      lon: 72.8826,
      congestion: "Very High",
    },
    // Add more traffic points if needed
  ];

  const congestionColor = (level) => {
    switch (level) {
      case "Very High":
        return "#ff0000";
      case "High":
        return "#ff6600";
      case "Medium":
        return "#ffcc00";
      case "Low":
        return "#00cc00";
      default:
        return "#999999";
    }
  };

  const renderTraffic = () =>
    trafficData.map((location, idx) => (
      <Marker
        key={idx}
        position={[location.lat, location.lon]}
        icon={L.divIcon({
          html: (
            <div style="width:12px;height:12px;background:${congestionColor(location.congestion)};border-radius:50%;"></div>
          ),
          iconSize: [12, 12],
          className: "",
        })}
      >
        <Popup>
          {location.name}: {location.congestion}
        </Popup>
      </Marker>
    ));

  const MapReadyNotifier = () => {
    const map = useMap();

    useEffect(() => {
      onMapLoaded?.(); // Notify parent when map is ready
    }, [map]);

    return null;
  };

  const routeColors = ["blue", "green", "purple", "orange", "red"]; // cycle through colors if multiple

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapReadyNotifier />

      {trafficEnabled && renderTraffic()}

      {Array.isArray(route) &&
        route.map((r, idx) => (
          <Polyline
            key={idx}
            positions={r.coordinates}
            pathOptions={{
              color: routeColors[idx % routeColors.length],
              weight: 4,
            }}
          />
        ))}
    </MapContainer>
  );
};

export default MapView;
