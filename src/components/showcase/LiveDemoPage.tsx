import React from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  GitMerge,
  Radio,
  Route,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useAgriPilot } from '../../context/AgriPilotContext';

export const LiveDemoPage: React.FC = () => {
  const { markets, buyers, shipments, recommendation, activityLogs, signals, isShocked, toggleMarketShock, setActiveTab } =
    useAgriPilot();

  const primaryMarket = markets[0];
  const primaryBuyer = buyers[0];
  const shipment = shipments[0];
  const latestSignal = signals[0];
  const latestActivity = activityLogs[0];

  const demoSteps = [
    {
      label: 'Sense',
      title: primaryMarket ? `${primaryMarket.name} arrivals` : 'Market arrivals',
      value: primaryMarket && primaryMarket.arrivalsTonnes != null ? `${primaryMarket.arrivalsTonnes.toLocaleString()} t` : 'Live',
      icon: Radio,
      tone: isShocked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      label: 'Reason',
      title: 'Agent validates prices',
      value: '94% confidence',
      icon: Bot,
      tone: 'bg-lime-100 text-lime-950 border-lime-300',
    },
    {
      label: 'Decide',
      title: recommendation.allocations[0]?.destinationName ?? 'Best channel',
      value: `Rs ${recommendation.expectedRealization.toLocaleString('en-IN')}`,
      icon: GitMerge,
      tone: 'bg-teal-100 text-teal-950 border-teal-300',
    },
    {
      label: 'Move',
      title: shipment?.destination ?? 'Dispatch ready',
      value: shipment ? `${shipment.etaMinutes} min ETA` : 'Ready',
      icon: Route,
      tone: 'bg-sky-100 text-sky-950 border-sky-300',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <section className="judge-gradient rounded-3xl p-6 md:p-8 text-white shadow-floating overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_48%,transparent_70%)] animate-[card-sheen_4s_ease-in-out_infinite]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="live-pill inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-bold text-emerald-50">
              <Sparkles className="h-4 w-4 text-lime-200" />
              LIVE SCENARIO WORKSPACE
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">Live AgriPilot Intelligence</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-emerald-50/82">
              Watch market signals, Gemini-assisted reasoning, deterministic optimization, and shipment flow update as one connected system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={toggleMarketShock}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black text-emerald-900 shadow-md transition hover:-translate-y-0.5 hover:bg-lime-50"
              >
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                {isShocked ? 'Reset Live Scenario' : 'Run Market Shock'}
              </button>
              <button
                onClick={() => setActiveTab('decisions')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/18"
              >
                Open Decision Plan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/12 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-50/80">
              <span>Farm</span>
              <span>Markets</span>
              <span>Buyer</span>
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3">
              <div className="float-soft h-14 w-14 rounded-2xl bg-lime-200 text-emerald-950 flex items-center justify-center shadow-lg">
                <Sprout className="h-7 w-7" />
              </div>
              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                <div className="route-flow h-full rounded-full bg-emerald-200" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white text-emerald-900 flex items-center justify-center shadow-lg">
                {isShocked ? <TrendingDown className="h-7 w-7 text-amber-600" /> : <TrendingUp className="h-7 w-7" />}
              </div>
              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                <div className="route-flow h-full rounded-full bg-lime-200" />
              </div>
              <div className="float-soft stagger-2 h-14 w-14 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-emerald-950/35 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-lime-200">Current recommendation</p>
              <p className="mt-2 text-xl font-black">
                Sell {recommendation.allocations[0]?.quantityKg ?? 0} kg to {recommendation.allocations[0]?.destinationName ?? 'best channel'}
              </p>
              <p className="mt-1 text-xs text-emerald-50/75">{recommendation.situationText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {demoSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className={`agri-card ${index % 2 === 0 ? 'agri-leaf-side' : 'agri-flower-corner'} motion-card page-enter stagger-${index + 1} rounded-2xl border bg-white p-5 shadow-card`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${step.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">{step.label}</p>
              <h3 className="mt-1 text-sm font-black text-charcoal">{step.title}</h3>
              <p className="mt-2 text-lg font-black text-emerald-800">{step.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="agri-card agri-field-lines lg:col-span-7 rounded-3xl border border-charcoal/10 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Agent timeline</p>
              <h2 className="mt-1 text-xl font-black text-charcoal">What the system is doing</h2>
            </div>
            <Activity className="h-6 w-6 text-emerald-700 animate-pulse" />
          </div>

          <div className="mt-6 space-y-4">
            {recommendation.allocations.map((allocation, index) => (
              <div key={allocation.destinationId} className="grid grid-cols-[40px_1fr_auto] items-center gap-4">
                <div className="h-10 w-10 rounded-xl judge-gradient text-white flex items-center justify-center font-black">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-black text-charcoal">{allocation.destinationName}</p>
                  <p className="text-xs text-charcoal-muted">
                    {allocation.quantityKg} kg at Rs {allocation.pricePerKg}/kg
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-800">Rs {allocation.netRealization.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-charcoal-light">net</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="agri-card agri-flower-corner rounded-3xl border border-charcoal/10 bg-white p-6 shadow-card leaf-panel">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Latest signal</p>
            <h3 className="mt-2 text-lg font-black text-charcoal">{latestSignal?.title ?? 'No signal loaded'}</h3>
            <p className="mt-2 text-sm text-charcoal-muted">{latestSignal?.impactText ?? 'Waiting for live market signal.'}</p>
          </div>

          <div className="agri-card agri-leaf-side rounded-3xl border border-charcoal/10 bg-white p-6 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">Latest app event</p>
            <h3 className="mt-2 text-lg font-black text-charcoal">{latestActivity?.title ?? 'No event loaded'}</h3>
            <p className="mt-2 text-sm text-charcoal-muted">{latestActivity?.impact ?? 'Realtime event stream is ready.'}</p>
          </div>

          <div className="agri-card agri-field-lines agri-seed-drift rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-800">Best buyer</p>
            <h3 className="mt-2 text-lg font-black text-emerald-950">{primaryBuyer?.name ?? 'Buyer loading'}</h3>
            <p className="mt-2 text-sm font-bold text-emerald-800">
              Rs {primaryBuyer?.offeredPricePerKg ?? 0}/kg with {primaryBuyer?.paymentTerms ?? 'fast'} payment
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
