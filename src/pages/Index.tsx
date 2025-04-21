import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { mockData } from "@/data/mockData";
import TrafficMap from "@/components/TrafficMap";
import CongestionPredictor from "@/components/CongestionPredictor";
import TrafficSignalControl from "@/components/TrafficSignalControl";
import EmergencyVehicleManager from "@/components/EmergencyVehicleManager";
import TrafficMetricsCard from "@/components/TrafficMetricsCard";
import { useToast } from "@/components/ui/use-toast";
import { TrafficLightStatus, CongestionLevel } from "@/types/traffic";
import { Bell, Settings, MapPin, RefreshCw, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from 'aws-amplify/auth';
import { LogOut } from "lucide-react"; 
// API endpoint constants
const API_BASE_URL = "http://localhost:5000/api";
const REFRESH_DATA_ENDPOINT = `${API_BASE_URL}/refresh-data`;
const PREDICT_ENDPOINT = `${API_BASE_URL}/predict`;

const Index = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to call the AI optimization API
  const runTrafficOptimization = async () => {
    toast({
      title: "AI Optimization Running",
      description:
        "Analyzing traffic patterns and dynamically adjusting signals...",
    });

    setLoading(true);

    try {
      // In a real-world scenario, you would make an API call here to trigger optimization
      // For now, we'll simulate it with a timeout and local data manipulation
      setTimeout(() => {
        const updatedData = { ...data };

        updatedData.trafficLights = updatedData.trafficLights.map((light) => {
          const isEmergencyRoute = data.emergencyVehicles
            .filter((v) => v.status === "active")
            .some((v) => v.routeIds.includes(light.id.split("-")[1]));

          if (isEmergencyRoute) {
            return {
              ...light,
              status: "green" as TrafficLightStatus,
              optimizationActive: true,
            };
          }

          const relatedRoads = data.roads.filter((r) =>
            r.trafficLightIds.includes(light.id)
          );
          const highCongestion = relatedRoads.some(
            (r) =>
              r.congestionLevel === "high" || r.congestionLevel === "severe"
          );

          if (highCongestion && light.status !== "green") {
            return {
              ...light,
              status: "green" as TrafficLightStatus,
              optimizationActive: true,
            };
          }

          return light;
        });

        setData(updatedData);
        setLoading(false);

        toast({
          title: "AI Optimization Complete",
          description: "Traffic signals optimized for current conditions",
        });
      }, 2000);
    } catch (error) {
      console.error("Error during optimization:", error);
      setLoading(false);
      toast({
        title: "Optimization Failed",
        description: "There was an error during traffic optimization",
        variant: "destructive",
      });
    }
  };

  // Fetch data from the backend ML API
  const refreshData = async () => {
    setLoading(true);

    try {
      // Call the API to get ML-predicted traffic data
      const response = await fetch(REFRESH_DATA_ENDPOINT);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const updatedData = await response.json();
      setData(updatedData);

      toast({
        title: "Data Refreshed",
        description: "Traffic data has been updated with latest ML predictions",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);

      // Fallback to random data if API fails
      const updatedData = { ...mockData };

      updatedData.roads = updatedData.roads.map((road) => {
        if (Math.random() > 0.7) {
          const congestionLevels: CongestionLevel[] = [
            "low",
            "moderate",
            "high",
            "severe",
          ];
          const randomLevel =
            congestionLevels[
              Math.floor(Math.random() * congestionLevels.length)
            ];
          return { ...road, congestionLevel: randomLevel };
        }
        return road;
      });

      updatedData.trafficLights = updatedData.trafficLights.map((light) => {
        if (Math.random() > 0.8) {
          const statuses: TrafficLightStatus[] = ["red", "yellow", "green"];
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...light,
            status: randomStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return light;
      });

      setData(updatedData);

    } finally {
      setLoading(false);
    }
  };

  // Effect to periodically refresh data
  useEffect(() => {
    // Initial data load
    refreshData();

    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSignout = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      await signOut();
      console.log('signed out');
      navigate("/"); // Redirect to the root (your sign-in page) after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally display an error message to the user
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold">Urban Flow Navigator</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/routing")}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Routing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/alerts")}
              >
                <Bell className="mr-1 h-4 w-4" />
                Alerts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignout}
              >
                <LogOut className="mr-1 h-4 w-4" /> {/* Changed the icon to LogOut */}
                Signout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-1 h-4 w-4" />
                Settings
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
            <Button
              size="sm"
              onClick={runTrafficOptimization}
              disabled={loading}
            >
              <BrainCircuit className="mr-1 h-4 w-4" />
              Run AI Optimization
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[350px]">
            <TrafficMap
              roads={data.roads}
              trafficLights={data.trafficLights}
              emergencyVehicles={data.emergencyVehicles}
            />
          </div>
          <div>
            <CongestionPredictor
              predictions={data.predictions}
              roads={data.roads}
            />
          </div>
        </div>

        <Tabs defaultValue="controls" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[500px]">
            <TabsTrigger value="controls">Signal Controls</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai">AI Models</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4">
            <TrafficSignalControl trafficLights={data.trafficLights} />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <EmergencyVehicleManager
              emergencyVehicles={data.emergencyVehicles}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TrafficMetricsCard metrics={data.metrics} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <AIModelsCard />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div>Urban Flow Navigator © 2025 AI Traffic Management System</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">
              About
            </a>
            <a href="#" className="hover:text-foreground">
              Help
            </a>
            <a href="#" className="hover:text-foreground">
              API
            </a>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  loading ? "bg-amber-500" : "bg-green-500"
                } mr-1`}
              ></div>
              <span>{loading ? "Processing..." : "System Online"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AIModelsCard: React.FC = () => {
  const [mlMetrics, setMlMetrics] = useState({
    trafficDensityAccuracy: "92.8%",
    signalOptimizationPerformance: "+28% flow",
    predictionWindow: "5min - 2hrs",
    lastModelUpdate: "2025-04-08T06:30:00Z",
    activeDataSources: {
      sensors: 254,
      cameras: 68,
      gpsDevices: true,
      vehicleLogs: true,
    },
  });

  // In a real app, we would fetch these metrics from the API
  useEffect(() => {
    // Simulate fetching ML metrics
    const fetchMlMetrics = async () => {
      try {
        // This would be a real API call in production
        // const response = await fetch(`${API_BASE_URL}/ml-metrics`);
        // const data = await response.json();
        // setMlMetrics(data);
      } catch (error) {
        console.error("Error fetching ML metrics:", error);
      }
    };

    fetchMlMetrics();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Traffic Management Models</CardTitle>
        <CardDescription>
          Dynamic traffic optimization through machine learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium text-lg">Congestion Prediction</h3>
              <p className="text-sm text-muted-foreground">
                Random Forest model trained on traffic dataset
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium">Model Type</div>
                  <div className="text-muted-foreground">Random Forest</div>
                </div>
                <div>
                  <div className="font-medium">Accuracy</div>
                  <div className="text-green-600">
                    {mlMetrics.trafficDensityAccuracy}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Training Data</div>
                  <div className="text-muted-foreground">Full dataset</div>
                </div>
                <div>
                  <div className="font-medium">Prediction Window</div>
                  <div className="text-muted-foreground">
                    {mlMetrics.predictionWindow}
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium text-lg">Signal Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Gradient Boosting for optimal traffic flow
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium">Model Type</div>
                  <div className="text-muted-foreground">Gradient Boosting</div>
                </div>
                <div>
                  <div className="font-medium">Performance</div>
                  <div className="text-green-600">
                    {mlMetrics.signalOptimizationPerformance}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Optimization Target</div>
                  <div className="text-muted-foreground">
                    Energy + throughput
                  </div>
                </div>
                <div>
                  <div className="font-medium">Last Update</div>
                  <div className="text-muted-foreground">
                    {new Date(mlMetrics.lastModelUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg">Real-time Data Sources</h3>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">
                  IoT Sensors ({mlMetrics.activeDataSources.sensors})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">
                  Traffic Cameras ({mlMetrics.activeDataSources.cameras})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">GPS Devices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Vehicle Logs</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
