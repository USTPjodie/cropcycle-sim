import React, { useState } from 'react';
import { useCropStore } from '@/stores/cropStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, User, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export const LoginPage = () => {
  const [farmerCredentials, setFarmerCredentials] = useState({
    username: '',
    password: '',
  });
  
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
  });

  const [showFarmerPassword, setShowFarmerPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('farmer');

  const { login, auth, t } = useCropStore();

  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(farmerCredentials.username, farmerCredentials.password);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(adminCredentials.username, adminCredentials.password);
  };

  const fillDemoCredentials = (role: 'farmer' | 'admin') => {
    if (role === 'farmer') {
      setFarmerCredentials({
        username: 'raj.farmer',
        password: 'farmer123',
      });
    } else {
      setAdminCredentials({
        username: 'admin',
        password: 'admin123',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sprout className="h-12 w-12 text-accent mr-3" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-crop bg-clip-text text-transparent">
                CropWise
              </h1>
              <p className="text-lg text-muted-foreground">
                Multicropping Assistant
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Sign in to access your agricultural management dashboard
          </p>
        </div>

        <Card className="shadow-deep">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-end mb-4">
              <LanguageSwitcher />
            </div>
            <CardTitle>{t('loginTitle')}</CardTitle>
            <CardDescription>
              {t('loginSubtitle')}
            </CardDescription>
          </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="farmer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('farmerTab')}
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('adminTab')}
              </TabsTrigger>
            </TabsList>

              <TabsContent value="farmer" className="space-y-4 mt-6">
                <form onSubmit={handleFarmerLogin} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="farmer-username">{t('username')}</Label>
                     <Input
                       id="farmer-username"
                       type="text"
                       placeholder="Enter your username"
                       value={farmerCredentials.username}
                       onChange={(e) => setFarmerCredentials(prev => ({ 
                         ...prev, 
                         username: e.target.value 
                       }))}
                       required
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="farmer-password">{t('password')}</Label>
                    <div className="relative">
                      <Input
                        id="farmer-password"
                        type={showFarmerPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={farmerCredentials.password}
                        onChange={(e) => setFarmerCredentials(prev => ({ 
                          ...prev, 
                          password: e.target.value 
                        }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowFarmerPassword(!showFarmerPassword)}
                      >
                        {showFarmerPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {auth.loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{auth.loginError}</AlertDescription>
                    </Alert>
                  )}

                   <Button type="submit" className="w-full" variant="crop" size="lg">
                     {t('loginButton')} ({t('farmerTab')})
                   </Button>
                </form>

                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-card px-2 text-muted-foreground">{t('demoCredentials')}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="earth"
                    size="sm"
                    className="w-full"
                    onClick={() => fillDemoCredentials('farmer')}
                  >
                    Use Demo Farmer Account
                  </Button>
                  
                  <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
                    <div><strong>Demo Accounts:</strong></div>
                    <div>• raj.farmer / farmer123</div>
                    <div>• priya.farmer / farmer123</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="admin-username">{t('username')}</Label>
                     <Input
                       id="admin-username"
                       type="text"
                       placeholder="Enter admin username"
                       value={adminCredentials.username}
                       onChange={(e) => setAdminCredentials(prev => ({ 
                         ...prev, 
                         username: e.target.value 
                       }))}
                       required
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="admin-password">{t('password')}</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showAdminPassword ? "text" : "password"}
                        placeholder="Enter admin password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials(prev => ({ 
                          ...prev, 
                          password: e.target.value 
                        }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {auth.loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{auth.loginError}</AlertDescription>
                    </Alert>
                  )}

                   <Button type="submit" className="w-full" variant="soil" size="lg">
                     {t('loginButton')} ({t('adminTab')})
                   </Button>
                </form>

                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">{t('demoCredentials')}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="earth"
                    size="sm"
                    className="w-full"
                    onClick={() => fillDemoCredentials('admin')}
                  >
                    Use Demo Admin Account
                  </Button>
                  
                  <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
                    <div><strong>Demo Admin Accounts:</strong></div>
                    <div>• admin / admin123</div>
                    <div>• supervisor / super123</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-accent mb-1">Demo Application</p>
                  <p>This is a prototype using simulated data. All accounts are for demonstration purposes only.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};