import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { ArrowRight, Zap, ShieldAlert, Sparkles, Building2, Store, Warehouse, Sprout } from 'lucide-react';

export const MarketNetwork: React.FC = () => {
  const { isShocked, markets, recommendation } = useAgriPilot();

  const marketA = markets.find((m) => m.id === 'market-a') || markets[0];
  const marketB = markets.find((m) => m.id === 'market-b') || markets[1];

  // Allocation percentages from recommendation
  const allocA = recommendation.allocations.find((a) => a.destinationId === 'market-a')?.pct || 0;
  const allocB = recommendation.allocations.find((a) => a.destinationId === 'market-b')?.pct || 0;
  const allocBuyerB = recommendation.allocations.find((a) => a.destinationId === 'buyer-b')?.pct || 0;
  const allocHold = recommendation.allocations.find((a) => a.destinationId === 'hold')?.pct || 0;

  return (
    <div className={`agri-card agri-leaf-side relative bg-surface rounded-2xl border p-6 shadow-card overflow-hidden transition-all duration-500 ${
      isShocked ? 'border-amber-400/80 ring-2 ring-amber-400/20' : 'border-charcoal/10'
    }`}>
      {/* Background Graphic Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#0D5C46_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-charcoal tracking-tight">
              MARKET NETWORK FLOW
            </h3>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Signature Visualizer
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Real-time allocation vectors based on price, distance, and supply pressure.
          </p>
        </div>

        {/* Live status readout */}
        <div className="flex items-center space-x-2">
          {isShocked ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>RE-ROUTED AFTER SHOCK</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>OPTIMAL BALANCED FLOW</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG Network Visualizer Layout */}
      <div className="relative min-h-[300px] flex items-center justify-center py-4">
        {/* Connection Lines (SVG Overlay) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
            <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D5C46" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient-shock" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Lines connecting Central Farm to Destination Nodes */}
          {/* Path 1: Farm to Market A (Top Right) */}
          <path
            d="M 160 150 C 240 150, 280 60, 420 60"
            fill="none"
            stroke={isShocked ? "#DC2626" : "#0D5C46"}
            strokeWidth={isShocked ? 2 : 4}
            strokeDasharray={isShocked ? "4 4" : "none"}
            className={isShocked ? "" : "animated-flow-line"}
          />
          {/* Path 2: Farm to Market B (Bottom Right) */}
          <path
            d="M 160 150 C 240 150, 280 240, 420 240"
            fill="none"
            stroke="#059669"
            strokeWidth={allocB > 30 ? 5 : 3}
            className="animated-flow-line"
          />
          {/* Path 3: Farm to Buyer B (Mid Right) */}
          <path
            d="M 160 150 C 260 150, 300 150, 420 150"
            fill="none"
            stroke="#0D5C46"
            strokeWidth={allocBuyerB > 25 ? 4 : 2}
            className="animated-flow-line"
          />
        </svg>

        {/* Node Layout Structure */}
        <div className="w-full flex items-center justify-between relative z-10 px-4">
          {/* LEFT: Central Origin Node (Malur Farm) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-emerald-900 text-white p-3 shadow-floating border-2 border-emerald-500 flex flex-col items-center justify-center text-center relative group">
              <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center mb-1">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">FARM</span>
              <span className="text-sm font-extrabold text-white">800 KG</span>
              <span className="text-[9px] text-emerald-300 font-medium">Tomato</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs font-extrabold text-charcoal">Malur Farm</span>
              <p className="text-[10px] text-charcoal-muted">Origin Node</p>
            </div>
          </div>

          {/* RIGHT: Destination Nodes Grid */}
          <div className="space-y-4 max-w-sm w-full">
            {/* NODE 1: Market A */}
            <div
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isShocked
                  ? 'bg-red-50/90 border-red-300 text-red-950 shadow-md ring-2 ring-red-400/40'
                  : 'bg-surface border-charcoal/10 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                  isShocked ? 'bg-red-200 text-red-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-extrabold text-charcoal">Market A (Kolar APMC)</span>
                    <span className="text-[10px] text-charcoal-light font-mono">24 km</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`text-sm font-extrabold ${isShocked ? 'text-red-700' : 'text-emerald-700'}`}>
                      ₹{marketA.pricePerKg}/kg
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      marketA.supplyPressure === 'CRITICAL'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {marketA.supplyPressure} PRESSURE
                    </span>
                  </div>
                </div>
              </div>

              {/* Allocation Pill */}
              <div className="text-right">
                <span className={`text-sm font-black block ${isShocked ? 'text-red-700' : 'text-emerald-800'}`}>
                  {allocA}%
                </span>
                <span className="text-[10px] text-charcoal-muted font-medium">
                  {Math.round((800 * allocA) / 100)} kg
                </span>
              </div>
            </div>

            {/* NODE 2: Buyer B (Direct B2B) */}
            <div className="p-3.5 rounded-xl border border-charcoal/10 bg-surface hover:border-emerald-500/50 transition-all flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-extrabold text-charcoal">Buyer B (FreshChoice)</span>
                    <span className="text-[10px] text-charcoal-light font-mono">18 km</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-sm font-extrabold text-emerald-700">₹26.0/kg</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                      DIRECT CONTRACT
                    </span>
                  </div>
                </div>
              </div>

              {/* Allocation Pill */}
              <div className="text-right">
                <span className="text-sm font-black text-emerald-800 block">{allocBuyerB}%</span>
                <span className="text-[10px] text-charcoal-muted font-medium">
                  {Math.round((800 * allocBuyerB) / 100)} kg
                </span>
              </div>
            </div>

            {/* NODE 3: Market B */}
            <div className="p-3.5 rounded-xl border border-charcoal/10 bg-surface hover:border-emerald-500/50 transition-all flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-extrabold text-charcoal">Market B (Bengaluru)</span>
                    <span className="text-[10px] text-charcoal-light font-mono">42 km</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-sm font-extrabold text-emerald-700">₹{marketB.pricePerKg}/kg</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase">
                      MED PRESSURE
                    </span>
                  </div>
                </div>
              </div>

              {/* Allocation Pill */}
              <div className="text-right">
                <span className="text-sm font-black text-emerald-800 block">{allocB}%</span>
                <span className="text-[10px] text-charcoal-muted font-medium">
                  {Math.round((800 * allocB) / 100)} kg
                </span>
              </div>
            </div>

            {/* NODE 4: Storage Hold */}
            {allocHold > 0 && (
              <div className="p-3 rounded-xl border border-dashed border-charcoal/20 bg-surface-subtle/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-charcoal/10 text-charcoal flex items-center justify-center shrink-0">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-charcoal">Hold in Malur Warehouse</span>
                    <p className="text-[10px] text-charcoal-muted">Max storage: 2 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-charcoal block">{allocHold}%</span>
                  <span className="text-[10px] text-charcoal-muted">{Math.round((800 * allocHold) / 100)} kg</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network Legend */}
      <div className="mt-4 pt-3 border-t border-charcoal/10 flex flex-wrap items-center justify-between text-[11px] text-charcoal-muted gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Optimal Route</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Supply Constraint</span>
          </span>
          {isShocked && (
            <span className="flex items-center space-x-1.5 text-red-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Arrival Surge Spike</span>
            </span>
          )}
        </div>
        <span className="font-mono text-[10px]">Real-Time Flow Engine v2.4</span>
      </div>
    </div>
  );
};
