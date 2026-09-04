import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { TrendingDown, BarChart2, Info } from 'lucide-react';

export const MarketChart: React.FC = () => {
  const { isShocked } = useAgriPilot();
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D'>('24H');

  // Baseline vs Shocked Chart Data demonstrating inverse price/arrival relationship
  const chartData24H = isShocked
    ? [
        { time: '04:00 AM', price: 28.5, arrivals: 750 },
        { time: '06:00 AM', price: 28.0, arrivals: 900 },
        { time: '08:00 AM', price: 27.5, arrivals: 1100 },
        { time: '10:00 AM', price: 27.0, arrivals: 1240 },
        { time: '10:15 AM ⚡', price: 21.0, arrivals: 2108 }, // Shock point!
        { time: '11:00 AM', price: 20.5, arrivals: 2300 },
      ]
    : [
        { time: '04:00 AM', price: 28.5, arrivals: 750 },
        { time: '06:00 AM', price: 28.0, arrivals: 900 },
        { time: '08:00 AM', price: 27.5, arrivals: 1100 },
        { time: '10:00 AM', price: 27.0, arrivals: 1240 },
        { time: '12:00 PM', price: 26.5, arrivals: 1310 },
        { time: '02:00 PM', price: 26.0, arrivals: 1380 },
      ];

  const chartData7D = [
    { time: 'Mon', price: 24.0, arrivals: 850 },
    { time: 'Tue', price: 25.5, arrivals: 790 },
    { time: 'Wed', price: 26.0, arrivals: 920 },
    { time: 'Thu', price: 27.5, arrivals: 1050 },
    { time: 'Fri', price: 28.0, arrivals: 800 },
    { time: 'Sat', price: 26.5, arrivals: 1150 },
    { time: 'Sun (Today)', price: isShocked ? 21.0 : 27.0, arrivals: isShocked ? 2108 : 1240 },
  ];

  const chartData30D = [
    { time: 'W1', price: 22.5, arrivals: 980 },
    { time: 'W2', price: 24.0, arrivals: 910 },
    { time: 'W3', price: 26.8, arrivals: 830 },
    { time: 'W4', price: isShocked ? 21.0 : 27.0, arrivals: isShocked ? 2108 : 1240 },
  ];

  const activeData = timeframe === '24H' ? chartData24H : timeframe === '7D' ? chartData7D : chartData30D;

  return (
    <div className="agri-card agri-field-lines bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-charcoal tracking-tight">
              MARKET PRESSURE & PRICE CORRELATION
            </h3>
            {isShocked && (
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded animate-pulse">
                SURGE DETECTED
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Inverse correlation: Rising arrivals increase supply pressure and depress spot price.
          </p>
        </div>

        {/* Time Horizon Filters */}
        <div className="flex items-center space-x-1 bg-surface-subtle p-1 rounded-lg border border-charcoal/10 text-xs font-semibold">
          {(['24H', '7D', '30D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#D1D5DB" />
            <YAxis
              yAxisId="left"
              domain={[15, 35]}
              orientation="left"
              tick={{ fontSize: 11, fill: '#0D5C46' }}
              stroke="#0D5C46"
              unit="₹"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 2500]}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              stroke="#9CA3AF"
              unit="t"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111815',
                borderColor: '#0D5C46',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              }}
              formatter={(value: any, name: any) => [
                name === 'price' ? `₹${value}/kg` : `${value} tonnes`,
                name === 'price' ? 'Spot Price' : 'Arrival Volume',
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => (value === 'price' ? 'Spot Price (₹/kg)' : 'Arrival Volume (Tonnes)')}
            />
            <Bar yAxisId="right" dataKey="arrivals" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke={isShocked ? '#DC2626' : '#0D5C46'}
              strokeWidth={3}
              dot={{ r: 4, fill: isShocked ? '#DC2626' : '#0D5C46', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Annotation Footer */}
      <div className="mt-4 p-3 bg-surface-subtle rounded-xl flex items-center space-x-3 text-xs text-charcoal-muted">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" />
        <p className="leading-snug">
          {isShocked ? (
            <span className="text-red-900 font-bold">
              Market A arrival volume spiked by +70% at 10:15 AM, driving price down by ₹6.00/kg. AgriPilot rerouted allocation instantly.
            </span>
          ) : (
            <span>
              Arrivals are holding stable near 1,240 tonnes. Price pressure remains high but predictable.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
