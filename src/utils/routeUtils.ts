
import { Route } from '@/types/traffic';

// Function to generate realistic route paths using OpenStreetMap-like grid patterns
export const generateRouteWithOSMGrid = async (
  start: [number, number], 
  end: [number, number], 
  numPoints: number = 10,
  routeType: string = 'fastest'
): Promise<[number, number][]> =>{
  // Create a grid system for roads to simulate actual streets
  const path: [number, number][] = [start];
  
  // Get basic direction vectors
  const deltaLat = end[0] - start[0];
  const deltaLng = end[1] - start[1];
  const directDistance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
  
  // Determine if we should take a "city grid" approach
  // For shorter routes or if routeType is shortest, use more direct paths
  const useGridSystem = directDistance > 0.02 && routeType !== 'shortest';
  
  if (useGridSystem) {
    // City grid simulation - create a path that follows a grid pattern
    
    // 1. First move horizontally (east/west)
    const horizontalSteps = Math.floor(numPoints / 2);
    for (let i = 1; i <= horizontalSteps; i++) {
      const ratio = i / (horizontalSteps + 1);
      // Add slight randomness for natural looking streets
      const jitter = (Math.random() - 0.5) * 0.001;
      path.push([
        start[0] + jitter,
        start[1] + deltaLng * ratio
      ]);
    }
    
    // 2. Then move vertically (north/south)
    const verticalSteps = numPoints - horizontalSteps;
    const midLng = path[path.length - 1][1];
    
    for (let i = 1; i <= verticalSteps; i++) {
      const ratio = i / (verticalSteps + 1);
      // Add slight randomness for natural looking streets
      const jitter = (Math.random() - 0.5) * 0.001;
      path.push([
        start[0] + deltaLat * ratio,
        midLng + jitter
      ]);
    }
    
    // 3. Final segment to destination
    // Add a few points from the grid to the destination
    const finalPoints = 2;
    const lastPoint = path[path.length - 1];
    const finalDeltaLat = end[0] - lastPoint[0];
    const finalDeltaLng = end[1] - lastPoint[1];
    
    for (let i = 1; i <= finalPoints; i++) {
      const ratio = i / (finalPoints + 1);
      path.push([
        lastPoint[0] + finalDeltaLat * ratio,
        lastPoint[1] + finalDeltaLng * ratio
      ]);
    }
  } else {
    // For shorter routes or "shortest" route type, use a more direct approach
    // but still add some waypoints to make it look realistic
    for (let i = 1; i <= numPoints; i++) {
      const ratio = i / (numPoints + 1);
      // Add small random offsets to simulate natural road curves
      const latJitter = (Math.random() - 0.5) * 0.001;
      const lngJitter = (Math.random() - 0.5) * 0.001;
      
      path.push([
        start[0] + deltaLat * ratio + latJitter,
        start[1] + deltaLng * ratio + lngJitter
      ]);
    }
  }
  
  // Add the final destination
  path.push(end);
  
  return path;
}

// Generate alternative routes based on the route type
export const generateAlternativeRoutes = async (
  start: [number, number],
  end: [number, number],
  routeType: string,
  baseDistance: number
): Promise<{
  mainRoute: [number, number][], 
  alternativeRoute1: [number, number][], 
  alternativeRoute2: [number, number][]
}> => {
  // Different route types have different path generation strategies
  let mainPath: [number, number][];
  
  switch (routeType) {
    case 'fastest':
      // Fastest route - more direct with fewer waypoints
      mainPath = await generateRouteWithOSMGrid(start, end, 8, 'fastest');
      break;
    case 'shortest':
      // Shortest route - very direct path
      mainPath = await generateRouteWithOSMGrid(start, end, 6, 'shortest');
      break;
    case 'eco':
      // Eco route - avoids congestion even if slightly longer
      mainPath = await generateRouteWithOSMGrid(start, end, 10, 'eco');
      break;
    case 'scenic':
      // Scenic route - uses more waypoints for a more winding path
      mainPath = await generateRouteWithOSMGrid(start, end, 14, 'scenic');
      break;
    default:
      mainPath = await generateRouteWithOSMGrid(start, end, 8, 'fastest');
  }
  
  // Generate first alternative - slightly different path
  const altShift1: [number, number] = [
    start[0] + (Math.random() - 0.5) * 0.01,
    start[1] + (Math.random() - 0.5) * 0.01
  ];
  
  const alternativeRoute1 = await generateRouteWithOSMGrid(
    altShift1,
    end,
    10,
    'fastest'
  );
  
  // Generate second alternative - more different path, possibly longer/scenic
  const altShift2: [number, number] = [
    start[0] + (Math.random() - 0.5) * 0.02,
    start[1] + (Math.random() - 0.5) * 0.02
  ];
  
  const alternativeRoute2 = await generateRouteWithOSMGrid(
    altShift2,
    end,
    12,
    'scenic'
  );
  
  return {
    mainRoute: mainPath,
    alternativeRoute1,
    alternativeRoute2
  };
}

// Helper function to calculate distance using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Helper function to convert degrees to radians
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
}

// Helper function to calculate total path distance
export const calculatePathDistance = (path: [number, number][]): number => {
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const [lat1, lng1] = path[i];
    const [lat2, lng2] = path[i + 1];
    totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
  }
  
  return totalDistance;
}

// Helper function to get a random congestion level with weighted probability
export const getCongestionLevel = (alternative = false): 'low' | 'moderate' | 'high' | 'severe' => {
  const levels: ('low' | 'moderate' | 'high' | 'severe')[] = ['low', 'moderate', 'high', 'severe'];
  const probabilities = alternative ? [0.5, 0.3, 0.15, 0.05] : [0.25, 0.4, 0.25, 0.1];
  
  const rand = Math.random();
  let cumProb = 0;
  
  for (let i = 0; i < levels.length; i++) {
    cumProb += probabilities[i];
    if (rand <= cumProb) {
      return levels[i];
    }
  }
  
  return 'moderate';
}

// Helper function to calculate traffic delay based on congestion level
export const getTrafficDelay = (congestionLevel: 'low' | 'moderate' | 'high' | 'severe', baseDuration: number): number => {
  const delayFactors: Record<string, number> = {
    'low': 0.05,
    'moderate': 0.15,
    'high': 0.3,
    'severe': 0.5
  };
  
  return Math.round(baseDuration * delayFactors[congestionLevel]);
}
