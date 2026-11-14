import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { RotationStrategy } from '../../types';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  Sparkles,
  Sprout,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export const RotationComparisonPage: React.FC = () => {
  const { selectedField } = useFarm();
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strategy_a');

  useEffect(() => {
    const cached = sessionStorage.getItem('fieldshift_last_recommendations');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setStrategies(parsed);
          return;
        }
      } catch (e) {
        console.error("Cached recs parse error", e);
      }
    }

    apiService.analyzeRotation({
      field_id: selectedField?.id,
      current_crop: selectedField?.current_crop || 'Rice',
      candidate_crops: ['Pulses', 'Maize', 'Wheat', 'Groundnut', 'Soybean', 'Millets'],
      duration_years: 3,
      priorities: {
        soil_health: 80,
        water_conservation: 75,
        climate_resilience: 85,
        economic_potential: 70,
        erosion_reduction: 65,
        risk_reduction: 70,
        market_suitability: 75
      }
    }).then(res => setStrategies(res.recommendations));
  }, [selectedField]);

  // Ensure 4 strategies exist (Existing + A + B + C)
  const defaultExisting: RotationStrategy = {
    strategy_id: 'existing',
    strategy_type: 'existing',
    title: 'Existing: Continuous Rice-Wheat',
    is_baseline: true,
    badge: 'Current Monoculture',
    sequence: ['Rice', 'Wheat', 'Rice'],
    steps: [],
    composite_score: 52,
    soil_score: 42,
    water_score: 38,
    profit_score: 68,
    climate_score: 45,
    risk_score: 74,
    net_nitrogen_kg_ha: -95,
    avg_water_mm: 720,
    estimated_water_savings_pct: 0,
    estimated_om_gain_pct: -0.15,
    trade_offs: {
      strengths: [
        'Established routine with zero learning curve for farm labor',
        'Direct procurement and elevator buyback for rice and wheat grain'
      ],
      trade_offs: [
        'Massive water footprint (~720 mm/season) depleting local aquifer',
        'Depletes -95 kg/ha nitrogen requiring heavy synthetic urea reliance',
        'Elevated stem borer and soilborne pathogen carryover risk'
      ]
    }
  };

  const defaultStratA: RotationStrategy = {
    strategy_id: 'strategy_a',
    strategy_type: 'strategy_a',
    title: 'Strategy A: Rice → Pulses → Maize',
    is_baseline: false,
    badge: 'Recommended',
    sequence: ['Pulses', 'Maize', 'Millets'],
    steps: [],
    composite_score: 88,
    soil_score: 91,
    water_score: 82,
    profit_score: 86,
    climate_score: 90,
    risk_score: 18,
    net_nitrogen_kg_ha: 45,
    avg_water_mm: 373,
    estimated_water_savings_pct: 35,
    estimated_om_gain_pct: 0.38,
    trade_offs: {
      strengths: [
        'Biological nitrogen fixation (+45 kg/ha active N)',
        '35% water savings via pulses & deep-rooted millets',
        'Alternating families breaks stem borer pest cycle'
      ],
      trade_offs: [
        'Requires precision timing to sow pulses into residual moisture',
        'Pulse mandi prices fluctuate more than government MSP cereals'
      ]
    }
  };

  const defaultStratB: RotationStrategy = {
    strategy_id: 'strategy_b',
    strategy_type: 'strategy_b',
    title: 'Strategy B: Wheat → Chickpea → Groundnut',
    is_baseline: false,
    badge: 'Water Saver',
    sequence: ['Chickpea', 'Groundnut', 'Wheat'],
    steps: [],
    composite_score: 84,
    soil_score: 82,
    water_score: 89,
    profit_score: 84,
    climate_score: 82,
    risk_score: 20,
    net_nitrogen_kg_ha: 38,
    avg_water_mm: 350,
    estimated_water_savings_pct: 38,
    estimated_om_gain_pct: 0.32,
    trade_offs: {
      strengths: [
        'Lowest water consumption of all strategies (~350 mm)',
        'Deep taproots scavenge subsoil moisture effectively',
        'Excellent drought insurance for rainfed fields'
      ],
      trade_offs: [
        'Groundnut harvest requires specialized digger/pod lifter machinery',
        'Higher seed upfront cost during establishment'
      ]
    }
  };

  const defaultStratC: RotationStrategy = {
    strategy_id: 'strategy_c',
    strategy_type: 'strategy_c',
    title: 'Strategy C: Rice → Soybean → Millet',
    is_baseline: false,
    badge: 'Economic Balance',
    sequence: ['Soybean', 'Millets', 'Wheat'],
    steps: [],
    composite_score: 81,
    soil_score: 79,
    water_score: 85,
    profit_score: 82,
    climate_score: 83,
    risk_score: 22,
    net_nitrogen_kg_ha: 22,
    avg_water_mm: 396,
    estimated_water_savings_pct: 32,
    estimated_om_gain_pct: 0.28,
    trade_offs: {
      strengths: [
        'High commercial oilseed demand with predictable elevator intake',
        'Millets provide exceptional thermal buffering against heatwaves',
        'Gentler transition curve for cereal-dominant farmers'
      ],
      trade_offs: [
        'Lower net nitrogen contribution (+22 kg/ha) compared to Strategy A',
        'Soybean remains vulnerable to late pod borer infestations'
      ]
    }
  };

  // Harmonize strategies array
  const fullStrategies = [
    strategies.find(s => s.is_baseline || s.strategy_id === 'existing') || defaultExisting,
    strategies.find(s => s.strategy_id === 'strategy_a' || s.strategy_type === 'strategy_a' || s.strategy_id === 'Strategy A') || defaultStratA,
    strategies.find(s => s.strategy_id === 'strategy_b' || s.strategy_type === 'strategy_b' || s.strategy_id === 'Strategy B') || defaultStratB,
    strategies.find(s => s.strategy_id === 'strategy_c' || s.strategy_type === 'strategy_c' || s.strategy_id === 'Strategy C') || defaultStratC,
  ];

  const existingStrat = fullStrategies[0];
  const stratA = fullStrategies[1];
  const stratB = fullStrategies[2];
  const stratC = fullStrategies[3];

  // Section 16: Trade-off Scatter / Bubble Chart Data
  // X: Water Requirement (mm), Y: Soil Health Score, Z: Risk Score (Bubble Size)
  const scatterData = fullStrategies.map(s => ({
    id: s.strategy_id,
    name: s.title.split(':')[0],
    fullName: s.title,
    water_mm: s.avg_water_mm,
    soil_score: s.soil_score,
    risk_score: s.risk_score,
    composite: s.composite_score,
    is_baseline: s.is_baseline
  }));

  const activeFocus = fullStrategies.find(s => s.strategy_id === selectedStrategyId) || stratA;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-700/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>4-Scenario Comparison & Trade-Off Analytics (Sections 15 & 16)</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
          Compare Rotation Scenarios & Trade-Offs
        </h1>
        <p className="mt-2 text-slate-300 text-sm max-w-3xl leading-relaxed">
          Evaluate your existing crop rotation against three AI-generated alternatives. Every rotation comes with distinct benefits and sacrifices — explore the trade-offs to choose what fits your farm.
        </p>
      </div>

      {/* Section 16: Interactive Trade-Off Scatter/Bubble Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Interactive Trade-Off Bubble Chart (Section 16)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              X-Axis: Water Demand (mm) • Y-Axis: Soil Health (0-100) • Bubble Size: Risk Level. Click any bubble to focus.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Alternatives
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Existing Monoculture
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="water_mm"
                name="Water Demand"
                unit=" mm"
                domain={[300, 800]}
                label={{ value: 'Water Demand (Lower is Better →)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="soil_score"
                name="Soil Health"
                domain={[30, 100]}
                label={{ value: 'Soil Health Score (Higher is Better ↑)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                tick={{ fontSize: 10 }}
              />
              <ZAxis
                type="number"
                dataKey="risk_score"
                range={[120, 600]}
                name="Risk Level"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
                        <p className="font-bold text-emerald-400">{data.fullName}</p>
                        <p>Soil Score: <span className="font-semibold">{data.soil_score}/100</span></p>
                        <p>Water Demand: <span className="font-semibold">{data.water_mm} mm</span></p>
                        <p>Vulnerability Risk: <span className="font-semibold text-amber-300">{data.risk_score}/100</span></p>
                        <p className="text-[10px] text-slate-400 pt-1">Click bubble to inspect below</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Rotations"
                data={scatterData}
                onClick={(e: any) => setSelectedStrategyId(e?.id || e?.payload?.id || 'strategy_a')}
                className="cursor-pointer"
              >
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.is_baseline ? '#f59e0b' : index === 1 ? '#10b981' : index === 2 ? '#0284c7' : '#8b5cf6'}
                    stroke={selectedStrategyId === entry.id ? '#0f172a' : '#ffffff'}
                    strokeWidth={selectedStrategyId === entry.id ? 3 : 1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Strategy Focus Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Focused Strategy</span>
            <h3 className="text-sm font-bold text-slate-900">{activeFocus.title}</h3>
            <p className="text-xs text-slate-600">
              Composite Score: <strong className="text-emerald-700">{activeFocus.composite_score}/100</strong> • Water: {activeFocus.avg_water_mm} mm • Nitrogen: {activeFocus.net_nitrogen_kg_ha > 0 ? `+${activeFocus.net_nitrogen_kg_ha}` : activeFocus.net_nitrogen_kg_ha} kg/ha
            </p>
          </div>
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <span>View Full Section 26 Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Section 15: 4-Scenario Full Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              The 4-Scenario Rotation Matrix (Section 15)
            </h2>
            <p className="text-xs text-slate-500">
              Comparing current baseline against high-diversity, water-conserving, and balanced alternatives
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            Field: {selectedField?.name || 'North Valley Meadow'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75">
                <th className="py-4 px-6 font-bold text-slate-700 uppercase tracking-wider text-[11px] w-1/4">
                  Evaluation Dimension
                </th>
                <th className="py-4 px-5 text-center bg-amber-50/50 border-r border-amber-200/50">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 mb-1 inline-block">Baseline</span>
                  <div className="font-extrabold text-slate-900 text-xs truncate">Continuous Rice-Wheat</div>
                </th>
                <th className="py-4 px-5 text-center bg-emerald-50/50 border-r border-emerald-200/50">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 mb-1 inline-block">Recommended</span>
                  <div className="font-extrabold text-emerald-900 text-xs truncate">Strategy A: Rice-Pulse-Maize</div>
                </th>
                <th className="py-4 px-5 text-center bg-sky-50/50 border-r border-sky-200/50">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-200 text-sky-900 mb-1 inline-block">Water Saver</span>
                  <div className="font-extrabold text-sky-900 text-xs truncate">Strategy B: Wheat-Chickpea</div>
                </th>
                <th className="py-4 px-5 text-center bg-purple-50/50">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900 mb-1 inline-block">Balanced</span>
                  <div className="font-extrabold text-purple-900 text-xs truncate">Strategy C: Rice-Soy-Millet</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Composite Suitability */}
              <tr className="bg-slate-50/40 font-bold">
                <td className="py-3.5 px-6 font-bold text-slate-900">Composite Suitability Score</td>
                <td className="py-3.5 px-5 text-center text-amber-800 bg-amber-50/30">{existingStrat.composite_score}/100</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/30 font-extrabold">{stratA.composite_score}/100</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/30">{stratB.composite_score}/100</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/30">{stratC.composite_score}/100</td>
              </tr>

              {/* Water Requirement */}
              <tr>
                <td className="py-3.5 px-6 font-semibold text-slate-800">Seasonal Water Requirement</td>
                <td className="py-3.5 px-5 text-center text-red-600 bg-amber-50/10 font-bold">{existingStrat.avg_water_mm} mm</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{stratA.avg_water_mm} mm (-35%)</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/10 font-bold">{stratB.avg_water_mm} mm (-38%)</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/10 font-bold">{stratC.avg_water_mm} mm (-32%)</td>
              </tr>

              {/* Soil Health Score */}
              <tr>
                <td className="py-3.5 px-6 font-semibold text-slate-800">Soil Health Score (0-100)</td>
                <td className="py-3.5 px-5 text-center text-amber-700 bg-amber-50/10">{existingStrat.soil_score}/100</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{stratA.soil_score}/100</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/10">{stratB.soil_score}/100</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/10">{stratC.soil_score}/100</td>
              </tr>

              {/* Net Nitrogen */}
              <tr>
                <td className="py-3.5 px-6 font-semibold text-slate-800">Net Biological Nitrogen Balance</td>
                <td className="py-3.5 px-5 text-center text-red-600 bg-amber-50/10 font-bold">{existingStrat.net_nitrogen_kg_ha} kg/ha</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/10 font-bold">+{stratA.net_nitrogen_kg_ha} kg/ha</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/10 font-bold">+{stratB.net_nitrogen_kg_ha} kg/ha</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/10 font-bold">+{stratC.net_nitrogen_kg_ha} kg/ha</td>
              </tr>

              {/* Climate Resilience */}
              <tr>
                <td className="py-3.5 px-6 font-semibold text-slate-800">Climate & Drought Resilience</td>
                <td className="py-3.5 px-5 text-center text-amber-700 bg-amber-50/10">{existingStrat.climate_score}/100</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{stratA.climate_score}/100</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/10">{stratB.climate_score}/100</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/10">{stratC.climate_score}/100</td>
              </tr>

              {/* Vulnerability Risk */}
              <tr>
                <td className="py-3.5 px-6 font-semibold text-slate-800">Vulnerability & Shock Risk</td>
                <td className="py-3.5 px-5 text-center text-red-600 bg-amber-50/10 font-bold">{existingStrat.risk_score}/100 (High)</td>
                <td className="py-3.5 px-5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{stratA.risk_score}/100 (Low)</td>
                <td className="py-3.5 px-5 text-center text-sky-700 bg-sky-50/10 font-bold">{stratB.risk_score}/100 (Low)</td>
                <td className="py-3.5 px-5 text-center text-purple-700 bg-purple-50/10 font-bold">{stratC.risk_score}/100 (Low)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicit Strengths vs Trade-Offs Cards for all 4 Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Strengths vs. Trade-Offs Analysis: What You Gain vs. What You Sacrifice
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Field Shift adheres to transparent agronomic reality: no single crop rotation excels in every parameter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fullStrategies.map((s) => (
            <div
              key={s.strategy_id}
              className={`p-5 rounded-2xl border bg-white shadow-xs space-y-4 ${
                s.is_baseline ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.is_baseline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {s.badge || 'Alternative'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{s.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-700">Score: {s.composite_score}/100</span>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Strengths (What You Gain):
                </span>
                <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc">
                  {s.trade_offs?.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Trade-offs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Key Trade-Offs (What You Sacrifice):
                </span>
                <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc">
                  {s.trade_offs?.trade_offs.map((tro, idx) => (
                    <li key={idx}>{tro}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
