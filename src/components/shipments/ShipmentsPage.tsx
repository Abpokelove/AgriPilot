import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Truck, Clock, MapPin, CheckCircle2, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const { shipments } = useAgriPilot();

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">ACTIVE DISPATCH & SHIPMENTS</h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Real-time vehicle GPS tracking, delivery ETAs, and digital proof-of-delivery settlements.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>1 ACTIVE TRANSIT IN PROGRESS</span>
        </div>
      </div>

      {/* Active Shipments Cards List */}
      <div className="space-y-6">
        {shipments.map((sh) => (
          <div
            key={sh.id}
            className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-6"
          >
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-charcoal-light bg-surface-subtle px-2.5 py-1 rounded">
                    {sh.id}
                  </span>
                  <h3 className="text-lg font-black text-charcoal">{sh.cropName} ({sh.quantityKg} kg)</h3>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      sh.status === 'IN TRANSIT'
                        ? 'bg-emerald-700 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {sh.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-1">
                  Destination: <strong className="text-charcoal">{sh.destination}</strong>
                </p>
              </div>

              {/* ETA Box */}
              {sh.etaMinutes > 0 && (
                <div className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-right shrink-0">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase block">ESTIMATED ETA</span>
                  <span className="text-xl font-black">{sh.etaMinutes} MIN</span>
                </div>
              )}
            </div>

            {/* Vehicle & Driver Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3.5 rounded-xl bg-surface-subtle text-xs">
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Vehicle Registration</span>
                <span className="font-extrabold text-charcoal">{sh.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Logistics Partner Driver</span>
                <span className="font-extrabold text-charcoal">{sh.driverName}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Driver Contact</span>
                <span className="font-mono text-emerald-800 font-bold">{sh.driverPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold uppercase block">Dispatch Time</span>
                <span className="font-bold text-charcoal">{sh.dispatchTime}</span>
              </div>
            </div>

            {/* Route Visualizer Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-charcoal mb-2">
                <span>Malur Farm</span>
                <span className="text-emerald-700">Highway NH-75 Transit (68% completed)</span>
                <span>{sh.destination}</span>
              </div>
              <div className="w-full h-3 bg-surface-subtle rounded-full overflow-hidden border border-charcoal/10 p-0.5">
                <div
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                  style={{ width: sh.status === 'DELIVERED' ? '100%' : '68%' }}
                ></div>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div>
              <h4 className="text-xs font-black uppercase text-charcoal tracking-wider mb-3">
                SHIPMENT TIMELINE
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {sh.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      step.completed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-surface-subtle border-charcoal/10 text-charcoal-muted opacity-60'
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
