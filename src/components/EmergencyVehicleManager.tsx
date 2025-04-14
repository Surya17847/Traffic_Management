
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmergencyVehicle } from '@/types/traffic';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyVehicleManagerProps {
  emergencyVehicles: EmergencyVehicle[];
}

const EmergencyVehicleManager: React.FC<EmergencyVehicleManagerProps> = ({ emergencyVehicles }) => {
  const { toast } = useToast();
  
  const activeVehicles = emergencyVehicles.filter(v => v.status === 'active');
  const standbyVehicles = emergencyVehicles.filter(v => v.status === 'standby');
  
  const handlePrioritize = (vehicle: EmergencyVehicle) => {
    toast({
      title: "Emergency Route Prioritized",
      description: `${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} vehicle route has been given highest priority.`,
    });
  };
  
  const getVehicleColor = (type: string) => {
    switch(type) {
      case 'ambulance': return 'text-rose-600';
      case 'fire': return 'text-orange-600';
      case 'police': return 'text-blue-600';
      default: return '';
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high': 
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium': 
        return <Badge variant="warning">Medium</Badge>;
      case 'low': 
        return <Badge variant="outline">Low</Badge>;
      default: 
        return null;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Emergency Vehicle Manager</CardTitle>
          <Badge variant={activeVehicles.length > 0 ? "destructive" : "outline"} className={activeVehicles.length > 0 ? "pulse" : ""}>
            {activeVehicles.length} Active
          </Badge>
        </div>
        <CardDescription>Manage and prioritize emergency vehicles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeVehicles.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium mb-2">Active Emergency Vehicles</h4>
              <div className="space-y-2">
                {activeVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="rounded-md border p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className={`font-medium ${getVehicleColor(vehicle.type)}`}>
                          {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">ID: {vehicle.id}</span>
                      </div>
                      {getPriorityBadge(vehicle.priority)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <div>Route segments: {vehicle.routeIds.length}</div>
                        <div className="text-muted-foreground">Est. arrival: {Math.floor(5 + Math.random() * 10)} min</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={vehicle.priority === 'high' ? "default" : "outline"}
                        onClick={() => handlePrioritize(vehicle)}
                      >
                        Prioritize
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No active emergency vehicles
            </div>
          )}
          
          {standbyVehicles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Standby Vehicles</h4>
              <div className="space-y-2">
                {standbyVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="rounded-md border border-dashed p-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={getVehicleColor(vehicle.type)}>
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">ID: {vehicle.id}</span>
                    </div>
                    <Badge variant="outline">Standby</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Emergency Response Options</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                Dispatch New Vehicle
              </Button>
              <Button variant="outline" size="sm">
                Clear All Routes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyVehicleManager;
