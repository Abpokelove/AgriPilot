import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Store, ShieldCheck, MapPin, Clock, DollarSign, Award, Info } from 'lucide-react';

export const BuyersPage: React.FC = () => {
  const { buyers } = useAgriPilot();

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">
              B2B BUYER INTELLIGENCE DIRECTORY
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Direct institutional contract buyers, processor procurement, and retail chains.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Demo Data / Synthetic Prototype Records</span>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buyers.map((b) => (
          <div
            key={b.id}
            className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card hover:border-emerald-500/40 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Demo Data Watermark Badge */}
            <div className="absolute top-3 right-3">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-surface-subtle text-charcoal-muted border border-charcoal/10 px-2 py-0.5 rounded">
                Demo Data
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Store className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {b.category}
                </span>
              </div>

              <h3 className="text-base font-black text-charcoal">{b.name}</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">Looking for: {b.cropRequired}</p>

              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Offered Rate</span>
                  <span className="text-2xl font-black text-emerald-900">₹{b.offeredPricePerKg}/kg</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Volume Req</span>
                  <span className="text-sm font-bold text-emerald-900">{b.quantityRequiredKg} kg</span>
                </div>
              </div>

              {/* Attributes */}
              <div className="mt-4 space-y-2 text-xs border-t border-charcoal/5 pt-3">
                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Distance</span>
                  </span>
                  <span className="font-bold text-charcoal">{b.distanceKm} km</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Payment Terms</span>
                  </span>
                  <span className="font-bold text-emerald-800">{b.paymentTerms}</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Reliability Rating</span>
                  </span>
                  <span className="font-extrabold text-charcoal">{b.reliabilityScore}%</span>
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="mt-6 pt-3 border-t border-charcoal/10 flex items-center justify-between">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{b.activeStatus}</span>
              </span>

              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-colors">
                DIRECT SELL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
