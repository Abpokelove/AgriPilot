import React, { useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import {
  GitMerge,
  Sparkles,
  Zap,
  HelpCircle,
  Truck,
  Building2,
  Store,
  Warehouse,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Info,
  MapPin,
  Phone,
  ChevronDown,
} from 'lucide-react';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';

export const HarvestPlanPage: React.FC = () => {
  const { farmer, recommendation, shipments, isShocked, toggleMarketShock } = useAgriPilot();
  const [showWhyModal, setShowWhyModal] = useState(false);

  // Calculate totals
  const totalQuantity = recommendation.allocations.reduce((sum, item) => sum + item.quantityKg, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="agri-card agri-leaf-side relative overflow-hidden rounded-3xl border border-emerald-800/20 bg-surface p-6 md:p-8 shadow-card">
        <RestingLeaf position="top-right" className="top-4 right-6" />
        <RainDripBorder side="both" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                Smart Allocation • Multi-Agent System
              </span>
              {isShocked && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                  <Zap className="w-3 h-3 mr-1 fill-white" />
                  Dynamic Re-Routed
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-charcoal tracking-tight">
              MY HARVEST PLAN
            </h1>

            <p className="text-xs md:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
              AgriPilot distributes your <strong className="text-charcoal font-extrabold">{farmer.activeCrop}</strong> harvest across optimal market channels to avoid local supply pressure and maximize your net realization.
            </p>
          </div>

          {/* Expected Net Realisation Banner */}
          <div className="agri-card agri-seed-drift judge-gradient text-white rounded-2xl p-5 shadow-floating min-w-[280px] flex flex-col justify-between shrink-0">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200/90 block">
                EXPECTED NET REALISATION
              </span>
              <div className="text-3xl md:text-4xl font-black tracking-tight mt-1">
                ₹{recommendation.expectedRealization.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-emerald-50">
              <span>+₹{(recommendation.expectedRealization - recommendation.baselineComparison).toLocaleString('en-IN')} vs local dump</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
                +{recommendation.pctImprovement}% gain
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Harvest Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="agri-card bg-surface rounded-2xl border border-charcoal/10 p-4 shadow-subtle">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block">TOTAL HARVEST</span>
          <p className="text-xl font-black text-charcoal mt-1">{totalQuantity} kg {farmer.activeCrop}</p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Grade A • Fresh Harvest</span>
        </div>

        <div className="agri-card bg-surface rounded-2xl border border-charcoal/10 p-4 shadow-subtle">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block">TRANSPORT COST</span>
          <p className="text-xl font-black text-charcoal mt-1">₹{recommendation.transportCostTotal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-charcoal-muted mt-0.5 block">Batched multi-stop routing</span>
        </div>

        <div className="agri-card bg-surface rounded-2xl border border-charcoal/10 p-4 shadow-subtle">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block">SUPPLY PRESSURE</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isShocked ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
            <p className="text-xl font-black text-charcoal">{isShocked ? 'HIGH SHOCK' : 'MODERATE'}</p>
          </div>
          <span className="text-[11px] text-charcoal-muted mt-0.5 block">Kolar APMC arrivals high</span>
        </div>

        <div className="agri-card bg-surface rounded-2xl border border-charcoal/10 p-4 shadow-subtle">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted block">STORAGE BUFFER</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{farmer.storageCapacityDays} Days Capacity</p>
          <span className="text-[11px] text-charcoal-muted mt-0.5 block">Holding preserves upside</span>
        </div>
      </div>

      {/* Hero Feature: COLLECTIVE HARVEST ALLOCATION */}
      <div className="agri-card agri-flower-corner relative overflow-hidden bg-surface rounded-3xl border border-charcoal/10 p-6 md:p-8 shadow-card space-y-6">
        <RestingLeaf position="top-left" />
        <RainDripBorder side="left" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
          <div>
            <h2 className="text-xl font-black text-charcoal tracking-tight flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-emerald-700" />
              RECOMMENDED ALLOCATION PLAN
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Multi-channel distribution strategy designed specifically for your crop parameters.
            </p>
          </div>

          <button
            onClick={() => setShowWhyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold transition hover:bg-emerald-100 hover:border-emerald-400"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Why this plan?</span>
          </button>
        </div>

        {/* Allocations Cards Breakdown */}
        <div className="space-y-4">
          {recommendation.allocations.map((alloc, idx) => {
            const isHold = alloc.destinationId === 'hold';
            const isBuyer = alloc.destinationId === 'buyer-b';

            return (
              <div
                key={idx}
                className={`agri-card p-5 rounded-2xl border transition-all duration-300 ${
                  isShocked && idx === 0
                    ? 'bg-amber-50/70 border-amber-300 shadow-md'
                    : 'bg-surface-subtle/80 border-charcoal/10 hover:border-emerald-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl judge-gradient text-white flex flex-col items-center justify-center font-black shrink-0 shadow-sm">
                      <span className="text-lg leading-none">{alloc.pct}%</span>
                      <span className="text-[9px] font-medium opacity-80 uppercase mt-0.5">SHARE</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {isHold ? (
                          <Warehouse className="w-4 h-4 text-amber-700" />
                        ) : isBuyer ? (
                          <Store className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Building2 className="w-4 h-4 text-emerald-700" />
                        )}
                        <h3 className="text-base font-extrabold text-charcoal">{alloc.destinationName}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-charcoal-muted">
                        <span className="font-bold text-charcoal">{alloc.quantityKg} kg</span>
                        <span>•</span>
                        <span>Rate: <strong className="text-emerald-800">₹{alloc.pricePerKg}/kg</strong></span>
                        <span>•</span>
                        <span>Transport: ₹{alloc.transportCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 pt-3 md:pt-0 border-charcoal/10">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold">
                      {alloc.badgeText}
                    </span>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-900 block">
                        ₹{alloc.netRealization.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-charcoal-muted uppercase font-bold">Net Realization</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Visualiser */}
                <div className="mt-4 w-full bg-charcoal/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="judge-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${alloc.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Plain Language Agent Reason Card */}
        <div className="p-6 rounded-2xl bg-emerald-900 text-white space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>AGRIPILOT SYSTEM REASONING</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-200 font-mono">
              Confidence: 96%
            </span>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-emerald-50 font-medium">
            "{recommendation.reasoning}"
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-emerald-200">
            <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
              ✓ Protects against price slippage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
              ✓ Considers truck unloading delay risks
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
              ✓ Matches buyer payment terms
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC RE-ROUTING IN ACTION (MARKET SHOCK SIMULATOR) */}
      <div className="agri-card agri-field-lines bg-surface rounded-3xl border border-charcoal/10 p-6 md:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl font-black text-charcoal tracking-tight">
                DYNAMIC RE-ROUTING IN ACTION
              </h2>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              AgriPilot background agents constantly monitor market arrivals. Test how the plan responds to market changes.
            </p>
          </div>

          <button
            onClick={toggleMarketShock}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center space-x-2 shadow-md ${
              isShocked
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'judge-gradient text-white field-glow'
            }`}
          >
            {isShocked ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-200" />
                <span>RESTORE BASELINE PLAN</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>SIMULATE MARKET SUPPLY SHOCK</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Scenario comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-surface-subtle border border-charcoal/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-charcoal-muted">BASELINE ALLOCATION</span>
              <span className="text-xs font-black text-emerald-800">₹21,840 Expected Net</span>
            </div>
            <p className="text-xs text-charcoal leading-relaxed">
              Standard distribution under normal arrivals at primary APMC.
            </p>
            <div className="text-xs font-mono space-y-1 text-charcoal-muted pt-2 border-t border-charcoal/10">
              <p>• Kolar APMC Yard: 400 kg (50%) @ ₹27.0/kg</p>
              <p>• Buyer B (FreshChoice): 200 kg (25%) @ ₹26.0/kg</p>
              <p>• Farm Warehouse Hold: 200 kg (25%) @ ₹28.5/kg</p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border space-y-3 ${
            isShocked ? 'bg-amber-50 border-amber-400 shadow-md' : 'bg-surface-subtle border-charcoal/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-900">UPDATED ALLOCATION (AFTER SHOCK)</span>
              <span className="text-xs font-black text-amber-900">₹23,160 Expected Net</span>
            </div>
            <p className="text-xs text-charcoal leading-relaxed">
              Triggered when arrival surge spikes at Kolar APMC. Re-routes volume away from severe arrival pressure.
            </p>
            <div className="text-xs font-mono space-y-1 text-charcoal-muted pt-2 border-t border-charcoal/10">
              <p className="text-emerald-800 font-bold">• Bengaluru K R Market: 400 kg (50%) @ ₹25.4/kg [RE-ROUTED]</p>
              <p className="text-emerald-800 font-bold">• Buyer B (FreshChoice): 240 kg (30%) @ ₹26.0/kg [INCREASED]</p>
              <p className="text-amber-700 font-bold">• Kolar APMC Yard: 160 kg (20%) @ ₹21.0/kg [REDUCED]</p>
            </div>
          </div>
        </div>
      </div>

      {/* HARVEST LOGISTICS PLAN */}
      <div className="agri-card agri-leaf-side bg-surface rounded-3xl border border-charcoal/10 p-6 md:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-charcoal tracking-tight">HARVEST LOGISTICS PLAN</h2>
              <p className="text-xs text-charcoal-muted">Planned destinations, transport options, estimated costs, and dispatch readiness.</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Logistics Ready
          </span>
        </div>

        <div className="space-y-4">
          {shipments.map((shipment) => {
            const progressWidth = shipment.status === 'DELIVERED' ? '100%' : '68%';

            return (
              <div key={shipment.id} className="p-5 rounded-2xl bg-surface-subtle border border-charcoal/10 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-charcoal-light bg-surface px-2.5 py-1 rounded border border-charcoal/10">
                        {shipment.id}
                      </span>
                      <h3 className="text-base font-extrabold text-charcoal">
                        {shipment.cropName} ({shipment.quantityKg} kg)
                      </h3>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          shipment.status === 'IN TRANSIT'
                            ? 'bg-emerald-700 text-white animate-pulse'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted">
                      Destination: <strong className="text-charcoal">{shipment.destination}</strong>
                    </p>
                  </div>

                  {shipment.etaMinutes > 0 && (
                    <div className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-right shrink-0">
                      <span className="text-[10px] text-emerald-300 font-bold uppercase block">ETA</span>
                      <span className="text-xl font-black">{shipment.etaMinutes} min</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white border border-charcoal/10 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Vehicle</span>
                    <span className="font-extrabold text-charcoal">{shipment.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Driver</span>
                    <span className="font-extrabold text-charcoal">{shipment.driverName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Contact</span>
                    <span className="font-mono text-emerald-800 font-bold">{shipment.driverPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Dispatch</span>
                    <span className="font-bold text-charcoal">{shipment.dispatchTime}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-charcoal mb-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      Farm Origin
                    </span>
                    <span className="text-emerald-700">In Transit</span>
                    <span>{shipment.destination}</span>
                  </div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-charcoal/10 p-0.5">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>

                <details className="rounded-xl border border-charcoal/10 bg-white">
                  <summary className="cursor-pointer list-none px-3 py-2 text-xs font-bold text-charcoal flex items-center justify-between">
                    Milestone Timeline
                    <ChevronDown className="w-4 h-4 text-charcoal-light" />
                  </summary>
                  <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {shipment.timeline.map((step, index) => (
                      <div
                        key={index}
                        className={`p-2.5 rounded-xl border text-xs ${
                          step.completed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-surface-subtle border-charcoal/10 text-charcoal-muted'
                        }`}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${step.completed ? 'text-emerald-700' : 'text-charcoal-light'}`} />
                          <span className="text-[10px] font-mono">{step.time}</span>
                        </div>
                        <p className="leading-snug">{step.title}</p>
                      </div>
                    ))}
                  </div>
                </details>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-charcoal-muted">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Payment settlement locked on arrival
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    Direct Dispatch Hotline: {shipment.driverPhone}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY THIS PLAN MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="agri-card bg-surface rounded-3xl border border-charcoal/10 p-6 md:p-8 max-w-xl w-full shadow-floating space-y-5 relative">
            <RestingLeaf position="top-right" />
            <RainDripBorder side="both" />

            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-emerald-700" />
                <h3 className="text-xl font-black text-charcoal">Why this allocation plan?</h3>
              </div>
              <button
                onClick={() => setShowWhyModal(false)}
                className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal-muted hover:bg-charcoal/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-charcoal leading-relaxed">
              <p className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium text-sm">
                "Madurai/Market A currently has a higher listed price, but arrivals are high today. Sending your entire harvest there may increase local supply pressure and trigger price slippage during truck unloading."
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal font-bold">Price Pressure Defense:</strong>
                    <p className="text-charcoal-muted">Distributes 50% to direct contract buyers with fixed price guarantees.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal font-bold">Logistics Optimization:</strong>
                    <p className="text-charcoal-muted">Clusters destinations along existing highway routes, saving ₹450 in fuel.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal font-bold">Perishability & Cash Flow:</strong>
                    <p className="text-charcoal-muted">Meets your cash target by Friday while keeping 25% in storage for weekend demand.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal/10 flex justify-end">
              <button
                onClick={() => setShowWhyModal(false)}
                className="judge-gradient text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                Got it, close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
