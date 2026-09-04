import React, { useState, useEffect, useRef } from 'react';
import { Leaf, CloudRain, Sparkles, Pause, ChevronDown, Check } from 'lucide-react';
import { AtmosphereMode, AtmosphereDensity, getStoredAtmosphereMode, getStoredAtmosphereDensity } from './NatureAtmosphere';

interface AtmosphereControlProps {
  onModeChange?: (mode: AtmosphereMode) => void;
  onDensityChange?: (density: AtmosphereDensity) => void;
  compact?: boolean;
}

export const AtmosphereControl: React.FC<AtmosphereControlProps> = ({
  onModeChange,
  onDensityChange,
  compact = false,
}) => {
  const [mode, setMode] = useState<AtmosphereMode>(getStoredAtmosphereMode);
  const [density, setDensity] = useState<AtmosphereDensity>(getStoredAtmosphereDensity);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMode = (newMode: AtmosphereMode) => {
    setMode(newMode);
    localStorage.setItem('agripilot.atmosphere.mode', newMode);
    window.dispatchEvent(new CustomEvent('agripilot:atmosphere:change', { detail: { mode: newMode, density } }));
    if (onModeChange) onModeChange(newMode);
  };

  const handleSelectDensity = (newDensity: AtmosphereDensity) => {
    setDensity(newDensity);
    localStorage.setItem('agripilot.atmosphere.density', newDensity);
    window.dispatchEvent(new CustomEvent('agripilot:atmosphere:change', { detail: { mode, density: newDensity } }));
    if (onDensityChange) onDensityChange(newDensity);
  };

  const getModeIcon = (m: AtmosphereMode) => {
    switch (m) {
      case 'rain-leaves':
        return <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />;
      case 'leaves':
        return <Leaf className="w-4 h-4 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-sky-500" />;
      case 'off':
        return <Pause className="w-4 h-4 text-slate-400" />;
    }
  };

  const getModeLabel = (m: AtmosphereMode) => {
    switch (m) {
      case 'rain-leaves':
        return 'Rain & Leaves';
      case 'leaves':
        return 'Golden Leaves';
      case 'rain':
        return 'Gentle Drizzle';
      case 'off':
        return 'Static View';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/85 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm transition-all hover:border-emerald-400 hover:bg-white hover:shadow ${
          compact ? 'px-2.5 py-1' : ''
        }`}
        title="Adjust Weather Atmosphere"
      >
        <span className="flex items-center gap-1.5">
          {getModeIcon(mode)}
          {!compact && <span>{getModeLabel(mode)}</span>}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-emerald-100 bg-white/95 backdrop-blur-xl p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 border-b border-slate-100 mb-1">
            Nature Atmosphere
          </div>

          <div className="space-y-0.5">
            {(['rain-leaves', 'leaves', 'rain', 'off'] as AtmosphereMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleSelectMode(m)}
                className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors ${
                  mode === m ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getModeIcon(m)}
                  <span>{getModeLabel(m)}</span>
                </div>
                {mode === m && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            ))}
          </div>

          {mode !== 'off' && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Atmosphere Density
              </div>
              <div className="grid grid-cols-3 gap-1 px-1">
                {(['low', 'medium', 'high'] as AtmosphereDensity[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSelectDensity(d)}
                    className={`rounded-lg py-1 text-[11px] font-medium capitalize transition-all ${
                      density === d
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
