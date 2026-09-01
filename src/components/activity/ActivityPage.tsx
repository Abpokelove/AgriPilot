import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Activity, Zap, AlertTriangle, Radio, Clock, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { activityLogs, signals, isShocked } = useAgriPilot();

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">
              LIVE ACTIVITY & EXTERNAL SIGNALS
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            System audit event log and macro environmental signal intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>STREAMING ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Activity Timeline (7 col) + Signals Feed (5 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Timeline Column */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <h3 className="text-sm font-black uppercase text-charcoal tracking-wider">
              REAL-TIME ACTIVITY TIMELINE
            </h3>
            <span className="text-xs font-mono text-charcoal-muted">{activityLogs.length} Events</span>
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-charcoal/10"></div>

            {activityLogs.map((log) => {
              const isShock = log.isShockEvent;
              return (
                <div key={log.id} className="flex items-start space-x-4 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                      isShock
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {isShock ? <Zap className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div
                    className={`flex-1 p-4 rounded-xl border text-xs space-y-1 ${
                      isShock
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-medium shadow-md'
                        : 'bg-surface-subtle/70 border-charcoal/10 text-charcoal'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold opacity-75">{log.timestamp}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-surface border border-charcoal/10">
                        {log.category}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm leading-snug">{log.title}</h4>
                    <p className="opacity-90 leading-relaxed">{log.description}</p>
                    <div className="pt-1.5 text-[10px] font-bold text-emerald-800">
                      Impact: {log.impact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* External Market Signals Column */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black uppercase text-charcoal tracking-wider">
                EXTERNAL SIGNALS FEED
              </h3>
            </div>
            <span className="text-xs font-mono text-charcoal-muted">3 Active Signals</span>
          </div>

          <div className="space-y-4">
            {signals.map((sig) => {
              let bgClass = 'bg-surface-subtle border-charcoal/10';
              let badgeClass = 'bg-charcoal/10 text-charcoal';

              if (sig.severity === 'WARNING') {
                bgClass = 'bg-amber-50/80 border-amber-300 text-amber-950';
                badgeClass = 'bg-amber-200 text-amber-900';
              } else if (sig.severity === 'POSITIVE') {
                bgClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-950';
                badgeClass = 'bg-emerald-200 text-emerald-900';
              }

              return (
                <div key={sig.id} className={`p-4 rounded-xl border text-xs space-y-2 ${bgClass}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${badgeClass}`}>
                      {sig.type}
                    </span>
                    <span className="text-[10px] font-mono text-charcoal-muted">{sig.timestamp}</span>
                  </div>

                  <h4 className="font-extrabold text-sm">{sig.title}</h4>
                  <p className="text-charcoal-muted font-medium text-[11px]">Source: {sig.source}</p>

                  <div className="pt-2 border-t border-charcoal/10 text-xs font-bold text-charcoal">
                    {sig.impactText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
