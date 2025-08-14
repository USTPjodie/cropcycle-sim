import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCropStore } from '@/stores/cropStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Settings, Eye } from 'lucide-react';

export const FarmMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const { farms, soilData } = useCropStore();

  // Dummy farm coordinates for demonstration
  const farmLocations = [
    { id: 'farm-1', name: 'Green Valley Farm', lat: 40.7128, lng: -74.0060, color: '#22c55e' },
    { id: 'farm-2', name: 'Sunrise Agriculture', lat: 40.7589, lng: -73.9851, color: '#3b82f6' },
    { id: 'farm-3', name: 'Golden Harvest', lat: 40.6892, lng: -74.0445, color: '#f59e0b' },
    { id: 'farm-4', name: 'Peaceful Acres', lat: 40.7282, lng: -73.7949, color: '#8b5cf6' },
    { id: 'farm-5', name: 'Organic Oasis', lat: 40.6782, lng: -73.9442, color: '#ef4444' },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.0060, 40.7128],
      zoom: 10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    map.current.on('load', () => {
      // Add farm markers
      farmLocations.forEach((farmLocation) => {
        const farm = farms.find(f => f.name === farmLocation.name);
        const soil = farm ? soilData[farm.id] : null;
        
        // Create popup content
        const popupContent = `
          <div class="p-3">
            <h3 class="font-bold text-sm mb-2">${farmLocation.name}</h3>
            ${farm ? `
              <div class="space-y-1 text-xs">
                <div><strong>Size:</strong> ${farm.size} acres</div>
                <div><strong>Soil:</strong> ${farm.soilType}</div>
                <div><strong>Crops:</strong> ${farm.currentCrops.join(', ')}</div>
                ${soil ? `
                  <div class="mt-2 pt-2 border-t">
                    <div><strong>N:</strong> ${soil.nitrogen}%</div>
                    <div><strong>P:</strong> ${soil.phosphorus}%</div>
                    <div><strong>K:</strong> ${soil.potassium}%</div>
                    <div><strong>pH:</strong> ${soil.pH}</div>
                  </div>
                ` : ''}
              </div>
            ` : '<div class="text-xs text-gray-500">No farm data available</div>'}
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(popupContent);

        // Create custom marker
        const markerDiv = document.createElement('div');
        markerDiv.className = 'farm-marker';
        markerDiv.style.cssText = `
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${farmLocation.color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        new mapboxgl.Marker(markerDiv)
          .setLngLat([farmLocation.lng, farmLocation.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setMapInitialized(true);
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap();
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (!mapInitialized && !mapboxToken) {
    return (
      <div className="space-y-6">
        <Card className="shadow-earth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-warning" />
              Map Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-medium mb-2 text-warning">Mapbox Token Required</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To view the farm map, please enter your Mapbox public token. 
                  You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> after creating an account.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                    <Input
                      id="mapbox-token"
                      type="password"
                      value={mapboxToken}
                      onChange={(e) => setMapboxToken(e.target.value)}
                      placeholder="pk.eyJ1Ijoi..."
                    />
                  </div>
                  <Button onClick={handleTokenSubmit} variant="crop">
                    Initialize Map
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm List as Fallback */}
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
      </div>
    );
  }

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
            <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-lg" />
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