import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Sprout,
  GitMerge,
  MessageSquareCode,
  Store,
  Truck,
  Activity,
  Settings,
  Radar,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAgriPilot, NavTab } from '../../context/AgriPilotContext';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { activeTab, setActiveTab, isShocked, currentUser, logout } = useAgriPilot();

  const mainNav: NavItem[] = [
    { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'harvest', label: 'My Harvest', icon: Sprout },
    { id: 'decisions', label: 'Decisions', icon: GitMerge },
    { id: 'ask-agripilot', label: 'Ask AgriPilot', icon: MessageSquareCode, badge: 'AI' },
    { id: 'live-demo', label: 'Live Demo', icon: Radar, badge: 'SHOW' },
    { id: 'buyers', label: 'Buyers', icon: Store },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'activity', label: 'Activity & Signals', icon: Activity },
  ];

  return (
    <aside
      className={`w-64 bg-white/88 backdrop-blur-xl border-r border-emerald-900/10 flex flex-col justify-between shrink-0 select-none min-h-screen relative overflow-hidden shadow-[8px_0_30px_-28px_rgba(13,92,70,0.65)] ${className || ''}`}
    >
      <RestingLeaf position="top-right" className="top-2 right-4" />
      <RainDripBorder side="right" />
      <div className="p-5 border-b border-charcoal/5 leaf-panel">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg judge-gradient text-white flex items-center justify-center font-bold text-lg shadow-sm field-glow">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-charcoal tracking-tight leading-none">AGRI PILOT</h1>
              <p className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider mt-0.5">
                Decision Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="live-pill mt-4 inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          <span>SYSTEM LIVE</span>
          {isShocked && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold animate-pulse">
              SHOCK ACTIVE
            </span>
          )}
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-charcoal-light uppercase tracking-wider">
          Core Operations
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'judge-gradient text-white font-semibold shadow-md scale-[1.01]'
                  : 'text-charcoal-muted hover:bg-emerald-50 hover:text-emerald-900 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-charcoal-light'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-charcoal/5 space-y-3 bg-surface-subtle/40">
        <div className="flex items-center justify-between px-2 text-xs font-medium text-charcoal-muted">
          <button className="flex items-center space-x-2 hover:text-charcoal transition-colors">
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <span className="text-[10px] text-charcoal-light font-mono">v1.0-hackathon</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface border border-charcoal/5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full judge-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
            {(currentUser?.avatarSeed || 'AP').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-charcoal truncate">{currentUser?.fullName || 'Arjun Patel'}</p>
            <p className="text-[10px] text-charcoal-muted truncate">{currentUser?.location || 'Malur Farm • Karnataka'}</p>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
