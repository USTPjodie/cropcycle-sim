import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCropStore } from '@/stores/cropStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye } from 'lucide-react';
// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const FarmMap = () => {
  const { farms, soilData } = useCropStore();

  // Dummy farm coordinates for demonstration
  const farmLocations = [
    { id: 'farm-1', name: 'Green Valley Farm', lat: 40.7128, lng: -74.0060, color: '#22c55e' },
    { id: 'farm-2', name: 'Sunrise Agriculture', lat: 40.7589, lng: -73.9851, color: '#3b82f6' },
    { id: 'farm-3', name: 'Golden Harvest', lat: 40.6892, lng: -74.0445, color: '#f59e0b' },
    { id: 'farm-4', name: 'Peaceful Acres', lat: 40.7282, lng: -73.7949, color: '#8b5cf6' },
    { id: 'farm-5', name: 'Organic Oasis', lat: 40.6782, lng: -73.9442, color: '#ef4444' },
  ];

  // Create custom icons for each farm
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-farm-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Farm GIS Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <MapContainer
              center={[40.7128, -74.0060] as [number, number]}
              zoom={10}
              style={{ height: '400px', width: '100%' }}
              className="rounded-lg shadow-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {farmLocations.map((farmLocation) => {
                const farm = farms.find(f => f.name === farmLocation.name);
                const soil = farm ? soilData[farm.id] : null;
                
                return (
                  <Marker
                    key={farmLocation.id}
                    position={[farmLocation.lat, farmLocation.lng] as [number, number]}
                    icon={createCustomIcon(farmLocation.color)}
                  >
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-bold text-sm mb-2">{farmLocation.name}</h3>
                        {farm ? (
                          <div className="space-y-1 text-xs">
                            <div><strong>Size:</strong> {farm.size} acres</div>
                            <div><strong>Soil:</strong> {farm.soilType}</div>
                            <div><strong>Crops:</strong> {farm.currentCrops.join(', ')}</div>
                            {soil && (
                              <div className="mt-2 pt-2 border-t">
                                <div><strong>N:</strong> {soil.nitrogen}%</div>
                                <div><strong>P:</strong> {soil.phosphorus}%</div>
                                <div><strong>K:</strong> {soil.potassium}%</div>
                                <div><strong>pH:</strong> {soil.pH}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No farm data available</div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            
            <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-earth">
              <h4 className="font-medium text-sm mb-2">Legend</h4>
              <div className="space-y-1">
                {farmLocations.map((farmLocation) => (
                  <div key={farmLocation.id} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: farmLocation.color }}
                    />
                    <span>{farmLocation.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm List as Alternative View */}
      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Farm Locations (List View)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmLocations.map((farmLocation) => {
              const farm = farms.find(f => f.name === farmLocation.name);
              const soil = farm ? soilData[farm.id] : null;
              
              return (
                <Card key={farmLocation.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{farmLocation.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {farmLocation.lat.toFixed(4)}, {farmLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: farmLocation.color }}
                    />
                  </div>
                  
                  {farm && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{farm.size} acres</Badge>
                        <Badge variant="secondary">{farm.soilType}</Badge>
                      </div>
                      <div className="text-sm">
                        <strong>Current Crops:</strong> {farm.currentCrops.join(', ')}
                      </div>
                      {soil && (
                        <div className="grid grid-cols-2 gap-2 text-xs bg-muted p-2 rounded">
                          <div>N: {soil.nitrogen}%</div>
                          <div>P: {soil.phosphorus}%</div>
                          <div>K: {soil.potassium}%</div>
                          <div>pH: {soil.pH}</div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* Farm Statistics */}
      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            Farm Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Total Area</h4>
              <p className="text-2xl font-bold text-primary">
                {farms.reduce((total, farm) => total + farm.size, 0)} acres
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Active Farms</h4>
              <p className="text-2xl font-bold text-accent">{farms.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Avg Soil Health</h4>
              <p className="text-2xl font-bold text-success">
                {Math.round(
                  Object.values(soilData).reduce((acc, soil) => acc + soil.nitrogen, 0) /
                  Object.values(soilData).length
                )}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};