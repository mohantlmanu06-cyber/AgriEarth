import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FarmerPriorities } from '../../types';
import {
  Sparkles,
  Sliders,
  Sprout,
  Droplet,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const RotationPlannerPage: React.FC = () => {
  const { selectedField, fields, setSelectedField } = useFarm();
  const navigate = useNavigate();

  const [currentCrop, setCurrentCrop] = useState<string>(selectedField?.current_crop || 'Rice');
  const [durationYears, setDurationYears] = useState<number>(3);
  const [candidateCrops, setCandidateCrops] = useState<string[]>([
    'Pulses',
    'Maize',
    'Wheat',
    'Groundnut',
    'Soybean',
    'Millets',
  ]);

  const [priorities, setPriorities] = useState<FarmerPriorities>({
    soil_health: 80,
    water_conservation: 75,
    climate_resilience: 85,
    economic_potential: 70,
    erosion_reduction: 65,
    risk_reduction: 70,
    market_suitability: 75,
    profitability: 70,
    low_risk: 70,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const allAvailableCrops = [
    { name: 'Pulses', category: 'Pulse / Legume', benefit: 'Fixes atmospheric nitrogen', icon: 'Leaf' },
    { name: 'Maize', category: 'Cereal', benefit: 'High cash yield & organic stover', icon: 'Sprout' },
    { name: 'Wheat', category: 'Cereal', benefit: 'Winter staple, predictable buyer buybacks', icon: 'Wheat' },
    { name: 'Groundnut', category: 'Oilseed / Legume', benefit: 'Breaks subsoil compaction', icon: 'Nut' },
    { name: 'Soybean', category: 'Oilseed / Legume', benefit: 'Restores nitrogen with high market value', icon: 'Bean' },
    { name: 'Millets', category: 'Millet', benefit: 'Ultra-drought hardy (uses 50% less water)', icon: 'Sun' },
    { name: 'Sorghum', category: 'Millet / Cereal', benefit: 'High thermal heat tolerance', icon: 'Sun' },
    { name: 'Mustard', category: 'Oilseed', benefit: 'Deep-root nutrient scavenger', icon: 'Flower' },
    { name: 'Cotton', category: 'Fiber / Cash', benefit: 'High gross revenue potential', icon: 'Flower2' },
    { name: 'Vegetables', category: 'Horticulture', benefit: 'Rapid cash turnover (75 days)', icon: 'Carrot' },
  ];

  const toggleCandidate = (cropName: string) => {
    if (candidateCrops.includes(cropName)) {
      if (candidateCrops.length > 2) {
        setCandidateCrops(candidateCrops.filter(c => c !== cropName));
      }
    } else {
      setCandidateCrops([...candidateCrops, cropName]);
    }
  };

  // Section 14: Farmer Priority Presets
  const applyPreset = (preset: 'profit' | 'water' | 'soil' | 'resilience' | 'balanced') => {
    switch (preset) {
      case 'profit':
        setPriorities({
          soil_health: 50,
          water_conservation: 55,
          climate_resilience: 60,
          economic_potential: 95,
          erosion_reduction: 50,
          risk_reduction: 55,
          market_suitability: 95,
          profitability: 95,
          low_risk: 55
        });
        break;
      case 'water':
        setPriorities({
          soil_health: 70,
          water_conservation: 95,
          climate_resilience: 85,
          economic_potential: 65,
          erosion_reduction: 75,
          risk_reduction: 80,
          market_suitability: 70,
          profitability: 65,
          low_risk: 80
        });
        break;
      case 'soil':
        setPriorities({
          soil_health: 95,
          water_conservation: 75,
          climate_resilience: 80,
          economic_potential: 60,
          erosion_reduction: 90,
          risk_reduction: 75,
          market_suitability: 65,
          profitability: 60,
          low_risk: 75
        });
        break;
      case 'resilience':
        setPriorities({
          soil_health: 85,
          water_conservation: 85,
          climate_resilience: 95,
          economic_potential: 60,
          erosion_reduction: 80,
          risk_reduction: 90,
          market_suitability: 70,
          profitability: 60,
          low_risk: 90
        });
        break;
      default:
        setPriorities({
          soil_health: 80,
          water_conservation: 75,
          climate_resilience: 85,
          economic_potential: 70,
          erosion_reduction: 65,
          risk_reduction: 70,
          market_suitability: 75,
          profitability: 70,
          low_risk: 70
        });
        break;
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await apiService.analyzeRotation({
        field_id: selectedField?.id,
        current_crop: currentCrop,
        candidate_crops: candidateCrops,
        duration_years: durationYears,
        priorities: priorities,
      });
      // Store in sessionStorage for Recommendations & Comparison views
      sessionStorage.setItem('fieldshift_last_recommendations', JSON.stringify(res.recommendations));
      sessionStorage.setItem('fieldshift_last_context', JSON.stringify(res.environmental_context));
      navigate('/recommendations');
    } catch (e) {
      console.error("Rotation error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Core Decision Support
            </span>
            <span className="text-xs text-slate-400">• Active Field: {selectedField?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Crop Rotation Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Combine NASA satellite observations, soil constraints, and your personalized farming priorities.
          </p>
        </div>

        {/* Field Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Target Field:</span>
          <select
            value={selectedField?.id || ''}
            onChange={(e) => {
              const f = fields.find(item => item.id === Number(e.target.value));
              if (f) {
                setSelectedField(f);
                setCurrentCrop(f.current_crop);
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.area} ac)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (Duration, Crops, Baseline) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Baseline & Duration */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>1. Baseline Crop & Rotation Duration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Standing Crop</label>
                <select
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Rice">Rice (Heavy water consumer)</option>
                  <option value="Maize">Maize (Heavy nitrogen consumer)</option>
                  <option value="Wheat">Wheat (Cool season cereal)</option>
                  <option value="Cotton">Cotton (Long duration cash crop)</option>
                  <option value="Pulses">Pulses / Legumes (Nitrogen fixer)</option>
                  <option value="Soybean">Soybean (Oilseed legume)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rotation Duration</label>
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[2, 3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setDurationYears(yr)}
                      className={`py-2 rounded-xl font-bold text-xs transition ${
                        durationYears === yr
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {yr} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Candidate Crops Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>2. Select Candidate Crops ({candidateCrops.length} Selected)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click to include/exclude</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allAvailableCrops.map((c) => {
                const isSelected = candidateCrops.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleCandidate(c.name)}
                    className={`p-3 rounded-2xl text-left border transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-700'}`}>
                          {c.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                          {c.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{c.benefit}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Farmer Priority Sliders & Presets (Section 15 & 23) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>3. Farmer Priority Weighting</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize sliders to dictate how our AI ranks trade-offs.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                1-Click Personalization Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('profit')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
                >
                  💰 Profit Maximizer
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('water')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 transition"
                >
                  💧 Water Saver
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('soil')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  🌱 Soil Recovery
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('balanced')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  ⚖️ Balanced
                </button>
              </div>
            </div>

            {/* The 7 Official Priority Sliders (Section 14) */}
            <div className="space-y-4 pt-2">
              
              {/* Slider 1: Soil Health */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    🌱 Soil Health
                  </span>
                  <span className="font-bold text-emerald-600">{priorities.soil_health}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.soil_health}
                  onChange={(e) => setPriorities({ ...priorities, soil_health: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Slider 2: Water Conservation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    💧 Water Conservation
                  </span>
                  <span className="font-bold text-sky-600">{priorities.water_conservation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.water_conservation}
                  onChange={(e) => setPriorities({ ...priorities, water_conservation: Number(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Slider 3: Climate Resilience */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    🌡️ Climate Resilience
                  </span>
                  <span className="font-bold text-teal-600">{priorities.climate_resilience}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.climate_resilience}
                  onChange={(e) => setPriorities({ ...priorities, climate_resilience: Number(e.target.value) })}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Slider 4: Economic Potential */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    💰 Economic Potential
                  </span>
                  <span className="font-bold text-amber-600">{priorities.economic_potential}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.economic_potential}
                  onChange={(e) => setPriorities({ ...priorities, economic_potential: Number(e.target.value), profitability: Number(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Slider 5: Erosion Reduction */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    🛡️ Erosion Reduction
                  </span>
                  <span className="font-bold text-indigo-600">{priorities.erosion_reduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.erosion_reduction}
                  onChange={(e) => setPriorities({ ...priorities, erosion_reduction: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Slider 6: Risk Reduction */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    ⚖️ Risk Reduction
                  </span>
                  <span className="font-bold text-slate-700">{priorities.risk_reduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.risk_reduction}
                  onChange={(e) => setPriorities({ ...priorities, risk_reduction: Number(e.target.value), low_risk: Number(e.target.value) })}
                  className="w-full accent-slate-700 cursor-pointer"
                />
              </div>

              {/* Slider 7: Market Suitability */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    🏪 Market Suitability
                  </span>
                  <span className="font-bold text-purple-600">{priorities.market_suitability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.market_suitability}
                  onChange={(e) => setPriorities({ ...priorities, market_suitability: Number(e.target.value) })}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 transition flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{loading ? 'Evaluating Agronomic Permutations...' : 'Generate AI Rotation Strategies'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
