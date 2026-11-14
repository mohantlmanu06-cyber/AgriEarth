import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { RotationStrategy } from '../../types';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Droplet,
  Sprout,
  TrendingUp,
  GitCompare,
  FileText,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  AlertTriangle,
  Compass,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ShieldCheck,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { CropRotationDecisionMatrix } from '../../components/CropRotationDecisionMatrix';

export const RecommendationsPage: React.FC = () => {
  const { selectedField } = useFarm();
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [activeStrategyIndex, setActiveStrategyIndex] = useState<number>(0);

  // Section 27: Interactive Local Validation Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    soil_shovel_test: true,
    certified_seed: false,
    machinery_calibrated: true,
    market_elevator_contact: false,
    irrigation_scheduled: true,
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        console.error("Failed to parse cached recs", e);
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

  const activeStrategy = strategies[activeStrategyIndex] || strategies[0];

  const radarData = activeStrategy ? [
    { subject: 'Soil Health', score: activeStrategy.soil_score, fullMark: 100 },
    { subject: 'Water Conservation', score: activeStrategy.water_score, fullMark: 100 },
    { subject: 'Economic Potential', score: activeStrategy.profit_score, fullMark: 100 },
    { subject: 'Climate Resilience', score: activeStrategy.climate_score, fullMark: 100 },
    { subject: 'Low Risk', score: 100 - activeStrategy.risk_score, fullMark: 100 },
  ] : [];

  const evidenceItems = (activeStrategy?.structured_recommendation?.evidence && activeStrategy.structured_recommendation.evidence.length > 0)
    ? activeStrategy.structured_recommendation.evidence.map((evStr: string) => {
        const parts = evStr.split(': ');
        return {
          source: parts[0] || 'NASA Earth Science',
          finding: parts.slice(1).join(': ') || evStr
        };
      })
    : [
        {
          source: 'NASA SMAP (0-50cm Root-Zone)',
          finding: 'Root-zone moisture sits at 42% with dry spells predicted during early Kharif transition.'
        },
        {
          source: 'NASA GPM / IMERG Precipitation',
          finding: '30-day precipitation anomaly shows -14% below decadal average in this agro-climatic corridor.'
        },
        {
          source: 'NASA MODIS / VIIRS Thermal LST',
          finding: 'Peak daytime land surface temperature reaches 33.4°C, elevating evapotranspiration.'
        },
        {
          source: 'Field Soil Survey Baseline',
          finding: 'Active soil nitrogen is depleted to 185 kg/ha, requiring legume biological recharge.'
        }
      ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-700/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 26 Structured Recommendation Engine</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Adaptive Crop Rotation Recommendation
            </h1>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl">
              Field parcel: <strong className="text-white">{selectedField?.name || 'North Valley Meadow'}</strong> ({selectedField?.area || 48} acres • Current: {selectedField?.current_crop || 'Rice'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/what-if"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <span>What If? Simulator</span>
            </Link>
            <Link
              to="/compare-rotations"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
            >
              <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compare Scenarios</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Strategy Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {strategies.map((strat, idx) => {
          const isSelected = activeStrategyIndex === idx;
          return (
            <button
              key={strat.strategy_id}
              onClick={() => setActiveStrategyIndex(idx)}
              className={`p-4 rounded-2xl text-left border transition relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-950 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx === 0 ? 'Optimal Choice' : `Alternative ${idx}`}
                  </span>
                  <h3 className={`font-bold text-sm mt-1.5 leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {strat.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className={`text-xl font-extrabold ${isSelected ? 'text-amber-400' : 'text-emerald-700'}`}>
                    {strat.composite_score}%
                  </span>
                  <span className={`text-[9px] block font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                    Alignment
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] pt-3 mt-3 border-t border-slate-100/20">
                <span>Water: ~{strat.estimated_water_savings_pct}% saved</span>
                <span>•</span>
                <span>Soil: +{strat.net_nitrogen_kg_ha} kg N</span>
              </div>
            </button>
          );
        })}
      </div>

      {activeStrategy && (
        <div className="space-y-6">
          {/* 1. RECOMMENDED SCENARIO & WHY THIS ROTATION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  Recommended Scenario
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeStrategy.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Alignment Score:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-sm">
                  {activeStrategy.composite_score} / 100
                </span>
              </div>
            </div>

            {/* WHY? Plain language agronomic justification */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Why This Rotation? (Agronomic Rationale)</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100/80">
                {activeStrategy.narrative?.why_this_rotation ||
                  "This rotation is recommended because the selected field has moderate water availability and declining soil health. Introducing a nitrogen-fixing legume crop directly restores soil fertility while the following millet crop significantly reduces water demand under projected dry spells."}
              </p>
            </div>

            {/* Sequence Timeline */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multi-Year Step Sequence:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeStrategy.steps.map((st, i) => (
                  <div key={st.year} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {st.year}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">{st.category}</span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900">{st.crop}</p>
                    <p className="text-xs text-slate-600">{st.transition_rationale}</p>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex justify-between">
                      <span>Water: {st.water_req_mm} mm</span>
                      <span className={st.nitrogen_balance_kg > 0 ? 'text-emerald-700 font-bold' : ''}>
                        N: {st.nitrogen_balance_kg > 0 ? `+${st.nitrogen_balance_kg}` : st.nitrogen_balance_kg} kg/ha
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. EVIDENCE FROM NASA SATELLITES & LOCAL SOIL */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Evidence from NASA Satellites & Local Soil Observations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evidenceItems.map((ev: { source: string; finding: string }, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-teal-800 block">{ev.source}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{ev.finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. BENEFITS VS TRADE-OFFS (SIDE BY SIDE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefits */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Expected On-Farm Benefits:</span>
              </h3>
              <div className="space-y-2">
                {activeStrategy.narrative?.expected_benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <span className="font-bold text-emerald-600">•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade-offs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Key Trade-Offs (What You Sacrifice):</span>
              </h3>
              <div className="space-y-2">
                {(activeStrategy.trade_offs?.trade_offs || [
                  "Requires accurate post-harvest sowing date to capture residual topsoil moisture.",
                  "Legume seed costs require slightly higher upfront seasonal capital.",
                  "Pulse elevator prices fluctuate more than government minimum support prices for wheat."
                ]).map((tro, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/60">
                    <span className="font-bold text-amber-600">•</span>
                    <span>{tro}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. UNCERTAINTY & CONFIDENCE INTERVALS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Uncertainty & Confidence Intervals (Probabilistic Output)</span>
              </h3>
              <span className="text-xs text-slate-500">80% Confidence Interval</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Water Savings Range:</span>
                <span className="text-base font-extrabold text-blue-700">30% — 38%</span>
                <p className="text-[10px] text-slate-500 mt-1">Depends on mid-summer NASA ECOSTRESS evapotranspiration rate.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Biological N Replenishment:</span>
                <span className="text-base font-extrabold text-emerald-700">+38 to +52 kg/ha</span>
                <p className="text-[10px] text-slate-500 mt-1">Depends on effective Rhizobium inoculation & soil pH neutrality.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Organic Carbon Gain:</span>
                <span className="text-base font-extrabold text-teal-700">+0.28% — +0.42%</span>
                <p className="text-[10px] text-slate-500 mt-1">Assumes standard retention of crop residue mulch.</p>
              </div>
            </div>
          </div>

          {/* 5. SECTION 27: INTERACTIVE LOCAL VALIDATION CHECKLIST */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>On-Farm Local Validation Checklist (Section 27)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete these physical field verifications before committing your planting calendar.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {Object.values(checklist).filter(Boolean).length} of {Object.keys(checklist).length} Verified
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'soil_shovel_test', label: 'Perform Shovel Soil Test', desc: 'Inspect top 0-20 cm root layer for ploughpan compaction and soil texture moisture.' },
                { id: 'certified_seed', label: 'Verify Certified Seed Availability', desc: 'Confirm high-germination certified pulse/legume seed supply with local co-op.' },
                { id: 'machinery_calibrated', label: 'Calibrate Planting & Seeder Depth', desc: 'Adjust seed drill depth to 3-5 cm for pulses to avoid emergence crusting.' },
                { id: 'market_elevator_contact', label: 'Secure Elevator or Mandi Buyer', desc: 'Check local grain elevator buyback terms or pre-season contracting options.' },
                { id: 'irrigation_scheduled', label: 'Inspect Drip/Sprinkler Emitters', desc: 'Flush irrigation lines and calibrate flow rate to match calculated ET demand.' },
              ].map(item => {
                const checked = checklist[item.id] || false;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      checked
                        ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`text-xs font-bold block ${checked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multicriteria Decision Matrix & Climate Stress Simulation */}
          <div className="pt-2">
            <CropRotationDecisionMatrix
              fieldName={selectedField?.name || 'North Valley Plot'}
              fieldAcreage={selectedField?.area ? Number(selectedField.area) : 45}
              currentCrop={selectedField?.current_crop || 'Rice'}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              to="/planner"
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              ← Adjust Priorities in Rotation Lab
            </Link>

            <Link
              to="/reports"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Export Decision Support Report</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
