import React, { useMemo, useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { TrendingUp, TrendingDown, Search, MapPin, Building2, ChevronDown, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';

export const MarketsPage: React.FC = () => {
  const { markets, selectedCrop, setSelectedCrop, recommendation } = useAgriPilot();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(markets[0].id);
  const [showMore, setShowMore] = useState(false);

  const filteredMarkets = useMemo(
    () =>
      markets.filter(
        (market) =>
          market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          market.location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [markets, searchTerm]
  );

  const selectedMarket = filteredMarkets.find((market) => market.id === selectedMarketId) || filteredMarkets[0] || markets[0];
  const recommendedMarketId = recommendation.allocations[0]?.destinationId;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-surface p-6 shadow-subtle group">
        <RestingLeaf position="top-right" />
        <RainDripBorder side="both" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-700" />
              <h1 className="text-2xl font-black tracking-tight text-charcoal">Where should I sell?</h1>
            </div>
            <p className="max-w-2xl text-sm text-charcoal-muted">
              AgriPilot ranks markets by crowding, demand, transport, and your storage limit, not just by raw price.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-2xl border border-charcoal/10 bg-surface-subtle p-1 text-xs font-semibold">
              {['Tomato', 'Onion', 'Chilli', 'Potato'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`rounded-xl px-3 py-2 transition ${
                    selectedCrop === crop ? 'bg-emerald-700 text-white shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
              <input
                type="text"
                placeholder="Search market"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-52 rounded-2xl border border-charcoal/10 bg-white px-9 py-2.5 text-sm text-charcoal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          {filteredMarkets.map((market, index) => {
            const isSelected = market.id === selectedMarketId;
            const isRecommended = market.id === recommendedMarketId;
            const isCrowded = market.supplyPressure === 'CRITICAL' || market.supplyPressure === 'HIGH';
            const isUp = market.priceChangePct >= 0;
            const agriStyle = ['agri-card agri-leaf-side', 'agri-card agri-flower-corner', 'agri-card agri-field-lines agri-seed-drift'][index % 3];

            return (
              <button
                key={market.id}
                onClick={() => setSelectedMarketId(market.id)}
                className={`${agriStyle} w-full rounded-3xl border p-5 text-left transition ${
                  isSelected
                    ? 'border-emerald-400 bg-white shadow-card'
                    : 'border-charcoal/10 bg-surface hover:border-emerald-300 hover:shadow-subtle'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-charcoal">{market.name}</h3>
                      {isRecommended && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">
                          Best option
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-muted">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      {market.location} • {market.distanceKm} km away
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-black tracking-tight text-charcoal">₹{market.pricePerKg.toFixed(1)}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {isUp ? `+${market.priceChangePct}%` : `${market.priceChangePct}%`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isCrowded ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCrowded ? 'Very crowded' : 'Good demand'}
                  </span>
                  <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-charcoal-muted">
                    {market.arrivalsTonnes.toLocaleString()} tonnes arriving
                  </span>
                  <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-charcoal-muted">
                    Transport ₹{market.transportCostPerKg}/kg
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="agri-card agri-leaf-side rounded-3xl border border-charcoal/10 bg-surface p-5 shadow-card">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal-muted">Selected market</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-charcoal">{selectedMarket.name}</h3>
            <p className="mt-1 text-sm text-charcoal-muted">{selectedMarket.location}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">Price</p>
                <p className="mt-1 text-2xl font-black text-emerald-900">₹{selectedMarket.pricePerKg.toFixed(1)}/kg</p>
              </div>
              <div className="rounded-2xl bg-surface-subtle p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-charcoal-muted">Crowding</p>
                <p className="mt-1 text-2xl font-black text-charcoal">
                  {selectedMarket.supplyPressure === 'CRITICAL' || selectedMarket.supplyPressure === 'HIGH' ? 'Crowded' : 'Calm'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-xs font-bold text-charcoal transition hover:border-emerald-300 hover:text-emerald-800"
            >
              <HelpCircle className="h-4 w-4" />
              {showMore ? 'Hide details' : 'Why this market?'}
            </button>

            {showMore && (
              <div className="mt-4 rounded-2xl border border-charcoal/10 bg-surface-subtle/70 p-4 text-sm">
                <p className="font-bold text-charcoal">Why it looks crowded</p>
                <p className="mt-1 text-charcoal-muted">
                  Today&apos;s arrivals are high, so price pressure is stronger here than at quieter options.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-charcoal-muted">
                  <span className="rounded-full bg-white px-3 py-1">Arrivals: {selectedMarket.arrivalsTonnes.toLocaleString()} t</span>
                  <span className="rounded-full bg-white px-3 py-1">Transport: ₹{selectedMarket.transportCostPerKg}/kg</span>
                  <span className="rounded-full bg-white px-3 py-1">Distance: {selectedMarket.distanceKm} km</span>
                </div>
              </div>
            )}
          </div>

          <details className="agri-card agri-field-lines rounded-3xl border border-charcoal/10 bg-surface p-5 shadow-subtle">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-charcoal-muted">More details</p>
                <p className="mt-1 text-sm font-bold text-charcoal">Open the deeper analysis</p>
              </div>
              <ChevronDown className="h-5 w-5 text-charcoal-light" />
            </summary>

            <div className="mt-5">
              <div className="h-64 w-full overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedMarket.historicalPressure}>
                    <defs>
                      <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D5C46" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0D5C46" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: any) => [`₹${value}/kg`, 'Price']} />
                    <Area type="monotone" dataKey="price" stroke="#0D5C46" strokeWidth={2} fill="url(#marketGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs">
                <div className="rounded-2xl bg-surface-subtle p-3">
                  <p className="font-bold text-charcoal">Arrivals</p>
                  <p className="text-charcoal-muted">{selectedMarket.arrivalsTonnes.toLocaleString()} tonnes</p>
                </div>
                <div className="rounded-2xl bg-surface-subtle p-3">
                  <p className="font-bold text-charcoal">Transport</p>
                  <p className="text-charcoal-muted">₹{selectedMarket.transportCostPerKg}/kg</p>
                </div>
                <div className="rounded-2xl bg-surface-subtle p-3">
                  <p className="font-bold text-charcoal">Pressure</p>
                  <p className="text-charcoal-muted">{selectedMarket.supplyPressure}</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
