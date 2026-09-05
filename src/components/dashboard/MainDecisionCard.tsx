import React, { useMemo, useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { ArrowRight, CheckCircle2, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';

export const MainDecisionCard: React.FC = () => {
  const { recommendation, isShocked, setActiveTab } = useAgriPilot();
  const [showDetails, setShowDetails] = useState(false);

  const primaryAllocation = recommendation.allocations[0];
  const supportingReasons = useMemo(
    () =>
      recommendation.reasoning
        .split('.')
        .map((reason) => reason.trim())
        .filter(Boolean)
        .slice(0, 3),
    [recommendation.reasoning]
  );

  return (
    <div
      className={`agri-card agri-leaf-side agri-seed-drift relative overflow-hidden rounded-3xl border bg-surface p-6 shadow-floating transition-all duration-500 md:p-7 group ${
        isShocked ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-emerald-700/20'
      }`}
    >
      <RestingLeaf position="top-right" />
      <RainDripBorder side="both" />
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-700/5 blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-emerald-800">
              AgriPilot recommends
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-charcoal-muted">
              {isShocked ? 'Market change detected' : "Today's best action"}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-charcoal md:text-4xl">
              Sell {primaryAllocation?.quantityKg ?? 0} kg to {primaryAllocation?.destinationName ?? 'your best buyer'}
            </h2>
            <p className="text-sm text-charcoal-muted">
              Expected earnings:{' '}
              <span className="font-bold text-charcoal">₹{recommendation.expectedRealization.toLocaleString('en-IN')}</span>
              <span className="mx-2 text-charcoal-light">•</span>
              Rate: <span className="font-bold text-emerald-800">₹{primaryAllocation?.pricePerKg ?? 0}/kg</span>
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold ${
            isShocked ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {isShocked ? <AlertCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          <span>{recommendation.situationText}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-charcoal/10 bg-surface-subtle/70 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Why?</p>
          <div className="mt-3 space-y-2">
            {supportingReasons.map((reason) => (
              <div key={reason} className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-emerald-900 p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Next</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black tracking-tight">{primaryAllocation?.destinationName ?? 'Open full plan'}</p>
              <p className="text-sm text-emerald-100/80">
                {primaryAllocation
                  ? `${primaryAllocation.quantityKg} kg • ₹${primaryAllocation.pricePerKg}/kg`
                  : 'View the detailed selling plan'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('harvest-plan')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              View Plan ⭐
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-xs font-bold text-charcoal transition hover:border-emerald-300 hover:text-emerald-800"
        >
          <HelpCircle className="h-4 w-4" />
          {showDetails ? 'Hide details' : 'Why this plan?'}
        </button>
        <span className="text-xs text-charcoal-muted">Better return + lower crowding + fits your storage limit</span>
      </div>

      {showDetails && (
        <div className="mt-4 rounded-2xl border border-charcoal/10 bg-surface-subtle/70 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Plan details</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {recommendation.allocations.map((allocation) => (
              <div key={allocation.destinationId} className="rounded-xl border border-charcoal/10 bg-white p-3">
                <p className="text-sm font-bold text-charcoal">{allocation.destinationName}</p>
                <p className="text-xs text-charcoal-muted">
                  {allocation.quantityKg} kg • ₹{allocation.pricePerKg}/kg
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-charcoal-muted">
            <span className="rounded-full bg-white px-3 py-1 font-semibold">
              Expected earnings ₹{recommendation.expectedRealization.toLocaleString('en-IN')}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-semibold">
              Transport ₹{recommendation.transportCostTotal.toLocaleString('en-IN')}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-semibold">{recommendation.situationText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
