
export type TrafficLightStatus = 'red' | 'yellow' | 'green';

export type TrafficLightData = {
  id: string;
  location: string;
  status: TrafficLightStatus;
  optimizationActive: boolean;
  lastUpdated: string;
}

export type CongestionLevel = 'low' | 'moderate' | 'high' | 'severe';

export type TrafficData = {
  id: string;
  roadId: string;
  location: string;
  currentSpeed: number;
  freeFlowSpeed: number; // max expected speed
  congestionLevel: CongestionLevel;
  vehicleCount: number;
  timestamp: string;
}

export type RoadSegment = {
  id: string;
  name: string;
  startPoint: [number, number]; // [x, y] coordinates
  endPoint: [number, number]; // [x, y] coordinates
  congestionLevel: CongestionLevel;
  trafficLightIds: string[];
}

export type EmergencyVehicle = {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  location: [number, number]; // [x, y] coordinates
  destination: [number, number]; // [x, y] coordinates
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'standby' | 'completed';
  routeIds: string[];
}

export type PredictionData = {
  roadId: string;
  predictedCongestion: CongestionLevel;
  confidence: number; // 0-1
  timeFrame: '15min' | '30min' | '1hour' | '2hour';
}

export type TrafficMetrics = {
  averageSpeed: number;
  totalVehicles: number;
  congestionIndex: number; // 0-100
  trafficLightEfficiency: number; // 0-100
  fuelSavingEstimate: number; // liters
  emissionReduction: number; // kg CO2
  averageTravelTimeReduction: number; // minutes
}

export type Route = {
  id: string;
  name: string;
  startLocationName?: string;
  endLocationName?: string;
  duration: number;
  distance: number;
  trafficDelay: number;
  congestionLevel: CongestionLevel;
  coordinates: [number, number][];
}

