import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Truck, MapPin, CheckCircle2, Phone, ShieldCheck, ChevronDown } from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const { shipments } = useAgriPilot();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">Shipments</h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">A short view of what is on the road right now.</p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live transit</span>
        </div>
      </div>

      <div className="space-y-5">
        {shipments.map((shipment) => {
          const progressWidth = shipment.status === 'DELIVERED' ? '100%' : '68%';

          return (
            <div key={shipment.id} className="agri-card agri-leaf-side agri-seed-drift bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-charcoal-light bg-surface-subtle px-2.5 py-1 rounded">
                      {shipment.id}
                    </span>
                    <h3 className="text-lg font-black text-charcoal">
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3.5 rounded-xl bg-surface-subtle text-xs">
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
                    Farm
                  </span>
                  <span className="text-emerald-700">Route in progress</span>
                  <span>{shipment.destination}</span>
                </div>
                <div className="w-full h-3 bg-surface-subtle rounded-full overflow-hidden border border-charcoal/10 p-0.5">
                  <div
                    className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                    style={{ width: progressWidth }}
                  />
                </div>
              </div>

              <details className="rounded-xl border border-charcoal/10 bg-surface-subtle/60">
                <summary className="cursor-pointer list-none px-3 py-2 text-xs font-bold text-charcoal flex items-center justify-between">
                  Timeline
                  <ChevronDown className="w-4 h-4 text-charcoal-light" />
                </summary>
                <div className="px-3 pb-3 grid grid-cols-1 md:grid-cols-5 gap-3">
                  {shipment.timeline.map((step, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border text-xs ${
                        step.completed
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-surface border-charcoal/10 text-charcoal-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${step.completed ? 'text-emerald-700' : 'text-charcoal-light'}`} />
                        <span className="text-[10px] font-mono">{step.time}</span>
                      </div>
                      <p className="leading-snug">{step.title}</p>
                    </div>
                  ))}
                </div>
              </details>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal-muted">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Settlement ready on delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  {shipment.driverPhone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
