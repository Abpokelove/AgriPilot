import React, { useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { TrendingUp, TrendingDown, Search, Filter, MapPin, Building2, Clock, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MarketsPage: React.FC = () => {
  const { markets, selectedCrop, setSelectedCrop } = useAgriPilot();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(markets[0].id);

  const filteredMarkets = markets.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];

  return (
    <div className="space-y-6">
      {/* Terminal Title & Controls */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">
              MARKET INTELLIGENCE TERMINAL
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Real-time APMC Mandi feeds, spot prices, arrival volumes, and supply pressure dynamics.
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Crop Filter */}
          <div className="flex items-center space-x-1 bg-surface-subtle p-1 rounded-xl border border-charcoal/10 text-xs font-semibold">
            {['Tomato', 'Onion', 'Chilli', 'Potato'].map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCrop === crop
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mandi / yard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl border border-charcoal/10 bg-surface text-xs text-charcoal focus:outline-none focus:border-emerald-600 w-48"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Markets List + Detailed Mandi Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mandi Cards List (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredMarkets.map((m) => {
            const isSelected = m.id === selectedMarketId;
            const isPos = m.priceChangePct >= 0;
            const isCritical = m.supplyPressure === 'CRITICAL';

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMarketId(m.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-surface border-emerald-600 ring-2 ring-emerald-600/20 shadow-card'
                    : 'bg-surface border-charcoal/10 hover:border-emerald-500/40 shadow-subtle'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-charcoal">{m.name}</h3>
                      <span className="text-xs text-charcoal-muted font-mono flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{m.distanceKm} km away</span>
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-0.5">{m.location}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-charcoal">₹{m.pricePerKg.toFixed(1)}/kg</div>
                    <span
                      className={`text-xs font-bold inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full mt-0.5 ${
                        isPos ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isPos ? `+${m.priceChangePct}%` : `${m.priceChangePct}%`}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal/5 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-semibold block uppercase">Arrival Volume</span>
                    <span className="font-extrabold text-charcoal">{m.arrivalsTonnes.toLocaleString()} tonnes</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-semibold block uppercase">Supply Pressure</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.2 rounded uppercase inline-block mt-0.5 ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : m.supplyPressure === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {m.supplyPressure}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-charcoal-muted font-semibold block uppercase">Est Transport</span>
                    <span className="font-extrabold text-emerald-800">₹{m.transportCostPerKg}/kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Market Deep Analytics (5 columns) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
              MANDI DETAIL ANALYTICS
            </span>
            <h3 className="text-lg font-black text-charcoal">{selectedMarket.name}</h3>
            <p className="text-xs text-charcoal-muted">{selectedMarket.location}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-subtle border border-charcoal/5">
              <span className="text-[10px] text-charcoal-muted font-medium block">Current Spot Price</span>
              <span className="text-lg font-black text-emerald-800">₹{selectedMarket.pricePerKg}/kg</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle border border-charcoal/5">
              <span className="text-[10px] text-charcoal-muted font-medium block">Today's Total Arrivals</span>
              <span className="text-lg font-black text-charcoal">{selectedMarket.arrivalsTonnes} t</span>
            </div>
          </div>

          {/* Intra-day Price Trend Chart */}
          <div>
            <h4 className="text-xs font-extrabold text-charcoal uppercase tracking-wider mb-2">
              Intraday Price Movement
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedMarket.historicalPressure}>
                  <defs>
                    <linearGradient id="mandiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D5C46" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0D5C46" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: any) => [`₹${value}/kg`, 'Price']} />
                  <Area type="monotone" dataKey="price" stroke="#0D5C46" strokeWidth={2} fillOpacity={1} fill="url(#mandiGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendation Note */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold block">AgriPilot Yard Advisory:</span>
            <p className="leading-snug text-emerald-900">
              Arrivals peak between 08:00 AM and 10:30 AM. Truck queue time is currently 22 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
