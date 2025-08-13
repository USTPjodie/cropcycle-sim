import React from 'react';
import { useCropStore } from '@/stores/cropStore';
import { LoginPage } from '@/components/LoginPage';
import { FarmerInterface } from '@/components/FarmerInterface';
import { AdminDashboard } from '@/components/AdminDashboard';

const Index = () => {
  const { auth } = useCropStore();

  // Show login page if not authenticated
  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  // Show appropriate interface based on user role
  if (auth.currentUser?.role === 'farmer') {
    return <FarmerInterface />;
  }

  if (auth.currentUser?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Fallback - should not reach here
  return <LoginPage />;
};

export default Index;
