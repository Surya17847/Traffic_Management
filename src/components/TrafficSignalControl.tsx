
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { TrafficLightData } from '@/types/traffic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrafficSignalControlProps {
  trafficLights: TrafficLightData[];
}

const TrafficSignalControl: React.FC<TrafficSignalControlProps> = ({ trafficLights }) => {
  const [selectedLight, setSelectedLight] = useState<string | null>(null);
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [systemStatus, setSystemStatus] = useState('active');
  const { toast } = useToast();
  
  const selectedLightData = trafficLights.find(light => light.id === selectedLight);
  
  const optimizedLights = trafficLights.filter(light => light.optimizationActive).length;
  const optimizationPercentage = (optimizedLights / trafficLights.length) * 100;
  
  const handleToggleOptimization = () => {
    if (!selectedLightData) return;
    
    toast({
      title: `AI Optimization ${selectedLightData.optimizationActive ? 'Disabled' : 'Enabled'}`,
      description: `${selectedLightData.location} traffic light is now ${selectedLightData.optimizationActive ? 'manually controlled' : 'AI optimized'}`,
    });
  };
  
  const handleStatusChange = (status: string) => {
    setSystemStatus(status);
    
    toast({
      title: `System Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `Traffic control system is now ${status}`,
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Traffic Signal Control</CardTitle>
          <Badge variant={systemStatus === 'active' ? 'default' : systemStatus === 'maintenance' ? 'warning' : 'destructive'}>
            {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
          </Badge>
        </div>
        <CardDescription>Manage and optimize traffic signals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">AI Optimization Status</h4>
              <span className="text-xs text-muted-foreground">
                {optimizedLights} of {trafficLights.length} lights
              </span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full">
              <div 
                className="h-2.5 rounded-full bg-primary" 
                style={{ width: `${optimizationPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="trafficLight" className="text-sm font-medium">Select Traffic Light</label>
            <Select value={selectedLight || ''} onValueChange={setSelectedLight}>
              <SelectTrigger id="trafficLight">
                <SelectValue placeholder="Select intersection" />
              </SelectTrigger>
              <SelectContent>
                {trafficLights.map(light => (
                  <SelectItem key={light.id} value={light.id}>
                    {light.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedLightData && (
            <div className="rounded-md border p-3 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">{selectedLightData.location}</h4>
                <Badge variant={
                  selectedLightData.status === 'red' ? 'destructive' : 
                  selectedLightData.status === 'yellow' ? 'warning' : 
                  'success'
                }>
                  {selectedLightData.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Optimization</span>
                <Switch 
                  checked={selectedLightData.optimizationActive} 
                  onCheckedChange={handleToggleOptimization}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  className="h-8 bg-red-500/20 hover:bg-red-500/40"
                  disabled={selectedLightData.status === 'red'}
                >
                  Red
                </Button>
                <Button 
                  variant="outline"
                  className="h-8 bg-yellow-500/20 hover:bg-yellow-500/40"
                  disabled={selectedLightData.status === 'yellow'}
                >
                  Yellow
                </Button>
                <Button 
                  variant="outline"
                  className="h-8 bg-green-500/20 hover:bg-green-500/40"
                  disabled={selectedLightData.status === 'green'}
                >
                  Green
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(selectedLightData.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium">Optimization Mode</label>
            <Select value={optimizationMode} onValueChange={setOptimizationMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="throughput">Max Throughput</SelectItem>
                <SelectItem value="emission">Emission Reduction</SelectItem>
                <SelectItem value="emergency">Emergency Priority</SelectItem>
                <SelectItem value="publicTransport">Public Transport Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium">System Control</label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={systemStatus === 'active' ? 'default' : 'outline'} 
                className="h-8"
                onClick={() => handleStatusChange('active')}
              >
                Active
              </Button>
              <Button 
                variant={systemStatus === 'maintenance' ? 'default' : 'outline'} 
                className="h-8"
                onClick={() => handleStatusChange('maintenance')}
              >
                Maintenance
              </Button>
              <Button 
                variant={systemStatus === 'offline' ? 'default' : 'outline'} 
                className="h-8"
                onClick={() => handleStatusChange('offline')}
              >
                Offline
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficSignalControl;
