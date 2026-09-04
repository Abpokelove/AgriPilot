import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { ArrowRight, AlertTriangle, Truck, Bot, ChevronDown } from 'lucide-react';
import { FarmerContextBar } from './FarmerContextBar';
import { MainDecisionCard } from './MainDecisionCard';
import { MarketNetwork } from '../network/MarketNetwork';
import { MarketSnapshotGrid } from './MarketSnapshotGrid';
import { MarketChart } from './MarketChart';
import { IntelligencePanel } from './IntelligencePanel';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';

export const MissionControl: React.FC = () => {
  const { recommendation, markets, toggleMarketShock, isShocked, setActiveTab } = useAgriPilot();
  const primaryMarket = markets[0];
  const primaryAllocation = recommendation.allocations[0];
  const buyerAllocation = recommendation.allocations.find((allocation) => allocation.destinationId === 'buyer-b');
  const holdAllocation = recommendation.allocations.find((allocation) => allocation.destinationId === 'hold');

  return (
    <div className="space-y-6">
      <FarmerContextBar />
      <MainDecisionCard />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="agri-card agri-flower-corner relative overflow-hidden rounded-3xl border border-charcoal/10 bg-surface p-5 shadow-card group">
          <RestingLeaf position="top-right" />
          <RainDripBorder side="left" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Market alert</p>
          </div>
          <p className="mt-3 text-lg font-black text-charcoal">
            {primaryMarket?.name ?? 'Market A'} is {primaryMarket?.supplyPressure === 'CRITICAL' ? 'very crowded' : 'crowded today'}.
          </p>
          <p className="mt-2 text-sm text-charcoal-muted">
            Prices can soften when arrivals rise faster than demand.
          </p>
          <button
            onClick={() => setActiveTab('markets')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-charcoal/10 bg-white px-4 py-2 text-xs font-bold text-charcoal transition hover:border-emerald-300 hover:text-emerald-800"
          >
            See market options
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="agri-card agri-leaf-side relative overflow-hidden rounded-3xl border border-charcoal/10 bg-surface p-5 shadow-card group">
          <RestingLeaf position="top-left" />
          <RainDripBorder side="right" />
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Next step</p>
          </div>
          <p className="mt-3 text-lg font-black text-charcoal">
            {buyerAllocation ? `${buyerAllocation.quantityKg} kg to ${buyerAllocation.destinationName}` : 'Arrange transport'}
          </p>
          <p className="mt-2 text-sm text-charcoal-muted">
            {buyerAllocation ? `Better timing and lower transport cost.` : 'Choose the fastest route for today’s sale.'}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span className="rounded-full bg-emerald-100 px-3 py-1">18 km</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1">₹900</span>
          </div>
        </div>

        <div className="agri-card agri-seed-drift relative overflow-hidden rounded-3xl border border-charcoal/10 bg-emerald-900 p-5 text-white shadow-floating group">
          <RestingLeaf position="top-right" />
          <RainDripBorder side="left" />
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200/80">Ask AgriPilot</p>
          </div>
          <p className="mt-3 text-lg font-black tracking-tight">Should I sell today?</p>
          <p className="mt-2 text-sm text-emerald-50/75">
            Ask in plain language and get a short plan you can act on.
          </p>
          <button
            onClick={() => setActiveTab('ask-agripilot')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            Open chat
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <details className="agri-card agri-field-lines rounded-3xl border border-charcoal/10 bg-surface p-5 shadow-subtle">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">More details</p>
            <p className="mt-1 text-sm font-bold text-charcoal">View the deeper intelligence only when needed</p>
          </div>
          <ChevronDown className="h-5 w-5 text-charcoal-light transition duration-200 open:rotate-180" />
        </summary>

        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <MarketNetwork />
            <MarketSnapshotGrid />
          </div>
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            <IntelligencePanel />
          </div>
        </div>
        <div className="mt-6">
          <MarketChart />
        </div>
      </details>

      <div className="rounded-3xl border border-charcoal/10 bg-surface-subtle/70 p-4 text-xs text-charcoal-muted">
        <span className="font-bold text-charcoal">Today&apos;s plan:</span>{' '}
        {primaryAllocation
          ? `${primaryAllocation.quantityKg} kg to ${primaryAllocation.destinationName}`
          : 'Open the plan to see the best move.'}
        {holdAllocation ? `, ${holdAllocation.quantityKg} kg hold` : ''}
        {isShocked ? ' Market conditions changed, so AgriPilot rerouted the plan.' : ' The plan is optimized for your current harvest context.'}
      </div>
    </div>
  );
};
