import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastContainer } from './ToastContainer';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { NatureAtmosphere, AtmosphereMode, AtmosphereDensity, getStoredAtmosphereMode, getStoredAtmosphereDensity } from '../ui/NatureAtmosphere';

// Import screen components
import { MissionControl } from '../dashboard/MissionControl';
import { MarketsPage } from '../markets/MarketsPage';
import { HarvestPage } from '../harvest/HarvestPage';
import { HarvestPlanPage } from '../decisions/HarvestPlanPage';
import { BuyersPage } from '../buyers/BuyersPage';
import { ActivityPage } from '../activity/ActivityPage';
import { AskAgriPilot } from '../assistant/AskAgriPilot';
import { MobileNav } from './MobileNav';

export const AppShell: React.FC = () => {
  const { activeTab } = useAgriPilot();
  const [atmoMode, setAtmoMode] = useState<AtmosphereMode>(getStoredAtmosphereMode);
  const [atmoDensity, setAtmoDensity] = useState<AtmosphereDensity>(getStoredAtmosphereDensity);

  useEffect(() => {
    const handleAtmosphereChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        if (detail.mode) setAtmoMode(detail.mode);
        if (detail.density) setAtmoDensity(detail.density);
      }
    };
    window.addEventListener('agripilot:atmosphere:change', handleAtmosphereChange);
    return () => window.removeEventListener('agripilot:atmosphere:change', handleAtmosphereChange);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'mission-control':
        return <MissionControl />;
      case 'harvest':
        return <HarvestPage />;
      case 'harvest-plan':
      case 'decisions':
      case 'shipments': // Merged: legacy shipment tab redirects directly to Harvest Plan logistics view!
        return <HarvestPlanPage />;
      case 'markets':
        return <MarketsPage />;
      case 'buyers':
        return <BuyersPage />;
      case 'alerts':
      case 'activity':
        return <ActivityPage />;
      case 'ask-agripilot':
        return <AskAgriPilot />;
      default:
        return <MissionControl />;
    }
  };

  return (
    <div className="agripilot-stage flex h-screen w-screen overflow-hidden bg-background relative">
      <NatureAtmosphere mode={atmoMode} density={atmoDensity} />
      <Sidebar className="hidden md:flex relative z-10" />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <TopBar />
        <main className="agripilot-main flex-1 overflow-y-auto p-4 pb-24 md:p-6 lg:p-8">
          <div key={activeTab} className="page-enter relative z-10">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      <MobileNav />
      <ToastContainer />
    </div>
  );
};
