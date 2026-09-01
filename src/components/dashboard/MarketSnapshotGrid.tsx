import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { TrendingUp, TrendingDown, Clock, Building2 } from 'lucide-react';

export const MarketSnapshotGrid: React.FC = () => {
  const { markets, isShocked } = useAgriPilot();

  // Display top 3 market snapshot cards
  const topMarkets = markets.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-charcoal tracking-wider">
          REGIONAL MARKET SNAPSHOTS
        </h3>
        <span className="text-[11px] text-charcoal-muted flex items-center space-x-1 font-mono">
          <Clock className="w-3 h-3 text-emerald-700" />
          <span>Updated 3 min ago</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMarkets.map((m) => {
          const isPos = m.priceChangePct >= 0;
          const isCritical = m.supplyPressure === 'CRITICAL';
          const isHigh = m.supplyPressure === 'HIGH';

          return (
            <div
              key={m.id}
              className={`bg-surface rounded-2xl border p-4 shadow-subtle card-hover flex flex-col justify-between ${
                isCritical
                  ? 'border-red-400 bg-red-50/40 ring-2 ring-red-400/20'
                  : 'border-charcoal/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-emerald-800" />
                    <h4 className="text-xs font-extrabold text-charcoal truncate">{m.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-muted">{m.distanceKm} km</span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div>
                    <span className="text-2xl font-black text-charcoal">₹{m.pricePerKg.toFixed(1)}</span>
                    <span className="text-xs font-semibold text-charcoal-muted">/kg</span>
                  </div>
                  <span
                    className={`text-xs font-bold flex items-center space-x-0.5 px-2 py-0.5 rounded-full ${
                      isPos ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isPos ? `+${m.priceChangePct}%` : `${m.priceChangePct}%`}</span>
                  </span>
                </div>
              </div>

              {/* Arrivals & Pressure Meta */}
              <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-muted font-medium block">Arrivals</span>
                  <span className="font-bold text-charcoal">{m.arrivalsTonnes.toLocaleString()} t</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-charcoal-muted font-medium block">Pressure</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      isCritical
                        ? 'bg-red-600 text-white animate-pulse'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {m.supplyPressure}
                  </span>
                </div>
              </div>

              {/* Tiny Sparkline Visualization */}
              <div className="mt-3 h-6 flex items-end space-x-1">
                {m.sparkline.map((val, idx) => {
                  const maxVal = Math.max(...m.sparkline);
                  const heightPct = Math.max(20, (val / maxVal) * 100);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-xs transition-all ${
                        isCritical ? 'bg-red-400' : isPos ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`Trend point ${idx + 1}: ₹${val}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
