import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  BookOpen,
  Search,
  Droplet,
  Calendar,
  Sparkles,
  Sprout,
  Filter,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';

export const CropDatabasePage: React.FC = () => {
  const { crops } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || c.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
            Agronomic Knowledge Base
          </span>
          <span className="text-xs text-slate-400">• {crops.length} Validated Crop Cultivars</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Crop Characteristics & Agronomic Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Biological parameters, water footprints, root penetration depths, and nitrogen balances utilized by the rotation AI engine.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or scientific name..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="cereal">Cereals</option>
            <option value="pulse">Pulses / Legumes</option>
            <option value="oilseed">Oilseeds</option>
            <option value="millet">Millets & Sorghum</option>
            <option value="horticulture">Horticulture</option>
          </select>
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const isNitrogenFixer = crop.nitrogen_effect === 'fixing';
          const isWaterIntense = crop.water_requirement === 'very_high' || crop.water_requirement === 'high';

          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{crop.name}</h3>
                    <p className="text-xs italic text-slate-400">{crop.scientific_name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {crop.category}
                  </span>
                </div>

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Water Footprint</span>
                    <span className={`font-bold capitalize ${isWaterIntense ? 'text-red-600' : 'text-sky-700'}`}>
                      {crop.water_requirement.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-bold text-slate-800">{crop.growing_period_days} Days</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Nitrogen Impact</span>
                    <span className={`font-bold capitalize ${isNitrogenFixer ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {crop.nitrogen_effect}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Root Depth</span>
                    <span className="font-bold text-slate-800 capitalize">{crop.root_depth}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="font-semibold text-slate-800">Soil Preference: </span>
                    <span>{crop.soil_requirements}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Climate Tolerance: </span>
                    <span>{crop.climate_tolerance}</span>
                  </div>
                </div>
              </div>

              {/* Profitability index footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Profitability Potential</span>
                <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {crop.market_value_index} / 100 Index
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
