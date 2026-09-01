import React, { useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { ArrowRight, HelpCircle, ShieldCheck, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const MainDecisionCard: React.FC = () => {
  const { recommendation, isShocked, setActiveTab } = useAgriPilot();
  const [showReasoningModal, setShowReasoningModal] = useState(false);

  return (
    <div
      className={`relative bg-surface rounded-2xl border p-6 md:p-7 shadow-floating overflow-hidden transition-all duration-500 ${
        isShocked
          ? 'border-amber-400 ring-4 ring-amber-400/20'
          : 'border-emerald-700/30'
      }`}
    >
      {/* Background Graphic Emerald Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
          <h3 className="text-xs font-black tracking-wider uppercase text-emerald-800">
            AGRIPILOT RECOMMENDATION
          </h3>
        </div>

        <span
          className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center space-x-1.5 ${
            isShocked
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {isShocked ? <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
          <span>Current situation: {recommendation.situationText}</span>
        </span>
      </div>

      {/* Main Grid: Plan Breakdown & Financial Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Allocations Column */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
            Recommended Plan
          </h2>

          <div className="space-y-2.5">
            {recommendation.allocations.map((alloc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-charcoal/10 bg-surface-subtle/70 hover:bg-surface flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-16 text-left">
                    <span className="text-base font-black text-emerald-800 block">
                      {alloc.quantityKg} kg
                    </span>
                    <span className="text-[10px] text-charcoal-muted font-semibold">
                      ({alloc.pct}%)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">{alloc.destinationName}</h4>
                    <span className="text-[10px] text-charcoal-muted font-medium">
                      Est. Rate: ₹{alloc.pricePerKg}/kg • {alloc.badgeText}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-charcoal block">
                    ₹{alloc.netRealization.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Net Yield</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Realization Financial Impact Box */}
        <div className="lg:col-span-5 bg-surface-dark text-white rounded-2xl p-6 shadow-floating border border-charcoal/20 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Expected Realization
            </span>
            <div className="text-3xl md:text-4xl font-black text-white mt-1 tracking-tight">
              ₹{recommendation.expectedRealization.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
              <span>+{recommendation.pctImprovement}% expected improvement</span>
            </div>
            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
              compared with selling everything through the nearest market.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('decisions')}
              className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>VIEW DECISION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowReasoningModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>WHY THIS PLAN?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Why This Plan Modal */}
      {showReasoningModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-charcoal/15 max-w-lg w-full p-6 shadow-floating space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h3 className="text-base font-extrabold text-charcoal">
                Why AgriPilot Recommended This Plan
              </h3>
              <button
                onClick={() => setShowReasoningModal(false)}
                className="text-charcoal-muted hover:text-charcoal text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-charcoal leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
              "{recommendation.reasoning}"
            </p>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-charcoal">Decision Drivers Verified:</h4>
              <ul className="space-y-1.5 text-charcoal-muted">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Market A arrival volume & price pressure index</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Buyer B guaranteed cash payout matching Friday ₹50k requirement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>2-day storage constraint safety threshold to prevent spoilage</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-charcoal/10 text-right">
              <button
                onClick={() => setShowReasoningModal(false)}
                className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
