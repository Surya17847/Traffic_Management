import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Car,
  Wifi,
  Search,
  Loader2,
  MapIcon,
  Navigation,
} from "lucide-react";
import { mockData } from "@/data/mockData";
import { RoadSegment, Route as RouteType } from "@/types/traffic";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import {
  generateAlternativeRoutes,
  calculatePathDistance,
  getCongestionLevel,
  getTrafficDelay,
} from "@/utils/routeUtils";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to set initial view for the map
const SetInitialView = () => {
  const map = useMap();

  useEffect(() => {
    map.setView([40.7128, -74.006], 12);
  }, [map]);

  return null;
};

// Map content component to handle map operations
const MapContent = ({ routes, selectedRoute, showTraffic }) => {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const bounds = L.latLngBounds([]);
      routes.forEach((route) => {
        route.coordinates.forEach((coord) => {
          bounds.extend([coord[0], coord[1]]);
        });
      });
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, map]);

  if (routes.length === 0) return null;

  const firstRoute = routes[0];

  return (
    <>
      {routes.map((route, index) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          pathOptions={{
            color:
              route.id === selectedRoute
                ? index === 0
                  ? "#3b82f6"
                  : index === 1
                  ? "#10b981"
                  : "#f59e0b"
                : index === 0
                ? "#3b82f6"
                : index === 1
                ? "#10b981"
                : "#f59e0b",
            weight: route.id === selectedRoute ? 8 : 4,
            opacity: route.id === selectedRoute ? 0.9 : 0.6,
          }}
        />
      ))}

      <Marker position={firstRoute.coordinates[0]}>
        <Popup>
          <strong>Start: </strong>
          {firstRoute.startLocationName}
        </Popup>
      </Marker>

      <Marker position={firstRoute.coordinates[firstRoute.coordinates.length - 1]}>
        <Popup>
          <strong>Destination: </strong>
          {firstRoute.endLocationName}
        </Popup>
      </Marker>
    </>
  );
};

// Simple Route Planner component
const SimplifiedRoutePlanner = ({
  onRouteCalculated,
  trafficEnabled,
  onTrafficToggle,
}) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const geocode = async (place) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: place,
            format: "json",
            limit: 1,
          },
        }
      );

      if (res.data.length > 0) {
        return {
          coords: [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)],
          display_name: res.data[0].display_name,
        };
      } else {
        throw new Error(`Location "${place}" not found`);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  const handleRoute = async () => {
    if (!start || !end) {
      toast({
        title: "Required Fields",
        description: "Please enter both start and end locations",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Geocode both locations
      const startLocation = await geocode(start);
      const endLocation = await geocode(end);

      // Get route from OSRM
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLocation.coords[1]},${startLocation.coords[0]};${endLocation.coords[1]},${endLocation.coords[0]}`,
        {
          params: {
            alternatives: true,
            overview: "full",
            geometries: "geojson",
          },
        }
      );

      // Use consistent start/end names for all routes
      const commonStartName = startLocation.display_name;
      const commonEndName = endLocation.display_name;

      // Transform the response into our route format
      const routes = res.data.routes.map((route, index) => {
        const coordinates = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        const distance = route.distance / 1000; // meters to km
        const duration = Math.round(route.duration / 60); // seconds to minutes
        const congestionLevel = getCongestionLevel(index !== 0);
        const trafficDelay = getTrafficDelay(congestionLevel, duration);

        return {
          id: `route-${index + 1}`,
          name:
            index === 0
              ? "Main Route"
              : index === 1
              ? "Alternative Route"
              : "Scenic Route",
          startLocationName: commonStartName,
          endLocationName: commonEndName,
          coordinates,
          duration,
          distance,
          trafficDelay,
          congestionLevel,
        };
      });

      onRouteCalculated(routes);

      toast({
        title: "Routes Found",
        description: `Found ${routes.length} routes from ${start} to ${end}`,
      });
    } catch (error) {
      console.error("Route calculation error:", error);
      toast({
        title: "Error",
        description: error.message || "Could not calculate route",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Route Finder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Location</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Andheri"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Location</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Dadar"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleRoute} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              Get Route
              <Navigation className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onTrafficToggle}>
          <Wifi className="mr-2 h-4 w-4" />
          {trafficEnabled ? "Hide Traffic" : "Show Traffic"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Routing component
const Routing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeType, setRouteType] = useState("fastest");
  const [routes, setRoutes] = useState([]);
  const [congestionData, setCongestionData] = useState(mockData.roads);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [useSimplified, setUseSimplified] = useState(false);

  interface GeocodingResult {
    lat: number;
    lon: number;
    display_name: string;
  }

  const geocodeLocation = async (locationName) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: locationName,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data.length === 0) {
        return null;
      }

      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
        display_name: response.data[0].display_name,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const getOSRMRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}`,
        {
          params: {
            overview: "full",
            geometries: "geojson",
            alternatives: true,
          },
        }
      );

      return response.data.routes[0].geometry.coordinates.map((coord) => [
        coord[1],
        coord[0],
      ]);
    } catch (error) {
      console.error("OSRM routing error:", error);
      throw new Error("Failed to get route from OSRM service");
    }
  };

  const getAlternativeOSRMRoutes = async (start, end) => {
    try {
      const mainCoords = await getOSRMRoute(start, end);

      // Alternative 1: Add a small offset to create a variation
      const alternativeRoute1 = await getOSRMRoute(
        { ...start, lat: start.lat + 0.01 },
        { ...end, lat: end.lat + 0.01 }
      );

      // Alternative 2: Different offset for a scenic route variation
      const alternativeRoute2 = await getOSRMRoute(
        { ...start, lon: start.lon + 0.01 },
        { ...end, lon: end.lon + 0.01 }
      );

      return {
        mainRoute: mainCoords,
        alternativeRoute1,
        alternativeRoute2,
      };
    } catch (error) {
      console.error("Failed to get alternative routes:", error);
      throw new Error("Could not calculate alternative routes");
    }
  };

  const getRoute = async (start, end, routeType) => {
    try {
      const paths = await getAlternativeOSRMRoutes(start, end);

      const mainPathDistance = calculatePathDistance(paths.mainRoute);
      const altPath1Distance = calculatePathDistance(paths.alternativeRoute1);
      const altPath2Distance = calculatePathDistance(paths.alternativeRoute2);

      const baseSpeed =
        routeType === "eco" ? 40 : routeType === "scenic" ? 35 : 50;
      const mainDuration = (mainPathDistance / baseSpeed) * 60;
      const altDuration1 = (altPath1Distance / baseSpeed) * 60;
      const altDuration2 = (altPath2Distance / baseSpeed) * 60;

      const mainCongestion = getCongestionLevel();
      const altCongestion1 = getCongestionLevel(true);
      const altCongestion2 = getCongestionLevel(true);

      const mainDelay = getTrafficDelay(mainCongestion, mainDuration);
      const altDelay1 = getTrafficDelay(altCongestion1, altDuration1);
      const altDelay2 = getTrafficDelay(altCongestion2, altDuration2);

      // Use consistent start/end names for all routes
      const commonStartName = start.display_name;
      const commonEndName = end.display_name;

      const mainRoute = {
        id: "route-1",
        name: "Main Route",
        startLocationName: commonStartName,
        endLocationName: commonEndName,
        duration: Math.round(mainDuration),
        distance: parseFloat(mainPathDistance.toFixed(1)),
        trafficDelay: mainDelay,
        congestionLevel: mainCongestion,
        coordinates: paths.mainRoute,
      };

      const alternativeRoute1 = {
        id: "route-2",
        name: "Alternative Route",
        startLocationName: commonStartName,
        endLocationName: commonEndName,
        duration: Math.round(altDuration1),
        distance: parseFloat(altPath1Distance.toFixed(1)),
        trafficDelay: altDelay1,
        congestionLevel: altCongestion1,
        coordinates: paths.alternativeRoute1,
      };

      const alternativeRoute2 = {
        id: "route-3",
        name: "Scenic Route",
        startLocationName: commonStartName,
        endLocationName: commonEndName,
        duration: Math.round(altDuration2),
        distance: parseFloat(altPath2Distance.toFixed(1)),
        trafficDelay: altDelay2,
        congestionLevel: altCongestion2,
        coordinates: paths.alternativeRoute2,
      };

      return [mainRoute, alternativeRoute1, alternativeRoute2];
    } catch (error) {
      console.error("Routing error:", error);
      return [];
    }
  };

  const handleRouteSearch = async () => {
    if (!origin || !destination) {
      toast({
        title: "Required Fields",
        description: "Please enter both origin and destination",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const originGeo = await geocodeLocation(origin);
      const destinationGeo = await geocodeLocation(destination);

      if (!originGeo || !destinationGeo) {
        toast({
          title: "Location Not Found",
          description: `Could not find location: ${!originGeo ? origin : destination}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const routeResults = await getRoute(originGeo, destinationGeo, routeType);

      if (routeResults.length === 0) {
        toast({
          title: "Route Not Found",
          description: "Could not find a route between the specified locations",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setRoutes(routeResults);
      setSelectedRoute(routeResults[0].id);

      toast({
        title: "Routes Found",
        description: `Found ${routeResults.length} routes from ${origin} to ${destination}`,
      });
    } catch (error) {
      console.error("Error finding route:", error);
      toast({
        title: "Error",
        description: "An error occurred while finding a route",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectRoute = (routeId) => {
    setSelectedRoute(routeId);
    toast({
      title: "Route Selected",
      description: "Navigation would start with this route",
    });
  };

  const getTrafficDelayColor = (delay) => {
    if (delay <= 2) return "text-green-500";
    if (delay <= 5) return "text-amber-500";
    return "text-red-500";
  };

  const toggleTraffic = () => {
    setShowTraffic(!showTraffic);
    toast({
      title: showTraffic ? "Traffic Hidden" : "Traffic Shown",
      description: showTraffic
        ? "Traffic information is now hidden"
        : "Traffic information is now visible",
    });
  };

  const handleRouteCalculated = (calculatedRoutes) => {
    setRoutes(calculatedRoutes);
    setSelectedRoute(calculatedRoutes[0].id);
  };

  const toggleRoutePlannerMode = () => {
    setUseSimplified(!useSimplified);
    toast({
      title: `Using ${
        !useSimplified ? "Quick Route Finder" : "Advanced Route Planner"
      }`,
      description: `Switched to the ${
        !useSimplified ? "simplified" : "advanced"
      } routing interface`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold">Intelligent Routing</h1>
          </div>
          <Button variant="outline" onClick={toggleRoutePlannerMode}>
            <MapIcon className="mr-2 h-4 w-4" />
            {useSimplified ? "Advanced Mode" : "Quick Mode"}
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            {useSimplified ? (
              <SimplifiedRoutePlanner
                onRouteCalculated={handleRouteCalculated}
                trafficEnabled={showTraffic}
                onTrafficToggle={toggleTraffic}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Route Planner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origin</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter city name"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter city name"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route Type</label>
                    <Select value={routeType} onValueChange={setRouteType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fastest">Fastest</SelectItem>
                        <SelectItem value="shortest">Shortest</SelectItem>
                        <SelectItem value="eco">Eco Friendly</SelectItem>
                        <SelectItem value="scenic">Scenic Route</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleRouteSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finding Routes...
                      </>
                    ) : (
                      <>
                        Find Routes
                        <Search className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={toggleTraffic}>
                    <Wifi className="mr-2 h-4 w-4" />
                    {showTraffic ? "Hide Traffic" : "Show Traffic"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {routes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-accent ${
                        selectedRoute === route.id
                          ? "border-primary bg-accent/50"
                          : ""
                      }`}
                      onClick={() => selectRoute(route.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{route.name}</div>
                        <Badge
                          variant={
                            route.congestionLevel === "low"
                              ? "success"
                              : route.congestionLevel === "moderate"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {route.congestionLevel}
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{route.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{route.distance.toFixed(1)} km</span>
                        </div>
                        {route.trafficDelay !== undefined && (
                          <div
                            className={`flex items-center ${getTrafficDelayColor(
                              route.trafficDelay
                            )}`}
                          >
                            <Wifi className="h-4 w-4 mr-1" />
                            <span>+{route.trafficDelay} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 min-h-[600px]">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>Traffic Map</CardTitle>
              </CardHeader>
              <CardContent className="p-2 h-[550px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full rounded-md overflow-hidden"
                >
                  <MapContainer style={{ height: "100%", width: "100%" }}>
                    <SetInitialView />
                    <ZoomControl position="topright" />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapContent
                      routes={routes}
                      selectedRoute={selectedRoute}
                      showTraffic={showTraffic}
                    />
                  </MapContainer>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Routing;