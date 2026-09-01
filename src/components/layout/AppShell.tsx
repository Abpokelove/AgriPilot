import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastContainer } from './ToastContainer';
import { useAgriPilot } from '../../context/AgriPilotContext';

// Import screen components
import { MissionControl } from '../dashboard/MissionControl';
import { MarketsPage } from '../markets/MarketsPage';
import { HarvestPage } from '../harvest/HarvestPage';
import { DecisionDetail } from '../decisions/DecisionDetail';
import { BuyersPage } from '../buyers/BuyersPage';
import { ShipmentsPage } from '../shipments/ShipmentsPage';
import { AskAgriPilot } from '../assistant/AskAgriPilot';
import { ActivityPage } from '../activity/ActivityPage';

export const AppShell: React.FC = () => {
  const { activeTab } = useAgriPilot();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'mission-control':
        return <MissionControl />;
      case 'markets':
        return <MarketsPage />;
      case 'harvest':
        return <HarvestPage />;
      case 'decisions':
        return <DecisionDetail />;
      case 'buyers':
        return <BuyersPage />;
      case 'shipments':
        return <ShipmentsPage />;
      case 'ask-agripilot':
        return <AskAgriPilot />;
      case 'activity':
        return <ActivityPage />;
      default:
        return <MissionControl />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Application Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};
