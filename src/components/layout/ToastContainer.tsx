import React from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { Zap, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAgriPilot();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = 'bg-surface border-charcoal/15 text-charcoal';
          let Icon = Info;
          let iconColor = 'text-emerald-700';

          if (toast.type === 'shock') {
            bgClass = 'bg-amber-900/95 border-amber-500 text-amber-50 shadow-floating backdrop-blur-md';
            Icon = Zap;
            iconColor = 'text-amber-300';
          } else if (toast.type === 'success') {
            bgClass = 'bg-emerald-900/95 border-emerald-500 text-emerald-50 shadow-card';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-300';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-800/95 border-amber-400 text-amber-50 shadow-card';
            Icon = AlertTriangle;
            iconColor = 'text-amber-300';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl border flex items-start space-x-3 pointer-events-auto shadow-floating ${bgClass}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider">{toast.title}</h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
