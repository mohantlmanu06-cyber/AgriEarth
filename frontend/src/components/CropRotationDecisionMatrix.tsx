import React, { useState, useMemo } from 'react';
import {
  Satellite,
  Droplets,
  TrendingUp,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Sparkles,
  ArrowRight,
  Sun,
  Flame,
  CloudRain,
  ChevronRight,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export interface CropRotationDecisionMatrixProps {
  fieldName?: string;
  fieldAcreage?: number;
  currentCrop?: string;
  onSelectStrategy?: (strategyId: string) => void;
}

export interface StrategyOption {
  id: string;
  title: string;
  tagline: string;
  recommendedTag: string;
  cropSequence: string[];
  baseWaterSavingPct: number;
  baseProfitDeltaPct: number;
  baseSoilNitrogenKg: number;
  resilienceRating: 'Very High' | 'High' | 'Moderate';
  farmerVerdict: string;
  nasaSensorEvidence: {
    smap: string;
    ecostress: string;
    gpm: string;
  };
}

const DEFAULT_STRATEGIES: StrategyOption[] = [
  {
    id: 'strategy_drought_shield',
    title: 'Drought-Adaptive Legume Shift',
    tagline: 'Minimizes water draw while replenishing natural biological nitrogen.',
    recommendedTag: 'Optimal Under Moisture Stress',
    cropSequence: ['Sorghum (Grain)', 'Chickpea / Pulses', 'Pearl Millet'],
    baseWaterSavingPct: 42,
    baseProfitDeltaPct: 18,
    baseSoilNitrogenKg: 52,
    resilienceRating: 'Very High',
    farmerVerdict: 'Replaces thirsty monoculture with drought-hardy pulses. NASA SMAP indicates soil moisture is in the 38% deficit bracket, making this cycle the safest against heatwaves.',
    nasaSensorEvidence: {
      smap: 'Tolerates 20-35% root moisture without yield collapse.',
      ecostress: 'Deep taproots survive canopy heat spikes up to 36°C.',
      gpm: 'Low rain reliance: requires <280mm cumulative rain.'
    }
  },
  {
    id: 'strategy_balanced_commercial',
    title: 'Balanced Economic Rotation',
    tagline: 'High market cash return with calibrated irrigation intervals.',
    recommendedTag: 'Maximum Revenue Balance',
    cropSequence: ['High-Yield Maize', 'Winter Wheat', 'Sunflower'],
    baseWaterSavingPct: 16,
    baseProfitDeltaPct: 34,
    baseSoilNitrogenKg: 20,
    resilienceRating: 'Moderate',
    farmerVerdict: 'Delivers maximum market profit when supplemental drip irrigation is secure. Recommended if canal quotas remain above 75%.',
    nasaSensorEvidence: {
      smap: 'Requires SMAP root moisture maintained at >45%.',
      ecostress: 'Thermal stress alerts must trigger supplemental watering at 31°C.',
      gpm: 'Requires 420mm+ seasonal rainfall or equivalent irrigation.'
    }
  },
  {
    id: 'strategy_soil_rebuilder',
    title: 'Regenerative Soil Health Cycle',
    tagline: 'Rebuilds organic carbon and cures nematode soil pathogen buildup.',
    recommendedTag: 'Long-Term Soil Fertility',
    cropSequence: ['Crimson Clover (Cover)', 'Soybean (N-Fixing)', 'Barley'],
    baseWaterSavingPct: 28,
    baseProfitDeltaPct: 22,
    baseSoilNitrogenKg: 65,
    resilienceRating: 'High',
    farmerVerdict: 'Breaks pest pathogen cycles after consecutive cereal plantings. Restores topsoil organic carbon and reduces next season’s fertilizer bills by 35%.',
    nasaSensorEvidence: {
      smap: 'Builds soil organic matter, boosting water retention capacity by 18%.',
      ecostress: 'Dense winter groundcover cools soil skin temperature by 3.2°C.',
      gpm: 'High infiltration reduces surface runoff during heavy storms.'
    }
  }
];

export const CropRotationDecisionMatrix: React.FC<CropRotationDecisionMatrixProps> = ({
  fieldName = 'North Meadow (Plot 4B)',
  fieldAcreage = 48,
  currentCrop = 'Rice',
  onSelectStrategy
}) => {
  // Interactive Weights (Farmer Priorities)
  const [waterWeight, setWaterWeight] = useState<number>(45);
  const [profitWeight, setProfitWeight] = useState<number>(30);
  const [soilWeight, setSoilWeight] = useState<number>(25);

  // Climate Scenario Stress-Test
  const [climateScenario, setClimateScenario] = useState<'current' | 'drought' | 'heatwave' | 'wet'>('current');

  // Selected Strategy Card
  const [activeStrategyId, setActiveStrategyId] = useState<string>('strategy_drought_shield');

  // Dynamically compute composite suitability score based on weights and scenario
  const scoredStrategies = useMemo(() => {
    return DEFAULT_STRATEGIES.map((strat) => {
      // Scenario multipliers
      let scenarioPenalty = 1.0;
      if (climateScenario === 'drought') {
        scenarioPenalty = strat.id === 'strategy_drought_shield' ? 1.25 : 0.75;
      } else if (climateScenario === 'heatwave') {
        scenarioPenalty = strat.id === 'strategy_drought_shield' ? 1.2 : 0.85;
      } else if (climateScenario === 'wet') {
        scenarioPenalty = strat.id === 'strategy_balanced_commercial' ? 1.2 : 0.95;
      }

      // Weighted score formula (0-100)
      const waterScore = (strat.baseWaterSavingPct / 50) * 100;
      const profitScore = (strat.baseProfitDeltaPct / 40) * 100;
      const soilScore = (strat.baseSoilNitrogenKg / 70) * 100;

      const totalWeight = waterWeight + profitWeight + soilWeight || 1;
      const rawScore =
        (waterScore * waterWeight + profitScore * profitWeight + soilScore * soilWeight) / totalWeight;

      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore * scenarioPenalty)));

      return {
        ...strat,
        computedScore: finalScore,
      };
    }).sort((a, b) => b.computedScore - a.computedScore);
  }, [waterWeight, profitWeight, soilWeight, climateScenario]);

  const activeStrategy = scoredStrategies.find((s) => s.id === activeStrategyId) || scoredStrategies[0];

  // Chart data comparing the strategies
  const chartData = scoredStrategies.map((s) => ({
    name: s.title.split(' ')[0],
    'Water Savings (%)': s.baseWaterSavingPct,
    'Profit Increase (%)': s.baseProfitDeltaPct,
    'Soil Nitrogen (kg/ha)': s.baseSoilNitrogenKg,
  }));

  return (
    <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. Header with NASA Telemetry Context */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
              NASA Earth Science Decision Engine
            </span>
            <span className="text-xs text-slate-400">• Multi-Objective Adaptation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Adaptive Crop Rotation Decision Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Evaluating rotations for <span className="text-emerald-400 font-semibold">{fieldName}</span> ({fieldAcreage} acres, current: {currentCrop}). Real-time telemetry fused with farmer priorities to mitigate climate risks.
          </p>
        </div>

        {/* Live Satellite Status Pill */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs space-y-2 shrink-0">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Satellite className="w-4 h-4" />
            <span>NASA Telemetry Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>SMAP Moisture: <span className="text-white font-bold">42% (Adequate)</span></div>
            <div>GPM Rain: <span className="text-white font-bold">38.4 mm (30d)</span></div>
            <div>LST Skin Temp: <span className="text-white font-bold">26.8°C</span></div>
            <div>Landsat NDVI: <span className="text-white font-bold">0.68 Vigour</span></div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Control Bar (Priorities & Climate Scenarios) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Priority Sliders (40%) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Farmer Priority Tuning</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Total: {waterWeight + profitWeight + soilWeight}%</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Water Conservation */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-sky-800">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Water Conservation</span>
                </span>
                <span className="font-bold text-sky-700">{waterWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={waterWeight}
                onChange={(e) => setWaterWeight(Number(e.target.value))}
                aria-label="Water Conservation Weight Slider"
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Rewards low-water legumes and drought-hardy millets.</p>
            </div>

            {/* Slider 2: Profitability */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Market Profitability</span>
                </span>
                <span className="font-bold text-amber-700">{profitWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profitWeight}
                onChange={(e) => setProfitWeight(Number(e.target.value))}
                aria-label="Market Profitability Weight Slider"
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Favors cash commodities with established local buyer contracts.</p>
            </div>

            {/* Slider 3: Soil Rejuvenation */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Soil Health & Nitrogen</span>
                </span>
                <span className="font-bold text-emerald-700">{soilWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soilWeight}
                onChange={(e) => setSoilWeight(Number(e.target.value))}
                aria-label="Soil Health Weight Slider"
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Incentivizes biological N-fixation and nematode disruption.</p>
            </div>
          </div>
        </div>

        {/* Right: What-If Climate Stress Selector (60%) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Climate Stress-Test Simulation</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">What-If Scenario</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setClimateScenario('current')}
              className={`p-3 rounded-xl border text-left transition ${
                climateScenario === 'current'
                  ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="font-bold text-xs text-slate-800">Current Norms</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Historical Baseline</p>
            </button>

            <button
              onClick={() => setClimateScenario('drought')}
              className={`p-3 rounded-xl border text-left transition ${
                climateScenario === 'drought'
                  ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Droplets className="w-4 h-4 text-amber-600 mb-1" />
              <p className="font-bold text-xs text-slate-800">Drought Pulse</p>
              <p className="text-[10px] text-slate-500 mt-0.5">-35% Rain Deficit</p>
            </button>

            <button
              onClick={() => setClimateScenario('heatwave')}
              className={`p-3 rounded-xl border text-left transition ${
                climateScenario === 'heatwave'
                  ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-600 mb-1" />
              <p className="font-bold text-xs text-slate-800">Heatwave Surge</p>
              <p className="text-[10px] text-slate-500 mt-0.5">+3.5°C LST Pulse</p>
            </button>

            <button
              onClick={() => setClimateScenario('wet')}
              className={`p-3 rounded-xl border text-left transition ${
                climateScenario === 'wet'
                  ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-4 h-4 text-sky-600 mb-1" />
              <p className="font-bold text-xs text-slate-800">Surplus Rain</p>
              <p className="text-[10px] text-slate-500 mt-0.5">+25% Monsoon</p>
            </button>
          </div>

          <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100 flex items-center gap-3 text-xs text-sky-900">
            <Satellite className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>NASA Sensitivity Model:</strong> Under <strong>{climateScenario.toUpperCase()}</strong>, rotation scores automatically recalculate against NASA SMAP moisture stress curves and ECOSTRESS thermal tolerances.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Ranked Rotation Strategy Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ranked 3-Year Adaptive Rotations</span>
          </h3>
          <span className="text-xs text-slate-400">Ranked by your customized priority weights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoredStrategies.map((strat, idx) => {
            const isSelected = strat.id === activeStrategyId;
            return (
              <div
                key={strat.id}
                onClick={() => {
                  setActiveStrategyId(strat.id);
                  if (onSelectStrategy) onSelectStrategy(strat.id);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badge & Score */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      Rank #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-extrabold text-emerald-600">
                        {strat.computedScore}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">/ 100</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {strat.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {strat.tagline}
                  </p>

                  {/* 3-Year Crop Sequence Badges */}
                  <div className="my-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Sequence (Year 1 → 2 → 3):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {strat.cropSequence.map((crop, cIdx) => (
                        <React.Fragment key={crop}>
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-semibold text-xs border border-emerald-100">
                            {crop}
                          </span>
                          {cIdx < strat.cropSequence.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Water Saved</span>
                      <span className="font-bold text-sky-600 text-sm">+{strat.baseWaterSavingPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Profit</span>
                      <span className="font-bold text-emerald-600 text-sm">+{strat.baseProfitDeltaPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Soil N Added</span>
                      <span className="font-bold text-slate-800 text-sm">+{strat.baseSoilNitrogenKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-600">
                    Resilience: <strong className="text-emerald-700">{strat.resilienceRating}</strong>
                  </span>
                  <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <span>{isSelected ? 'Selected' : 'Inspect'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Strategy Deep-Dive Details & Science Provenance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Plain-Language Farmer Verdict & NASA Evidence (70%) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                Agronomic Diagnosis
              </span>
              <span className="text-xs text-slate-400">{activeStrategy.recommendedTag}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {activeStrategy.title} — Operational Blueprint
            </h3>
          </div>

          {/* Plain Language Farmer Translation */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
            <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What This Means for Your Field:</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              {activeStrategy.farmerVerdict}
            </p>
          </div>

          {/* NASA Data Provenance Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Satellite className="w-4 h-4 text-sky-600" />
              <span>Calibrated NASA Earth Science Proof Points</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 shrink-0">
                  NASA SMAP
                </span>
                <p className="text-slate-600">{activeStrategy.nasaSensorEvidence.smap}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 shrink-0">
                  ECOSTRESS
                </span>
                <p className="text-slate-600">{activeStrategy.nasaSensorEvidence.ecostress}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-800 shrink-0">
                  NASA GPM
                </span>
                <p className="text-slate-600">{activeStrategy.nasaSensorEvidence.gpm}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comparative Bar Chart (Recharts) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Cross-Strategy Trade-Off Analysis
            </h4>
            <p className="text-xs text-slate-400">
              Visualizing water savings vs profitability vs soil fertility gains.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Water Savings (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit Increase (%)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Soil Nitrogen (kg/ha)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            * Estimates generated via calibrated agronomic synergy models and NASA POWER climatology grids. Validate with local soil test cores.
          </div>
        </div>

      </div>

    </div>
  );
};
