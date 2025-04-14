
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Shield, Database, Cpu, CloudRain, MapPin } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aiAggressiveness, setAiAggressiveness] = useState<number[]>([50]);
  const [apiKey, setApiKey] = useState<string>('6jOjqNALtDmPGis9YgrlMd2MRSQ04EKY');
  const [systemStatus, setSystemStatus] = useState<string>('operational');
  const [dataRetention, setDataRetention] = useState<string>('30');
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated"
    });
  };
  
  const resetToDefaults = () => {
    setAiAggressiveness([50]);
    setApiKey('6jOjqNALtDmPGis9YgrlMd2MRSQ04EKY');
    setDataRetention('30');
    
    toast({
      title: "Default Settings Restored",
      description: "All settings have been reset to system defaults"
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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold">System Settings</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={
              systemStatus === 'operational' ? 'success' :
              systemStatus === 'maintenance' ? 'warning' : 'destructive'
            }>
              System {systemStatus}
            </Badge>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Cpu className="h-4 w-4 mr-2" />
              AI & ML
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="h-4 w-4 mr-2" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the base system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Region</label>
                    <Select defaultValue="new-york">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-york">New York City</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="los-angeles">Los Angeles</SelectItem>
                        <SelectItem value="san-francisco">San Francisco</SelectItem>
                        <SelectItem value="custom">Custom Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Map Provider</label>
                    <Select defaultValue="tomtom">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tomtom">TomTom</SelectItem>
                        <SelectItem value="google">Google Maps</SelectItem>
                        <SelectItem value="mapbox">Mapbox</SelectItem>
                        <SelectItem value="osm">OpenStreetMap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TomTom API Key</label>
                    <Input 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      type="password" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for map rendering and traffic data
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Frequency (seconds)</label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Display Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Dark Mode</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Show Real-time Updates</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Display AI Predictions</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Enable Animations</label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI & Machine Learning</CardTitle>
                <CardDescription>Configure AI behavior and machine learning models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Optimization Mode</label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="throughput">Maximum Throughput</SelectItem>
                        <SelectItem value="emissions">Emissions Reduction</SelectItem>
                        <SelectItem value="emergency">Emergency Priority</SelectItem>
                        <SelectItem value="public-transit">Public Transit Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">AI Signal Control Aggressiveness</label>
                      <span className="text-sm">{aiAggressiveness[0]}%</span>
                    </div>
                    <Slider 
                      value={aiAggressiveness} 
                      onValueChange={setAiAggressiveness}
                      max={100} 
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values result in more frequent traffic signal changes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prediction Time Horizon</label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Model Settings</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Enable Reinforcement Learning</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Real-time Model Updates</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Use Federated Learning</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Enable Transfer Learning</label>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    Retrain Models with Latest Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Configure data ingestion and processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">Traffic Sensors</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10">Connected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">254 IoT sensors throughout the city</p>
                      <div className="flex justify-between text-xs">
                        <span>Update frequency: 10s</span>
                        <span>Uptime: 99.8%</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">Traffic Cameras</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10">Connected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">68 computer vision enabled cameras</p>
                      <div className="flex justify-between text-xs">
                        <span>Update frequency: 5s</span>
                        <span>Uptime: 97.2%</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CloudRain className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="font-medium">Weather API</span>
                        </div>
                        <Badge variant="warning">Degraded</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Weather conditions and forecasts</p>
                      <div className="flex justify-between text-xs">
                        <span>Update frequency: 10m</span>
                        <span>Uptime: 93.5%</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">GPS Vehicles</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10">Connected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">1,430 connected vehicles</p>
                      <div className="flex justify-between text-xs">
                        <span>Update frequency: 15s</span>
                        <span>Uptime: 98.9%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Retention Period (days)</label>
                    <Select 
                      value={dataRetention} 
                      onValueChange={setDataRetention}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Enable Data Backups</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Data Anonymization</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Edge Computing</label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Access Control</CardTitle>
                <CardDescription>Configure system security and user permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User Authentication</label>
                    <Select defaultValue="sso">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="sso">Single Sign-On</SelectItem>
                        <SelectItem value="2fa">Two-Factor Auth</SelectItem>
                        <SelectItem value="biometric">Biometric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Access Level</label>
                    <Select defaultValue="restricted">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Controls who can access the system's API endpoints
                    </p>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Audit Logging</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Encrypt Sensitive Data</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">GDPR Compliance Mode</label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">IP Whitelisting</label>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Security Notice</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Make sure to securely store API keys and sensitive information. The traffic management system has access to critical infrastructure.
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetToDefaults}>
                        Reset to Defaults
                      </Button>
                      <Button variant="outline" onClick={handleSaveSettings}>
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
