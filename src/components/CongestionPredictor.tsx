
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PredictionData, RoadSegment } from '@/types/traffic';

interface CongestionPredictorProps {
  predictions: PredictionData[];
  roads: RoadSegment[];
}

const CongestionPredictor: React.FC<CongestionPredictorProps> = ({ predictions, roads }) => {
  const [timeFrame, setTimeFrame] = useState<'15min' | '30min' | '1hour' | '2hour'>('15min');
  
  // Filter predictions by selected time frame
  const filteredPredictions = predictions.filter(p => p.timeFrame === timeFrame);
  
  // Get top critical areas
  const criticalAreas = filteredPredictions
    .filter(p => p.predictedCongestion === 'severe' || p.predictedCongestion === 'high')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(p => {
      const road = roads.find(r => r.id === p.roadId);
      return {
        ...p,
        roadName: road ? road.name : 'Unknown Road'
      };
    });
    
  // Calculate overall congestion prediction
  const congestionCounts = {
    low: filteredPredictions.filter(p => p.predictedCongestion === 'low').length,
    moderate: filteredPredictions.filter(p => p.predictedCongestion === 'moderate').length,
    high: filteredPredictions.filter(p => p.predictedCongestion === 'high').length,
    severe: filteredPredictions.filter(p => p.predictedCongestion === 'severe').length
  };
  
  const totalPredictions = filteredPredictions.length;
  const congestionIndex = ((congestionCounts.severe * 3 + congestionCounts.high * 2 + 
    congestionCounts.moderate * 1) / (totalPredictions * 3)) * 100;
    
  const getCongestionColor = (level: string) => {
    switch(level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Congestion Predictor</CardTitle>
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15min">15 min</SelectItem>
              <SelectItem value="30min">30 min</SelectItem>
              <SelectItem value="1hour">1 hour</SelectItem>
              <SelectItem value="2hour">2 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          AI prediction of traffic patterns in the next {timeFrame}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span>Overall Congestion Index</span>
              <span className="text-primary">{congestionIndex.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full">
              <div 
                className={`h-2.5 rounded-full ${congestionIndex > 66 ? 'bg-red-500' : congestionIndex > 33 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${congestionIndex}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Predicted Critical Areas</h4>
            <div className="space-y-2">
              {criticalAreas.length > 0 ? (
                criticalAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded text-sm">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 ${getCongestionColor(area.predictedCongestion)} rounded-full mr-2`}></span>
                      <span>{area.roadName}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className={`mr-2 ${area.predictedCongestion === 'severe' ? 'text-red-500 font-bold' : 
                        area.predictedCongestion === 'high' ? 'text-orange-500 font-medium' : ''}`}>
                        {area.predictedCongestion.charAt(0).toUpperCase() + area.predictedCongestion.slice(1)}
                      </span>
                      <span className="text-muted-foreground">{(area.confidence * 100).toFixed(0)}% conf.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-2">
                  No critical areas predicted
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>Model: Neural Traffic v2.1</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CongestionPredictor;
