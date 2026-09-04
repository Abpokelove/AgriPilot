import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { CheckCircle2, Eye, Cpu, CheckSquare, Calculator, Lightbulb, ShieldCheck, DollarSign } from 'lucide-react';

export const IntelligencePanel: React.FC = () => {
  const { isShocked, recommendation } = useAgriPilot();

  const stages = isShocked
    ? [
        {
          stage: 'OBSERVED',
          label: 'Market A arrivals ↑70% (2,108 t)',
          icon: Eye,
          status: 'alert',
        },
        {
          stage: 'ANALYZED',
          label: 'Severe price drop & critical pressure',
          icon: Cpu,
          status: 'alert',
        },
        {
          stage: 'CHECKED',
          label: 'Market B & Buyer B volume capacity',
          icon: CheckSquare,
          status: 'checked',
        },
        {
          stage: 'CALCULATED',
          label: 'Net realization across 3 routes',
          icon: Calculator,
          status: 'checked',
        },
        {
          stage: 'RECOMMENDED',
          label: 'Re-route 400 kg to Market B & Buyer B',
          icon: Lightbulb,
          status: 'highlight',
        },
      ]
    : [
        {
          stage: 'OBSERVED',
          label: 'Market A arrivals ↑31% (1,240 t)',
          icon: Eye,
          status: 'checked',
        },
        {
          stage: 'ANALYZED',
          label: 'High supply pressure forming',
          icon: Cpu,
          status: 'checked',
        },
        {
          stage: 'CHECKED',
          label: '2 alternative buyers available',
          icon: CheckSquare,
          status: 'checked',
        },
        {
          stage: 'CALCULATED',
          label: 'Transport + price + constraints',
          icon: Calculator,
          status: 'checked',
        },
        {
          stage: 'RECOMMENDED',
          label: 'Split: 400 kg A, 200 kg B, 200 kg Hold',
          icon: Lightbulb,
          status: 'highlight',
        },
      ];

  return (
    <div className="space-y-6">
      {/* AGRIPILOT INTELLIGENCE PIPELINE */}
      <div className="agri-card agri-flower-corner bg-surface rounded-2xl border border-charcoal/10 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4 border-b border-charcoal/5 pb-3">
          <div>
            <h3 className="text-xs font-black text-charcoal uppercase tracking-wider">
              AGRIPILOT INTELLIGENCE
            </h3>
            <p className="text-[10px] text-charcoal-muted mt-0.5">Decision Factor Pipeline</p>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MONITORING</span>
          </div>
        </div>

        {/* High-Level Stages Flow */}
        <div className="space-y-3 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-emerald-100 -z-0"></div>

          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isHighlight = st.status === 'highlight';
            const isAlert = st.status === 'alert';

            return (
              <div key={idx} className="flex items-start space-x-3 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                    isAlert
                      ? 'bg-amber-500 text-white animate-pulse'
                      : isHighlight
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`flex-1 p-2.5 rounded-xl border text-xs ${
                    isAlert
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950 font-medium'
                      : isHighlight
                      ? 'bg-emerald-50/90 border-emerald-300 font-bold text-emerald-950'
                      : 'bg-surface-subtle/60 border-charcoal/5 text-charcoal'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase text-charcoal-light tracking-wider">
                    {st.stage}
                  </div>
                  <div className="mt-0.5 font-semibold leading-tight">{st.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPECTED OUTCOME FINANCIAL IMPACT */}
      <div className="agri-card agri-seed-drift bg-emerald-900 text-white rounded-2xl p-5 shadow-floating border border-emerald-700/60 relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-100">
              EXPECTED OUTCOME
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">
            If plan followed
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
              Expected Net Realization
            </span>
            <div className="text-2xl font-black text-white mt-0.5 tracking-tight flex items-baseline space-x-2">
              <span>₹{recommendation.expectedRealization.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-emerald-300">
                +{recommendation.pctImprovement}% vs default
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-emerald-200 font-medium block">Downside Avoided</span>
              <span className="font-extrabold text-amber-300 text-sm">
                ₹{recommendation.downsideAvoided.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 font-medium block">Est. Spoilage</span>
              <span className="font-extrabold text-white text-sm">
                {recommendation.spoilageEstimatePct}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 font-medium block">Transport Cost</span>
              <span className="font-bold text-emerald-100">
                ₹{recommendation.transportCostTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 font-medium block">Cash Requirement</span>
              <span className="font-bold text-emerald-100">
                Met (₹50k Friday)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
