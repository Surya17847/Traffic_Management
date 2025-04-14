
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficMetrics } from '@/types/traffic';
import { BadgeDelta, DeltaType } from '@tremor/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface TrafficMetricsCardProps {
  metrics: TrafficMetrics;
}

const generateMockHistoryData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      time: `${time.getHours()}:00`,
      congestion: Math.floor(30 + Math.random() * 50),
      efficiency: Math.floor(60 + Math.random() * 30),
    });
  }
  
  return data;
};

const TrafficMetricsCard: React.FC<TrafficMetricsCardProps> = ({ metrics }) => {
  const chartData = generateMockHistoryData();
  
  const getDeltaBadge = (value: number): DeltaType => {
    if (value >= 10) return 'increase';
    if (value <= -10) return 'decrease';
    return 'unchanged';
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Analytics</CardTitle>
        <CardDescription>Key performance indicators and metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-1">{metrics.congestionIndex}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="text-xs text-muted-foreground">Congestion Index</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-1">{metrics.trafficLightEfficiency.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="text-xs text-muted-foreground">Light Efficiency</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-1">
                {metrics.averageTravelTimeReduction}
              </span>
              <span className="text-xs text-muted-foreground">min</span>
            </div>
            <div className="text-xs text-muted-foreground">Time Reduction</div>
          </div>
        </div>
        
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'congestion' ? '/100' : '%'}`, 
                  name === 'congestion' ? 'Congestion' : 'Efficiency'
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="congestion" 
                stroke="#ef4444" 
                activeDot={{ r: 6 }} 
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#0ea5e9" 
                activeDot={{ r: 6 }} 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-secondary/20 p-2">
            <div className="text-xs text-muted-foreground">Fuel Savings</div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium">{metrics.fuelSavingEstimate} L</span>
              <BadgeDelta size="sm" deltaType={getDeltaBadge(12)}>12%</BadgeDelta>
            </div>
          </div>
          
          <div className="rounded-md bg-secondary/20 p-2">
            <div className="text-xs text-muted-foreground">Emission Reduction</div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium">{metrics.emissionReduction} kg</span>
              <BadgeDelta size="sm" deltaType={getDeltaBadge(8)}>8%</BadgeDelta>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficMetricsCard;
