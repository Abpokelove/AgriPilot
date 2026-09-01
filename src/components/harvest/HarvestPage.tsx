import React, { useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { HarvestItem } from '../../data/harvest';
import { Sprout, Plus, Edit2, Trash2, Search, Calendar, Clock, Warehouse, CheckCircle2 } from 'lucide-react';

export const HarvestPage: React.FC = () => {
  const { harvestList, addHarvestItem, editHarvestItem, deleteHarvestItem } = useAgriPilot();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HarvestItem | null>(null);

  // Form local state
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid Grade A');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [harvestDate, setHarvestDate] = useState('Tomorrow');
  const [storageLimitDays, setStorageLimitDays] = useState<number>(3);
  const [status, setStatus] = useState<HarvestItem['status']>('READY');

  const filteredList = harvestList.filter((item) =>
    item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCropName('Tomato');
    setVariety('Hybrid Grade A');
    setQuantityKg(500);
    setHarvestDate('Tomorrow');
    setStorageLimitDays(3);
    setStatus('READY');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addHarvestItem({
      cropName,
      variety,
      quantityKg,
      harvestDate,
      storageLimitDays,
      status,
      estimatedValue: quantityKg * 25,
      fieldLocation: 'Plot 4 - Main Farm',
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (item: HarvestItem) => {
    setEditingItem(item);
    setCropName(item.cropName);
    setVariety(item.variety);
    setQuantityKg(item.quantityKg);
    setHarvestDate(item.harvestDate);
    setStorageLimitDays(item.storageLimitDays);
    setStatus(item.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      editHarvestItem(editingItem.id, {
        cropName,
        variety,
        quantityKg,
        harvestDate,
        storageLimitDays,
        status,
        estimatedValue: quantityKg * 25,
      });
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-black text-charcoal tracking-tight">MY HARVEST MANAGEMENT</h1>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Track produce growth schedules, harvest timing, and storage decay limits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-charcoal/10 bg-surface text-xs text-charcoal focus:outline-none focus:border-emerald-600"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCE</span>
          </button>
        </div>
      </div>

      {/* Harvest Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredList.map((item) => {
          const isReady = item.status === 'READY';
          return (
            <div
              key={item.id}
              className="bg-surface rounded-2xl border border-charcoal/10 p-6 shadow-card hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-1 rounded-full">
                    {item.cropName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isReady ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-charcoal">{item.quantityKg} kg</h3>
                <p className="text-xs text-charcoal-muted font-medium mt-0.5">{item.variety}</p>

                <div className="mt-4 space-y-2 text-xs border-t border-charcoal/5 pt-3">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Harvest Date</span>
                    </span>
                    <span className="font-bold text-charcoal">{item.harvestDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span className="flex items-center space-x-1.5">
                      <Warehouse className="w-3.5 h-3.5 text-amber-600" />
                      <span>Storage Decay Limit</span>
                    </span>
                    <span className="font-bold text-charcoal">{item.storageLimitDays} Days</span>
                  </div>

                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Field Location</span>
                    </span>
                    <span className="font-medium text-charcoal">{item.fieldLocation}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-charcoal/10 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg text-charcoal-muted hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  title="Edit produce record"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHarvestItem(item.id)}
                  className="p-2 rounded-lg text-charcoal-muted hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Delete produce record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAdd}
            className="bg-surface rounded-2xl border border-charcoal/15 max-w-md w-full p-6 shadow-floating space-y-4"
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h3 className="text-base font-extrabold text-charcoal">Add Harvest Produce</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-charcoal-muted hover:text-charcoal font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-charcoal block mb-1">Crop Name</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Variety / Grade</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal block mb-1">Storage Limit (Days)</label>
                  <input
                    type="number"
                    value={storageLimitDays}
                    onChange={(e) => setStorageLimitDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Harvest Timing</label>
                <input
                  type="text"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-charcoal/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-charcoal/20 text-xs font-bold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800"
              >
                Save Produce
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Produce Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-surface rounded-2xl border border-charcoal/15 max-w-md w-full p-6 shadow-floating space-y-4"
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h3 className="text-base font-extrabold text-charcoal">Edit Harvest Item</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-charcoal-muted hover:text-charcoal font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-charcoal block mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-charcoal/20 bg-surface font-semibold"
                >
                  <option value="READY">READY</option>
                  <option value="GROWING">GROWING</option>
                  <option value="HARVESTED">HARVESTED</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-charcoal/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg border border-charcoal/20 text-xs font-bold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800"
              >
                Update Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
