import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Field, CropHistoryItem } from '../../types';
import {
  History,
  Calendar,
  Layers,
  Sprout,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Droplets,
  Leaf
} from 'lucide-react';

interface ExtendedCropHistory {
  id: number;
  crop: string;
  family: string;
  season: 'Kharif' | 'Rabi' | 'Summer / Zaid';
  year: number;
  water_used_mm: number;
  nitrogen_effect: 'depleting' | 'fixing' | 'neutral';
  nitrogen_change_kg: number;
  yield_kg_ha: number;
  root_depth: string;
  notes: string;
}

export const CropHistoryPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [newCrop, setNewCrop] = useState<string>('Chickpea');
  const [newSeason, setNewSeason] = useState<'Kharif' | 'Rabi' | 'Summer / Zaid'>('Rabi');
  const [newYear, setNewYear] = useState<number>(2026);
  const [newYield, setNewYield] = useState<number>(2400);

  // Field historical memory sequence
  const [historyList, setHistoryList] = useState<ExtendedCropHistory[]>([
    {
      id: 1,
      crop: 'Rice',
      family: 'Poaceae (Grass)',
      season: 'Kharif',
      year: 2024,
      water_used_mm: 1250,
      nitrogen_effect: 'depleting',
      nitrogen_change_kg: -85,
      yield_kg_ha: 4200,
      root_depth: 'Shallow (0-20 cm)',
      notes: 'Monsoon flooded paddy with heavy urea application.'
    },
    {
      id: 2,
      crop: 'Wheat',
      family: 'Poaceae (Grass)',
      season: 'Rabi',
      year: 2024,
      water_used_mm: 510,
      nitrogen_effect: 'depleting',
      nitrogen_change_kg: -60,
      yield_kg_ha: 3600,
      root_depth: 'Medium (20-60 cm)',
      notes: 'Continuous cereal cultivation. Weed seed bank of canary grass observed.'
    },
    {
      id: 3,
      crop: 'Rice',
      family: 'Poaceae (Grass)',
      season: 'Kharif',
      year: 2025,
      water_used_mm: 1300,
      nitrogen_effect: 'depleting',
      nitrogen_change_kg: -90,
      yield_kg_ha: 3950,
      root_depth: 'Shallow (0-20 cm)',
      notes: 'Yield dropped 6% despite 10% higher nitrogen fertilizer input.'
    },
    {
      id: 4,
      crop: 'Fallow / Uncropped',
      family: 'None',
      season: 'Summer / Zaid',
      year: 2025,
      water_used_mm: 40,
      nitrogen_effect: 'neutral',
      nitrogen_change_kg: 0,
      yield_kg_ha: 0,
      root_depth: 'None',
      notes: 'Topsoil left bare, high surface evaporative moisture loss.'
    }
  ]);

  useEffect(() => {
    async function loadFields() {
      const list = await apiService.getFields();
      setFields(list);
      if (list.length > 0) setSelectedFieldId(list[0].id);
    }
    loadFields();
  }, []);

  const handleAddSeason = (e: React.FormEvent) => {
    e.preventDefault();
    const isLegume = ['Pulses', 'Chickpea', 'Soybean', 'Groundnut', 'Lentils'].includes(newCrop);
    const item: ExtendedCropHistory = {
      id: Date.now(),
      crop: newCrop,
      family: isLegume ? 'Fabaceae (Legume)' : 'Poaceae (Grass)',
      season: newSeason,
      year: newYear,
      water_used_mm: isLegume ? 320 : 600,
      nitrogen_effect: isLegume ? 'fixing' : 'depleting',
      nitrogen_change_kg: isLegume ? +45 : -65,
      yield_kg_ha: Number(newYield),
      root_depth: isLegume ? 'Deep (60-120 cm)' : 'Medium (20-60 cm)',
      notes: 'Manually logged seasonal harvest record.'
    };
    setHistoryList([item, ...historyList]);
    setShowAddModal(false);
  };

  const currentField = fields.find(f => f.id === selectedFieldId) || fields[0];

  // Soil Memory Metrics
  const totalNitrogenDelta = historyList.reduce((acc, curr) => acc + curr.nitrogen_change_kg, 0);
  const consecutiveCerealSeasons = historyList.filter(h => h.family.includes('Poaceae')).length;
  const pestPressureRating = consecutiveCerealSeasons >= 3 ? 'High (Monoculture Stress)' : 'Moderate';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-700/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-3">
          <History className="w-3.5 h-3.5" />
          <span>Parcel History & Soil Memory (Sections 23 & 24)</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
          Seasonal Crop History & Soil Memory
        </h1>
        <p className="mt-2 text-slate-300 text-sm max-w-3xl leading-relaxed">
          What was planted in previous seasons determines current soil fertility, microbial health, and disease carrier loads. Field Shift analyzes your field's historical sequence to recommend high-impact rotational shifts.
        </p>
      </div>

      {/* Field Selector & Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase">Field Parcel:</label>
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.area} ac • Current: {f.current_crop})</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Past Season Crop</span>
        </button>
      </div>

      {/* Section 24: Parcel Soil Memory Dashboard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Parcel Soil Memory & Accumulated Deficit</span>
          </h2>
          <span className="text-xs text-slate-500">Based on past 4 recorded seasons</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Cumulative Nitrogen Balance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Cumulative Nitrogen Balance</span>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-2xl font-extrabold ${totalNitrogenDelta < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {totalNitrogenDelta} kg/ha
              </span>
              {totalNitrogenDelta < 0 && <TrendingDown className="w-5 h-5 text-red-600" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Repeated cereal harvests have extracted extensive nitrogen without replenishment, creating severe soil fatigue.
            </p>
          </div>

          {/* Weed & Pest Host Pressure */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Weed & Pathogen Host Pressure</span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-extrabold text-amber-600">{pestPressureRating}</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              {consecutiveCerealSeasons} consecutive Poaceae grass seasons have concentrated stem borer and fungal inoculum.
            </p>
          </div>

          {/* Root Stratification Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Root Zone Stratification</span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-800">Compacted (18cm Hardpan)</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Repeated shallow tillage has formed a hard plough-pan. Deep-taproot pulse crops are strongly advised.
            </p>
          </div>
        </div>
      </div>

      {/* Section 23: Seasonal Rotation Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          <span>Seasonal Crop Succession Timeline (2024 - 2026)</span>
        </h2>

        <div className="relative border-l-2 border-emerald-500/40 ml-4 pl-6 space-y-6 pt-2">
          {historyList.map((item, idx) => {
            const isLegume = item.nitrogen_effect === 'fixing';

            return (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className={`absolute -left-10 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isLegume ? 'bg-emerald-100 border-emerald-600 text-emerald-800' : 'bg-amber-100 border-amber-600 text-amber-800'
                }`}>
                  {isLegume ? <Leaf className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/80 transition p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mr-2">
                        {item.season} {item.year}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 inline">
                        {item.crop}
                      </h3>
                      <span className="text-xs text-slate-600 ml-2">({item.family})</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      isLegume
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {item.nitrogen_change_kg > 0 ? `+${item.nitrogen_change_kg} kg/ha N` : `${item.nitrogen_change_kg} kg/ha N`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-600 block">Water Consumed:</span>
                      <span className="font-bold text-blue-700">{item.water_used_mm} mm</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Yield Harvested:</span>
                      <span className="font-bold text-slate-800">{item.yield_kg_ha ? `${item.yield_kg_ha} kg/ha` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Root Exploitation:</span>
                      <span className="font-bold text-slate-800">{item.root_depth}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Nitrogen Impact:</span>
                      <span className={`font-bold capitalize ${isLegume ? 'text-emerald-700' : 'text-red-700'}`}>
                        {item.nitrogen_effect}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    Note: {item.notes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Season Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Log Past Seasonal Crop</h3>
            <p className="text-xs text-slate-500">Record prior plantings to update your field's soil nutrient memory.</p>

            <form onSubmit={handleAddSeason} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Crop Name</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Rice">Rice (Cereal - Poaceae)</option>
                  <option value="Wheat">Wheat (Cereal - Poaceae)</option>
                  <option value="Maize">Maize (Cereal - Poaceae)</option>
                  <option value="Pulses">Pulses / Lentils (Fabaceae)</option>
                  <option value="Chickpea">Chickpea (Legume - Fabaceae)</option>
                  <option value="Soybean">Soybean (Legume - Fabaceae)</option>
                  <option value="Groundnut">Groundnut (Legume - Fabaceae)</option>
                  <option value="Millets">Millets (Drought Cereal)</option>
                  <option value="Mustard">Mustard (Oilseed - Brassicaceae)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Season</label>
                  <select
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Summer / Zaid">Summer / Zaid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Yield (kg/ha)</label>
                <input
                  type="number"
                  value={newYield}
                  onChange={(e) => setNewYield(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
