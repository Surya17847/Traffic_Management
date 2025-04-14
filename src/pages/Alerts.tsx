
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BellRing, AlertTriangle, MapPin, Clock } from "lucide-react";

const Alerts = () => {
  const navigate = useNavigate();
  const [alertFilter, setAlertFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  // Mock data for alerts
  const alerts = [
    {
      id: 'alert-1',
      type: 'congestion',
      severity: 'high',
      location: 'Main Highway, South Exit',
      message: 'Severe traffic congestion detected',
      timestamp: '2025-04-07T09:23:15',
      duration: '25 mins',
      coordinates: [-74.0060, 40.7128]
    },
    {
      id: 'alert-2',
      type: 'accident',
      severity: 'high',
      location: 'Central Avenue & 5th Street',
      message: 'Multiple vehicle collision reported',
      timestamp: '2025-04-07T08:45:22',
      duration: '45 mins',
      coordinates: [-73.9950, 40.7150]
    },
    {
      id: 'alert-3',
      type: 'construction',
      severity: 'medium',
      location: 'Westbound Parkway',
      message: 'Lane closure due to construction',
      timestamp: '2025-04-06T16:12:30',
      duration: '3 days',
      coordinates: [-74.0120, 40.7180]
    },
    {
      id: 'alert-4',
      type: 'event',
      severity: 'medium',
      location: 'Downtown Convention Center',
      message: 'Increased traffic due to conference',
      timestamp: '2025-04-07T07:30:00',
      duration: '8 hours',
      coordinates: [-74.0000, 40.7200]
    },
    {
      id: 'alert-5',
      type: 'weather',
      severity: 'low',
      location: 'Northern District',
      message: 'Heavy rain affecting visibility',
      timestamp: '2025-04-07T05:45:10',
      duration: '2 hours',
      coordinates: [-73.9900, 40.7230]
    }
  ];
  
  // Filter alerts based on selected severity
  const filteredAlerts = alertFilter === 'all' ? 
    alerts : 
    alerts.filter(alert => alert.severity === alertFilter);
  
  // Group alerts by type for the summary
  const alertsByType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalAlerts = alerts.length;
  const highSeverityCount = alerts.filter(a => a.severity === 'high').length;
  
  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Get severity badge styling
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="warning">Medium</Badge>;
      case 'low': return <Badge variant="success">Low</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };
  
  // Get alert type icon
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'congestion': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'accident': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'construction': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'event': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'weather': return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold">Traffic Alerts</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <span className="text-sm">Notifications</span>
            </div>
            <Badge variant={highSeverityCount > 0 ? "destructive" : "outline"}>
              {highSeverityCount} Critical Alerts
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2" />
                    Active Traffic Alerts
                  </CardTitle>
                  <TabsList>
                    <TabsTrigger 
                      value="all" 
                      onClick={() => setAlertFilter('all')}
                      data-active={alertFilter === 'all'}
                      className={alertFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="high"
                      onClick={() => setAlertFilter('high')}
                      data-active={alertFilter === 'high'}
                      className={alertFilter === 'high' ? 'bg-destructive text-destructive-foreground' : ''}
                    >
                      High
                    </TabsTrigger>
                    <TabsTrigger
                      value="medium"
                      onClick={() => setAlertFilter('medium')}
                      data-active={alertFilter === 'medium'}
                      className={alertFilter === 'medium' ? 'bg-warning text-warning-foreground' : ''}
                    >
                      Medium
                    </TabsTrigger>
                    <TabsTrigger
                      value="low"
                      onClick={() => setAlertFilter('low')}
                      data-active={alertFilter === 'low'}
                      className={alertFilter === 'low' ? 'bg-success text-success-foreground' : ''}
                    >
                      Low
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  Real-time traffic incidents and congestion alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => (
                      <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getAlertTypeIcon(alert.type)}
                            <span className="ml-2 font-medium capitalize">{alert.type} Alert</span>
                          </div>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm">{alert.message}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Reported at {formatTime(alert.timestamp)}</span>
                          </div>
                          <div>
                            <span>Duration: {alert.duration}</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">View on Map</Button>
                          <Button variant="outline" size="sm">Detailed Report</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No alerts match the selected filter
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Alerts</span>
                    <span className="font-medium">{totalAlerts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Critical (High)</span>
                    <span className="font-medium text-red-500">{highSeverityCount}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">By Type</div>
                    <div className="space-y-1">
                      {Object.entries(alertsByType).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{type}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Critical Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weather Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Construction Notices</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Event Traffic</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Public Transit Disruptions</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Notification Areas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
