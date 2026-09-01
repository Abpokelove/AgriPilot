import React from 'react';
import { FarmerContextBar } from './FarmerContextBar';
import { MainDecisionCard } from './MainDecisionCard';
import { MarketNetwork } from '../network/MarketNetwork';
import { MarketSnapshotGrid } from './MarketSnapshotGrid';
import { MarketChart } from './MarketChart';
import { IntelligencePanel } from './IntelligencePanel';

export const MissionControl: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Context Banner */}
      <FarmerContextBar />

      {/* 2. Main Decision Hero Card & Intelligence Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Main Decision + Signature Network */}
        <div className="lg:col-span-8 space-y-6">
          <MainDecisionCard />
          <MarketNetwork />
          <MarketSnapshotGrid />
          <MarketChart />
        </div>

        {/* Right 4 Columns: AgriPilot Intelligence Factor Pipeline & Financial Outcome */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <IntelligencePanel />
        </div>
      </div>
    </div>
  );
};
