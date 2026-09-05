import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Activity, Zap, Radio, CheckCircle2, ChevronDown } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { activityLogs, signals } = useAgriPilot();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">Alerts & Agentic Activity</h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">Autonomous multi-agent market monitoring & dynamic re-planning updates.</p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Agents Active</span>
        </div>
      </div>

      {/* AGENTIC BEHAVIOR PRESENTATION (WHAT HAPPENED -> WHY -> WHAT SHOULD I DO) */}
      <div className="agri-card agri-leaf-side bg-surface rounded-2xl border border-emerald-800/20 p-6 shadow-card space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">
          AGENTIC DECISION REASONING FLOW
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">1. WHAT HAPPENED?</span>
            <h4 className="text-sm font-extrabold text-charcoal">Market Arrivals Surge</h4>
            <p className="text-xs text-charcoal-muted">Madurai / Market A arrivals increased by +70% overnight.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">2. WHY?</span>
            <h4 className="text-sm font-extrabold text-charcoal">Supply Pressure Spike</h4>
            <p className="text-xs text-charcoal-muted">Harvest glut in neighboring district caused price slippage risk.</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-900 text-white space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">3. WHAT SHOULD I DO?</span>
            <h4 className="text-sm font-extrabold text-white">Re-Route to Dindigul & Buyer B</h4>
            <p className="text-xs text-emerald-100/80">AgriPilot re-allocated 50% to Market B and 30% to direct contract.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="agri-card agri-field-lines lg:col-span-7 bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <h3 className="text-sm font-black uppercase text-charcoal tracking-wider">Timeline</h3>
            <span className="text-xs font-mono text-charcoal-muted">{activityLogs.length} events</span>
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-charcoal/10" />

            {activityLogs.map((log) => {
              const isShock = log.isShockEvent;

              return (
                <div key={log.id} className="flex items-start space-x-4 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                      isShock ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {isShock ? <Zap className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div
                    className={`flex-1 p-4 rounded-xl border text-xs space-y-1 ${
                      isShock ? 'bg-amber-50/90 border-amber-300 text-amber-950' : 'bg-surface-subtle/70 border-charcoal/10 text-charcoal'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold opacity-75">{log.timestamp}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-surface border border-charcoal/10">
                        {log.category}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm leading-snug">{log.title}</h4>
                    <p className="opacity-90 leading-relaxed">{log.description}</p>
                    <div className="pt-1.5 text-[10px] font-bold text-emerald-800">Impact: {log.impact}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="agri-card agri-flower-corner lg:col-span-5 bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black uppercase text-charcoal tracking-wider">Signals</h3>
            </div>
            <span className="text-xs font-mono text-charcoal-muted">3 active</span>
          </div>

          <div className="space-y-4">
            {signals.map((signal) => {
              let cardClass = 'bg-surface-subtle border-charcoal/10';
              let badgeClass = 'bg-charcoal/10 text-charcoal';

              if (signal.severity === 'WARNING') {
                cardClass = 'bg-amber-50/80 border-amber-300 text-amber-950';
                badgeClass = 'bg-amber-200 text-amber-900';
              } else if (signal.severity === 'POSITIVE') {
                cardClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-950';
                badgeClass = 'bg-emerald-200 text-emerald-900';
              }

              return (
                <div key={signal.id} className={`p-4 rounded-xl border text-xs space-y-2 ${cardClass}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${badgeClass}`}>
                      {signal.type}
                    </span>
                    <span className="text-[10px] font-mono text-charcoal-muted">{signal.timestamp}</span>
                  </div>

                  <h4 className="font-extrabold text-sm">{signal.title}</h4>
                  <p className="text-charcoal-muted font-medium text-[11px]">Source: {signal.source}</p>
                  <div className="pt-2 border-t border-charcoal/10 text-xs font-bold text-charcoal">{signal.impactText}</div>
                </div>
              );
            })}
          </div>

          <details className="rounded-xl border border-charcoal/10 bg-surface-subtle/60">
            <summary className="cursor-pointer list-none px-3 py-2 text-xs font-bold text-charcoal flex items-center justify-between">
              What this means
              <ChevronDown className="w-4 h-4 text-charcoal-light" />
            </summary>
            <div className="px-3 pb-3 text-[11px] text-charcoal-muted space-y-1">
              <p>Warning signals need quick review.</p>
              <p>Positive signals can be used for timing decisions.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
