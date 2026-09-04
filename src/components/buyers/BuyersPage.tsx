import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Store, MapPin, Clock, Award, ChevronDown, Info } from 'lucide-react';

export const BuyersPage: React.FC = () => {
  const { buyers } = useAgriPilot();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">Buyers</h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">A short list of who is paying well and paying on time.</p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Demo data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buyers.map((buyer, index) => {
          const agriStyle = ['agri-card agri-flower-corner', 'agri-card agri-leaf-side', 'agri-card agri-field-lines agri-seed-drift'][index % 3];

          return (
          <div
            key={buyer.id}
            className={`${agriStyle} bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card hover:border-emerald-500/40 transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-1 rounded-full">
                  {buyer.category}
                </span>
                <span className="text-[10px] font-bold text-charcoal-muted bg-surface-subtle px-2 py-1 rounded-full">
                  Live buyer
                </span>
              </div>

              <h3 className="text-base font-black text-charcoal">{buyer.name}</h3>
              <p className="text-xs text-charcoal-muted mt-1">Needs {buyer.cropRequired}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Rate</span>
                  <span className="text-xl font-black text-emerald-900">₹{buyer.offeredPricePerKg}/kg</span>
                </div>
                <div className="rounded-xl bg-surface-subtle border border-charcoal/10 p-3">
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Volume</span>
                  <span className="text-lg font-black text-charcoal">{buyer.quantityRequiredKg} kg</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-charcoal/5 pt-3">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Distance</span>
                </span>
                <span className="font-bold text-charcoal">{buyer.distanceKm} km</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Payment</span>
                </span>
                <span className="font-bold text-emerald-800">{buyer.paymentTerms}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Reliability</span>
                </span>
                <span className="font-extrabold text-charcoal">{buyer.reliabilityScore}%</span>
              </div>
            </div>

            <details className="mt-4 rounded-xl border border-charcoal/10 bg-surface-subtle/60">
              <summary className="cursor-pointer list-none px-3 py-2 text-xs font-bold text-charcoal flex items-center justify-between">
                More details
                <ChevronDown className="w-4 h-4 text-charcoal-light" />
              </summary>
              <div className="px-3 pb-3 text-[11px] text-charcoal-muted space-y-1">
                <p>Status: {buyer.activeStatus}</p>
                <p>Crop focus: {buyer.cropRequired}</p>
              </div>
            </details>

            <div className="mt-5 pt-3 border-t border-charcoal/10 flex items-center justify-between">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{buyer.activeStatus}</span>
              </span>
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-colors">
                DIRECT SELL
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
