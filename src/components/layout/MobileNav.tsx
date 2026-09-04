import React from 'react';
import { Home, TrendingUp, Sprout, Truck, MessageSquareCode } from 'lucide-react';
import { useAgriPilot, NavTab } from '../../context/AgriPilotContext';

interface MobileNavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
}

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAgriPilot();

  const items: MobileNavItem[] = [
    { id: 'mission-control', label: 'Home', icon: Home },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'harvest', label: 'Harvest', icon: Sprout },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'ask-agripilot', label: 'Ask AI', icon: MessageSquareCode },
  ];

  return (
    <nav className="md:hidden fixed inset-x-3 bottom-3 z-40 rounded-[1.6rem] border border-emerald-900/10 bg-white/92 backdrop-blur-xl shadow-floating px-2 py-2">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10px] font-semibold transition ${
                isActive ? 'judge-gradient text-white shadow-md' : 'text-charcoal-muted hover:text-emerald-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
