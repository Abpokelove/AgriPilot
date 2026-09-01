import React from 'react';
import { RefreshCw, Zap, Search, Bell, AlertTriangle } from 'lucide-react';
import { useAgriPilot } from '../../context/AgriPilotContext';

export const TopBar: React.FC = () => {
  const { isShocked, toggleMarketShock, selectedCrop, setSelectedCrop } = useAgriPilot();

  return (
    <header className="bg-surface border-b border-charcoal/10 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-subtle">
      {/* Greeting & Active Focus */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-extrabold text-charcoal tracking-tight">
            Good morning, Arjun
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Kolar Region
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mt-0.5">
          "Here's what matters for your harvest today."
        </p>
      </div>

      {/* Action Controls & Market Shock Simulation Button */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Crop Selector */}
        <div className="flex items-center space-x-2 bg-surface-subtle border border-charcoal/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-charcoal">
          <span className="text-charcoal-light font-normal">Crop:</span>
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-transparent font-bold text-charcoal focus:outline-none cursor-pointer"
          >
            <option value="Tomato">Tomato (800 kg)</option>
            <option value="Onion">Onion (500 kg)</option>
            <option value="Chilli">Chilli (250 kg)</option>
          </select>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold">MARKET LIVE</span>
          <span className="text-emerald-600 text-[11px]">• Updated 3m ago</span>
        </div>

        {/* ⚡ SIMULATE MARKET SHOCK BUTTON */}
        <button
          onClick={toggleMarketShock}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all transform active:scale-95 shadow-md ${
            isShocked
              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
          title="Click to trigger dynamic market arrival surge simulation"
        >
          {isShocked ? (
            <>
              <AlertTriangle className="w-4 h-4 animate-spin text-amber-200" />
              <span>RESET MARKET STATE</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>SIMULATE MARKET SHOCK</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
