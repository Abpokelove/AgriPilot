import React from 'react';
import { AgriPilotProvider } from './context/AgriPilotContext';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <AgriPilotProvider>
      <AppShell />
    </AgriPilotProvider>
  );
};

export default App;
