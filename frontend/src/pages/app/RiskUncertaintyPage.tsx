import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Field } from '../../types';
import {
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Info,
  CheckCircle2,
  Droplets,
  Thermometer,
  Layers,
  Bug,
  DollarSign,
  Wrench,
  Percent,
  Compass
} from 'lucide-react';

export const RiskUncertaintyPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number>(1);
  const [activeStrategy, setActiveStrategy] = useState<'existing' | 'strategy_a' | 'strategy_b' | 'strategy_c'>('strategy_a');

  useEffect(() => {
    async function loadFields() {
      const list = await apiService.getFields();
      setFields(list);
      if (list.length > 0) setSelectedFieldId(list[0].id);
    }
    loadFields();
  }, []);

  const currentField = fields.find(f => f.id === selectedFieldId) || fields[0];

  // 6 Risk Dimensions Data Model
  const riskDimensions = [
    {
      id: 'drought',
      title: 'Drought & Water Deficit Risk',
      icon: Droplets,
      color: 'blue',
      existing_risk: 78,
      existing_desc: 'Continuous rice relies on high floodwaters; dry intervals trigger severe stress.',
      strategy_a_risk: 22,
      strategy_a_desc: 'Legume and millet sequence reduces seasonal water requirements by 35%.',
      evidence_source: 'NASA SMAP 0-50cm Root-Zone Soil Moisture & GPM IMERG 30-day rain anomalies'
    },
    {
      id: 'heat',
      title: 'Heat Stress & Flowering Abortion',
      icon: Thermometer,
      color: 'amber',
      existing_risk: 65,
      existing_desc: 'Pollen sterility occurs when rice anthesis coincides with noon temperatures >35°C.',
      strategy_a_risk: 28,
      strategy_a_desc: 'Millets utilize C4 photosynthetic pathway, thriving under elevated heat.',
      evidence_source: 'NASA MODIS (MOD11A2) & NASA POWER Growing Degree Days (GDD)'
    },
    {
      id: 'soil_depletion',
      title: 'Soil Nutrient Depletion Risk',
      icon: Layers,
      color: 'emerald',
      existing_risk: 84,
      existing_desc: 'Perpetual cereal cropping depletes 120 kg/ha active nitrogen and degrades microbial biomass.',
      strategy_a_risk: 18,
      strategy_a_desc: 'Biological symbiotic nitrogen fixation (Rhizobium) restores +45 kg/ha active nitrogen.',
      evidence_source: 'Soil Health Survey & USDA NRCS Rotational Nutrient Tables'
    },
    {
      id: 'pest_disease',
      title: 'Pest & Pathogen Carryover Risk',
      icon: Bug,
      color: 'red',
      existing_risk: 72,
      existing_desc: 'Monoculture maintains continuous host tissue for stem borer, sheath blight, and root nematodes.',
      strategy_a_risk: 15,
      strategy_a_desc: 'Family rotation (Poaceae → Fabaceae) breaks specific insect and fungus reproduction cycles.',
      evidence_source: 'Agronomic Extension Pathology Models & Historical Field Scouting'
    },
    {
      id: 'economic',
      title: 'Market & Input Cost Volatility',
      icon: DollarSign,
      color: 'purple',
      existing_risk: 60,
      existing_desc: 'Heavily reliant on synthetic chemical fertilizer purchases; price surges reduce margin.',
      strategy_a_risk: 30,
      strategy_a_desc: 'Less fertilizer dependency and dual-market grain and pulse selling options.',
      evidence_source: 'Historical Commodity Elevator Pricing & AgInput Price Index'
    },
    {
      id: 'transition',
      title: 'Management & Transition Complexity',
      icon: Wrench,
      color: 'slate',
      existing_risk: 15,
      existing_desc: 'Familiar conventional routine with established tractor implements and local habits.',
      strategy_a_risk: 42,
      strategy_a_desc: 'Requires timing pulse sowing into residual post-monsoon moisture and calibrating seeding depth.',
      evidence_source: 'Regional Extension Onboarding Guidelines & Farm Machinery Audits'
    }
  ];

  // Data Quality & Coverage
  const dataQualitySources = [
    { name: 'NASA SMAP Soil Moisture (L4 Downscaled)', coverage: 94, latency: '2-3 Days', uncertainty_margin: '±0.04 m³/m³', rating: 'High Confidence' },
    { name: 'NASA GPM / IMERG Precipitation Retrievial', coverage: 96, latency: 'Daily Synthesis', uncertainty_margin: '±12% volume', rating: 'High Confidence' },
    { name: 'NASA MODIS/VIIRS Surface Temperature & NDVI', coverage: 98, latency: '1-2 Days', uncertainty_margin: '±1.0°C / ±0.03 NDVI', rating: 'Very High Confidence' },
    { name: 'NASA SRTM 30m Digital Elevation Model', coverage: 100, latency: 'Static Baseline', uncertainty_margin: '±3.8m elevation', rating: 'Very High Confidence' },
    { name: 'Field Soil Sampling & Nutrient Benchmark', coverage: 82, latency: 'Annual Lab Sync', uncertainty_margin: '±15 kg/ha Nitrogen', rating: 'Medium Confidence' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-indigo-700/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Risk & Uncertainty Framework (Sections 19, 20 & 21)</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
          Risk Dimensions, Uncertainty Ranges & Data Quality
        </h1>
        <p className="mt-2 text-slate-300 text-sm max-w-3xl leading-relaxed">
          Sound agricultural planning requires acknowledging uncertainty. We disclose data limitations, probability spreads, and multi-dimensional vulnerability scores so you make calibrated decisions.
        </p>
      </div>

      {/* Field Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase">Field Parcel:</label>
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.area} ac)</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">Compare:</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Existing Monoculture
          </span>
          <span className="text-xs text-slate-600">vs</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Strategy A (Diversified)
          </span>
        </div>
      </div>

      {/* Section 20: Uncertainty Confidence Ranges */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Probabilistic Uncertainty Ranges (Section 20)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agricultural models cannot guarantee single exact numbers. Below are 80% confidence interval forecasts.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            90% Model Confidence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Range Card 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Water Savings Range</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-blue-700">30% — 38%</span>
              <span className="text-xs text-slate-500">(Mean: 35%)</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Varies based on monsoon onset date and mid-summer evaporation rates recorded by NASA ECOSTRESS.
            </p>
          </div>

          {/* Range Card 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Biological Nitrogen Gain</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-700">+38 to +52</span>
              <span className="text-xs text-slate-500">kg/ha active N</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Dependent upon soil pH neutral range and successful Rhizobium nodulation in pulse phase.
            </p>
          </div>

          {/* Range Card 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Organic Matter Accumulation</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-700">+0.28% — +0.42%</span>
              <span className="text-xs text-slate-500">over 3 yrs</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Assumes minimal residue burning and normal incorporation of pulse and millet crop straw into topsoil.
            </p>
          </div>
        </div>
      </div>

      {/* Section 19: 6 Risk Dimensions Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>The 6 Risk Dimensions Breakdown (Section 19)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskDimensions.map((dim) => {
            const Icon = dim.icon;
            const diff = dim.existing_risk - dim.strategy_a_risk;

            return (
              <div key={dim.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{dim.title}</h3>
                  </div>
                  {diff > 0 && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      -{diff}% Risk with Strategy A
                    </span>
                  )}
                </div>

                {/* Comparative Risk Bars */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Existing Monoculture:</span>
                      <span className="font-bold text-amber-700">{dim.existing_risk}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${dim.existing_risk}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{dim.existing_desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Strategy A (Recommended):</span>
                      <span className="font-bold text-emerald-700">{dim.strategy_a_risk}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${dim.strategy_a_risk}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{dim.strategy_a_desc}</p>
                  </div>
                </div>

                {/* Evidence citation footnote */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">NASA / Agronomic Basis:</span>
                  <span className="truncate">{dim.evidence_source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 21: Data Quality & Sensor Coverage */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Data Quality & Sensor Coverage (Section 21)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparency on telemetry freshness, pixel downscaling, and observation fidelity.
            </p>
          </div>
          <span className="text-xs text-slate-600">Updated: Today</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Sensor / Observation Product</th>
                <th className="pb-3 font-semibold">Spatial & Temporal Cadence</th>
                <th className="pb-3 font-semibold">Quality & Completeness</th>
                <th className="pb-3 font-semibold">Uncertainty Margin</th>
                <th className="pb-3 font-semibold text-right">Confidence Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataQualitySources.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="py-3 text-slate-600">{s.latency}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${s.coverage}%` }} />
                      </div>
                      <span className="font-bold text-slate-700">{s.coverage}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 font-mono text-[11px]">{s.uncertainty_margin}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Local Validation Guideline Box */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">Ground Truth & Local Validation Principle:</p>
            <p className="leading-relaxed">
              Satellite observations provide regional indicators and parcel trends, but cannot replace on-field calibration. Always corroborate remote sensing signals with physical shovel soil checks, local extension advisor counsel, and seed germination tests before executing full rotation transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
