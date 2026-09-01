import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Sprout, Clock, ShieldAlert, IndianRupee, Calendar } from 'lucide-react';

export const FarmerContextBar: React.FC = () => {
  const { farmer } = useAgriPilot();

  return (
    <div className="bg-surface rounded-2xl border border-charcoal/10 p-4 shadow-subtle flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">
            YOUR HARVEST CONTEXT
          </span>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-extrabold text-charcoal">{farmer.activeCrop}</h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {farmer.quantityKg} kg
            </span>
          </div>
        </div>
      </div>

      {/* Constraints Grid */}
      <div className="flex flex-wrap items-center gap-6 text-xs border-t md:border-t-0 md:border-l border-charcoal/10 pt-3 md:pt-0 md:pl-6">
        <div>
          <span className="text-[10px] text-charcoal-muted font-medium flex items-center space-x-1">
            <Clock className="w-3 h-3 text-emerald-700" />
            <span>Harvest Date</span>
          </span>
          <span className="font-bold text-charcoal block">{farmer.harvestTiming}</span>
        </div>

        <div>
          <span className="text-[10px] text-charcoal-muted font-medium flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            <span>Storage Limit</span>
          </span>
          <span className="font-bold text-charcoal block">{farmer.storageCapacityDays} Days</span>
        </div>

        <div>
          <span className="text-[10px] text-charcoal-muted font-medium flex items-center space-x-1">
            <IndianRupee className="w-3 h-3 text-emerald-700" />
            <span>Cash Requirement</span>
          </span>
          <span className="font-bold text-charcoal block">₹{farmer.cashRequirement.toLocaleString('en-IN')}</span>
        </div>

        <div>
          <span className="text-[10px] text-charcoal-muted font-medium flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-emerald-700" />
            <span>Cash Deadline</span>
          </span>
          <span className="font-bold text-charcoal block">{farmer.cashDeadline}</span>
        </div>
      </div>
    </div>
  );
};
