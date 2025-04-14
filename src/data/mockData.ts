
import { TrafficLightData, TrafficData, RoadSegment, EmergencyVehicle, PredictionData, TrafficMetrics, CongestionLevel, TrafficLightStatus } from '../types/traffic';

// Generate a random timestamp within the last hour
const randomRecentTimestamp = () => {
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 60);
  now.setMinutes(now.getMinutes() - randomMinutesAgo);
  return now.toISOString();
};

// Generate roads in a grid pattern
export const generateRoadGrid = (size: number): RoadSegment[] => {
  const roads: RoadSegment[] = [];
  const congestionLevels: CongestionLevel[] = ['low', 'moderate', 'high', 'severe'];
  
  // Horizontal roads
  for (let y = 0; y < size; y++) {
    roads.push({
      id: `h-road-${y}`,
      name: `Avenue ${y + 1}`,
      startPoint: [0, y * 50],
      endPoint: [(size - 1) * 50, y * 50],
      congestionLevel: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
      trafficLightIds: []
    });
  }
  
  // Vertical roads
  for (let x = 0; x < size; x++) {
    roads.push({
      id: `v-road-${x}`,
      name: `Street ${x + 1}`,
      startPoint: [x * 50, 0],
      endPoint: [x * 50, (size - 1) * 50],
      congestionLevel: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
      trafficLightIds: []
    });
  }
  
  return roads;
};

// Generate traffic lights at intersections
export const generateTrafficLights = (roads: RoadSegment[]): TrafficLightData[] => {
  const horizontalRoads = roads.filter(r => r.id.startsWith('h-road'));
  const verticalRoads = roads.filter(r => r.id.startsWith('v-road'));
  const lights: TrafficLightData[] = [];
  const statuses: TrafficLightStatus[] = ['red', 'yellow', 'green'];
  
  horizontalRoads.forEach(hRoad => {
    verticalRoads.forEach(vRoad => {
      const lightId = `light-${hRoad.id}-${vRoad.id}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Find intersection point
      const x = vRoad.startPoint[0];
      const y = hRoad.startPoint[1];
      
      lights.push({
        id: lightId,
        location: `${hRoad.name} & ${vRoad.name}`,
        status,
        optimizationActive: Math.random() > 0.3,
        lastUpdated: randomRecentTimestamp()
      });
      
      // Add traffic light id to roads
      hRoad.trafficLightIds.push(lightId);
      vRoad.trafficLightIds.push(lightId);
    });
  });
  
  return lights;
};

// Generate traffic data for each road
export const generateTrafficData = (roads: RoadSegment[]): TrafficData[] => {
  return roads.map(road => {
    let currentSpeed: number;
    
    switch (road.congestionLevel) {
      case 'low':
        currentSpeed = 45 + Math.random() * 10;
        break;
      case 'moderate':
        currentSpeed = 30 + Math.random() * 15;
        break;
      case 'high':
        currentSpeed = 15 + Math.random() * 15;
        break;
      case 'severe':
        currentSpeed = Math.random() * 15;
        break;
      default:
        currentSpeed = 30;
    }
    
    return {
      id: `traffic-${road.id}`,
      roadId: road.id,
      location: road.name,
      currentSpeed,
      freeFlowSpeed: 55,
      congestionLevel: road.congestionLevel,
      vehicleCount: Math.floor(50 + Math.random() * 200),
      timestamp: randomRecentTimestamp()
    };
  });
};

// Generate emergency vehicles
export const generateEmergencyVehicles = (roads: RoadSegment[], count: number): EmergencyVehicle[] => {
  const vehicles: EmergencyVehicle[] = [];
  const types: Array<'ambulance' | 'fire' | 'police'> = ['ambulance', 'fire', 'police'];
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const statuses: Array<'active' | 'standby' | 'completed'> = ['active', 'standby', 'completed'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Pick random road segments for route
    const routeSegments = roads
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(2 + Math.random() * 5));
    
    vehicles.push({
      id: `vehicle-${i}`,
      type,
      location: [Math.random() * 400, Math.random() * 400],
      destination: [Math.random() * 400, Math.random() * 400],
      priority,
      status,
      routeIds: routeSegments.map(r => r.id)
    });
  }
  
  return vehicles;
};

// Generate prediction data
export const generatePredictions = (roads: RoadSegment[]): PredictionData[] => {
  const timeFrames: Array<'15min' | '30min' | '1hour' | '2hour'> = ['15min', '30min', '1hour', '2hour'];
  const congestionLevels: CongestionLevel[] = ['low', 'moderate', 'high', 'severe'];
  
  return roads.map(road => {
    return {
      roadId: road.id,
      predictedCongestion: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
      confidence: 0.7 + Math.random() * 0.3,
      timeFrame: timeFrames[Math.floor(Math.random() * timeFrames.length)]
    };
  });
};

export const generateTrafficMetrics = (): TrafficMetrics => {
  return {
    averageSpeed: 25 + Math.random() * 15,
    totalVehicles: 5000 + Math.floor(Math.random() * 3000),
    congestionIndex: Math.floor(Math.random() * 100),
    trafficLightEfficiency: 75 + Math.random() * 25,
    fuelSavingEstimate: Math.floor(1000 + Math.random() * 2000),
    emissionReduction: Math.floor(500 + Math.random() * 1500),
    averageTravelTimeReduction: Math.floor(5 + Math.random() * 15)
  };
};

// Initialize mock data
const roadGrid = generateRoadGrid(6);
const trafficLights = generateTrafficLights(roadGrid);
const trafficData = generateTrafficData(roadGrid);
const emergencyVehicles = generateEmergencyVehicles(roadGrid, 3);
const predictions = generatePredictions(roadGrid);
const trafficMetrics = generateTrafficMetrics();

export const mockData = {
  roads: roadGrid,
  trafficLights,
  trafficData,
  emergencyVehicles,
  predictions,
  metrics: trafficMetrics
};
