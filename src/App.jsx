import React from 'react';
import { StoreProvider, useStore } from './components/StoreContext';
import AuthScreen from './components/AuthScreen';
import DriverDashboard from './components/DriverDashboard';
import RecipientPlaceholder from './components/RecipientPlaceholder';

function AppInner(){
  const { user } = useStore();
  if (!user) return <AuthScreen />;
  if (user.role === 'driver') return <DriverDashboard />;
  return <RecipientPlaceholder />;
}

export default function App(){
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
