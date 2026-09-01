import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { GitMerge, CheckCircle, ArrowRight, ShieldAlert, Sparkles, Building2, Store, Warehouse, HelpCircle } from 'lucide-react';

export const DecisionDetail: React.FC = () => {
  const { farmer, markets, buyers, recommendation, isShocked } = useAgriPilot();

  const marketA = markets.find((m) => m.id === 'market-a') || markets[0];
  const marketB = markets.find((m) => m.id === 'market-b') || markets[1];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">
              Where should I sell today's harvest?
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            AgriPilot Multi-Channel Decision Intelligence Analysis • Harvest: {farmer.activeCrop} ({farmer.quantityKg} kg)
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Optimal Split Realization: ₹{recommendation.expectedRealization.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Farmer Constraint Bar */}
      <div className="bg-surface-subtle border border-charcoal/10 rounded-xl p-4 flex flex-wrap items-center justify-between text-xs gap-4">
        <div>
          <span className="text-[10px] text-charcoal-muted font-bold uppercase">Produce</span>
          <p className="font-extrabold text-charcoal">{farmer.activeCrop} ({farmer.quantityKg} kg)</p>
        </div>
        <div>
          <span className="text-[10px] text-charcoal-muted font-bold uppercase">Harvest Timing</span>
          <p className="font-extrabold text-charcoal">{farmer.harvestTiming}</p>
        </div>
        <div>
          <span className="text-[10px] text-charcoal-muted font-bold uppercase">Storage Limit</span>
          <p className="font-extrabold text-charcoal">{farmer.storageCapacityDays} Days</p>
        </div>
        <div>
          <span className="text-[10px] text-charcoal-muted font-bold uppercase">Cash Target</span>
          <p className="font-extrabold text-emerald-800">₹{farmer.cashRequirement.toLocaleString('en-IN')} by {farmer.cashDeadline}</p>
        </div>
      </div>

      {/* Trade-Off Matrix Comparison */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card">
        <h3 className="text-sm font-black uppercase text-charcoal tracking-wider mb-4">
          CHANNEL TRADE-OFF MATRIX & COMPARISON
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Option 1: Market A */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            isShocked ? 'bg-red-50/50 border-red-300' : 'bg-surface border-charcoal/10'
          }`}>
            <div>
              <div className="flex items-center space-x-2 text-charcoal font-bold text-xs">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Market A (Kolar)</span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-black text-charcoal">₹{marketA.pricePerKg}/kg</span>
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Transport: ₹2,100</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-charcoal/5 text-xs">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                marketA.supplyPressure === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {marketA.supplyPressure} PRESSURE
              </span>
              <p className="text-[11px] text-charcoal-muted mt-2">
                High arrival volume. Risk of spot price drop during truck unloading.
              </p>
            </div>
          </div>

          {/* Option 2: Market B */}
          <div className="p-4 rounded-xl border border-charcoal/10 bg-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-charcoal font-bold text-xs">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Market B (Bengaluru)</span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-black text-charcoal">₹{marketB.pricePerKg}/kg</span>
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Transport: ₹1,500</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-charcoal/5 text-xs">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                MEDIUM PRESSURE
              </span>
              <p className="text-[11px] text-charcoal-muted mt-2">
                Stable arrival rate. Higher transport distance (42 km).
              </p>
            </div>
          </div>

          {/* Option 3: Buyer B */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>Buyer B (FreshChoice)</span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-black text-emerald-900">₹26.0/kg</span>
                <span className="text-[10px] text-emerald-800 block mt-0.5">Transport: ₹900</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-xs">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                DIRECT CONTRACT
              </span>
              <p className="text-[11px] text-emerald-900 mt-2 font-medium">
                Guaranteed 2-day payout. Zero price slippage risk.
              </p>
            </div>
          </div>

          {/* Option 4: Hold Warehouse */}
          <div className="p-4 rounded-xl border border-charcoal/10 bg-surface-subtle/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-charcoal font-bold text-xs">
                <Warehouse className="w-4 h-4 text-charcoal-muted" />
                <span>Hold (Warehouse)</span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-black text-charcoal">₹28.5/kg est.</span>
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Transport: ₹0 today</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-charcoal/5 text-xs">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-charcoal/10 text-charcoal">
                24H STORAGE
              </span>
              <p className="text-[11px] text-charcoal-muted mt-2">
                Preserves upside if festival demand spikes tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED PLAN BREAKDOWN & WHY SECTION */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-4">
        <h3 className="text-base font-black text-charcoal">RECOMMENDED OPTIMAL ALLOCATION PLAN</h3>

        <div className="space-y-3">
          {recommendation.allocations.map((alloc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-subtle border border-charcoal/10 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shrink-0">
                  {alloc.pct}%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal">{alloc.quantityKg} kg → {alloc.destinationName}</h4>
                  <p className="text-xs text-charcoal-muted">
                    Est. Rate: ₹{alloc.pricePerKg}/kg • Transport Cost: ₹{alloc.transportCost}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-emerald-800 block">
                  ₹{alloc.netRealization.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-charcoal-light font-semibold">Net Realization</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reason Section */}
        <div className="mt-6 p-5 rounded-2xl bg-emerald-900 text-white space-y-2">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>AGRIPILOT SYSTEM REASONING</span>
          </div>
          <p className="text-sm leading-relaxed text-emerald-50">
            "{recommendation.reasoning}"
          </p>
        </div>
      </div>
    </div>
  );
};
