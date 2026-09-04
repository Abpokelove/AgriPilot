import React from 'react';
import { Zap, AlertTriangle, Sparkles, LogOut } from 'lucide-react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { AtmosphereControl } from '../ui/AtmosphereControl';

export const TopBar: React.FC = () => {
  const { isShocked, toggleMarketShock, selectedCrop, setSelectedCrop, currentUser, logout } = useAgriPilot();

  return (
    <header className="bg-white/84 backdrop-blur-xl border-b border-emerald-900/10 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-subtle">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-extrabold text-charcoal tracking-tight">
            Good morning, {currentUser?.fullName?.split(' ')?.[0] || 'Arjun'}
          </h2>
          <span className="live-pill text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            {currentUser?.location || 'Kolar Region'}
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mt-0.5">Here is what matters for your harvest today.</p>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-3 py-2 shadow-subtle">
          <div className="h-10 w-10 rounded-full judge-gradient text-white flex items-center justify-center font-black">
            {(currentUser?.avatarSeed || 'AP').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-charcoal truncate">{currentUser?.fullName || 'Arjun Patel'}</p>
            <p className="text-[10px] text-charcoal-muted truncate">{currentUser?.primaryCrop || 'Tomato'} farmer</p>
          </div>
          <button
            onClick={logout}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-charcoal/10 text-charcoal-muted transition hover:border-emerald-300 hover:text-emerald-800"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50/80 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-charcoal transition hover:border-emerald-400">
          <span className="text-charcoal-light font-normal">Crop:</span>
          <select
            value={selectedCrop}
            onChange={(event) => setSelectedCrop(event.target.value)}
            className="bg-transparent font-bold text-charcoal focus:outline-none cursor-pointer"
          >
            <option value="Tomato">Tomato (800 kg)</option>
            <option value="Onion">Onion (500 kg)</option>
            <option value="Chilli">Chilli (250 kg)</option>
          </select>
        </div>

        <div className="live-pill flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold">MARKET LIVE</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        </div>

        <button
          onClick={toggleMarketShock}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-md ${
            isShocked ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse' : 'judge-gradient text-white field-glow'
          }`}
          title="Trigger a dynamic market arrival surge simulation"
        >
          {isShocked ? (
            <>
              <AlertTriangle className="w-4 h-4 animate-spin text-amber-200" />
              <span>RESET MARKET STATE</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>SIMULATE MARKET SHOCK</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
