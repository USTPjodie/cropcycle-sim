import React from 'react';
import { useCropStore } from '@/stores/cropStore';
import { FarmerInterface } from '@/components/FarmerInterface';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, BarChart3, Users, Settings } from 'lucide-react';

const Index = () => {
  const { currentUser, setCurrentUser } = useCropStore();

  if (currentUser === 'farmer') {
    return <FarmerInterface />;
  }

  if (currentUser === 'admin') {
    return <AdminDashboard />;
  }

  // Landing page to choose interface
  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-deep">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <Sprout className="h-12 w-12 text-accent mr-3" />
              <div>
                <CardTitle className="text-3xl bg-gradient-crop bg-clip-text text-transparent">
                  CropCycle
                </CardTitle>
                <CardDescription className="text-lg">
                  Multicropping Assistant
                </CardDescription>
              </div>
            </div>
            <p className="text-muted-foreground">
              Choose your interface to get started with intelligent crop management
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="crop"
              size="xl"
              className="w-full h-16 text-left justify-start gap-4"
              onClick={() => setCurrentUser('farmer')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Farmer Interface</div>
                  <div className="text-sm opacity-90">
                    Mobile-optimized crop recommendations
                  </div>
                </div>
              </div>
            </Button>

            <Button
              variant="earth"
              size="xl"
              className="w-full h-16 text-left justify-start gap-4"
              onClick={() => setCurrentUser('admin')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Admin Dashboard</div>
                  <div className="text-sm opacity-70">
                    Manage farms, rules, and analytics
                  </div>
                </div>
              </div>
            </Button>

            <div className="pt-4 text-center">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Users className="h-6 w-6 text-accent mx-auto" />
                  <div className="text-xs text-muted-foreground">Multi-farm</div>
                </div>
                <div className="space-y-1">
                  <Settings className="h-6 w-6 text-primary mx-auto" />
                  <div className="text-xs text-muted-foreground">Smart Rules</div>
                </div>
                <div className="space-y-1">
                  <BarChart3 className="h-6 w-6 text-warning mx-auto" />
                  <div className="text-xs text-muted-foreground">Analytics</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                <strong>Demo Mode:</strong> All data is simulated for demonstration purposes.
                Data resets on page refresh.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
