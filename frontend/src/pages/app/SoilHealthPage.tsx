import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Activity,
  Droplet,
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export const SoilHealthPage: React.FC = () => {
  const { selectedField } = useFarm();
  const [soilProfile, setSoilProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedField) return;
    setLoading(true);
    apiService.getSoilHealth(selectedField.id).then(data => {
      setSoilProfile(data);
      setLoading(false);
    });
  }, [selectedField]);

  const components = soilProfile?.components || {
    organic_matter: { value: 1.4, unit: "%", target: "> 2.0%", score: 68, status: "Sub-optimal" },
    moisture: { value: 38.5, unit: "%", target: "35-50%", score: 82, status: "Optimal" },
    nitrogen: { value: 185, unit: "kg/ha", target: "250-400 kg/ha", score: 62, status: "Deficient (Needs Legume)" },
    phosphorus: { value: 24.2, unit: "kg/ha", target: "20-40 kg/ha", score: 88, status: "Adequate" },
    potassium: { value: 210, unit: "kg/ha", target: "180-280 kg/ha", score: 85, status: "Adequate" },
    pH: { value: 6.8, unit: "pH", target: "6.2 - 7.5", score: 94, status: "Optimal Neutral" },
    salinity_ec: { value: 0.42, unit: "dS/m", target: "< 1.0 dS/m", score: 92, status: "Non-saline" },
    water_retention: { value: 72, unit: "%", target: "> 65%", score: 78, status: "Good" },
  };

  const chartData = [
    { name: 'Org Matter', score: components.organic_matter.score, fill: '#10b981' },
    { name: 'Moisture', score: components.moisture.score, fill: '#0284c7' },
    { name: 'Nitrogen (N)', score: components.nitrogen.score, fill: '#f59e0b' },
    { name: 'Phosphorus (P)', score: components.phosphorus.score, fill: '#10b981' },
    { name: 'Potassium (K)', score: components.potassium.score, fill: '#10b981' },
    { name: 'Soil pH', score: components.pH.score, fill: '#10b981' },
    { name: 'EC Salinity', score: components.salinity_ec.score, fill: '#10b981' },
    { name: 'Water Retention', score: components.water_retention.score, fill: '#0284c7' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Soil Physical & Biological Health
            </span>
            <span className="text-xs text-slate-400">• Field: {selectedField?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Soil Health Diagnosis & Scorecard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-parameter soil profile evaluation fused with NASA satellite moisture observations.
          </p>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan Soil-Rejuvenation Rotation</span>
        </Link>
      </div>

      {/* 14. SOIL HEALTH SCORE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Overall Soil Biological Health
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-white">
              {soilProfile?.overall_health_score || 78}
            </span>
            <span className="text-xl sm:text-2xl text-emerald-300 font-bold">
              / 100 — {soilProfile?.overall_health_grade || 'Good'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Soil physical structure and water infiltration are strong, but intensive continuous cereal cultivation has created an active nitrogen deficit.
          </p>
        </div>

        {/* Section 14 Callout Box */}
        <div className="bg-emerald-900/60 border border-emerald-700/60 p-4 rounded-2xl max-w-sm text-xs space-y-1">
          <p className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Target Agronomic Recommendation:</span>
          </p>
          <p className="text-emerald-100 leading-relaxed">
            “Your field may benefit from a rotation that includes a nitrogen-fixing crop (such as Pulses or Chickpea) to biologically recharge root-zone fertility.”
          </p>
        </div>
      </div>

      {/* Component Parameter Grid (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Organic Matter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Organic Matter</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Sub-optimal</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.organic_matter.value} %</p>
          <p className="text-[11px] text-slate-400">Target: {components.organic_matter.target}</p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Root-Zone Moisture</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Optimal</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.moisture.value} %</p>
          <p className="text-[11px] text-slate-400">Target: {components.moisture.target}</p>
        </div>

        {/* Available Nitrogen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Available Nitrogen (N)</span>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Deficient</span>
          </div>
          <p className="text-2xl font-extrabold text-red-600">{components.nitrogen.value} kg/ha</p>
          <p className="text-[11px] text-slate-400">Target: {components.nitrogen.target}</p>
        </div>

        {/* Available Phosphorus */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Phosphorus (P₂O₅)</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Adequate</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.phosphorus.value} kg/ha</p>
          <p className="text-[11px] text-slate-400">Target: {components.phosphorus.target}</p>
        </div>

        {/* Potassium */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Potassium (K₂O)</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Adequate</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.potassium.value} kg/ha</p>
          <p className="text-[11px] text-slate-400">Target: {components.potassium.target}</p>
        </div>

        {/* Soil pH */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Soil pH</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Neutral</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.pH.value}</p>
          <p className="text-[11px] text-slate-400">Target: {components.pH.target}</p>
        </div>

        {/* Salinity EC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Electrical Salinity (EC)</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Non-saline</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.salinity_ec.value} dS/m</p>
          <p className="text-[11px] text-slate-400">Target: {components.salinity_ec.target}</p>
        </div>

        {/* Water Retention */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Water Retention Capacity</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Good</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{components.water_retention.value} %</p>
          <p className="text-[11px] text-slate-400">Target: {components.water_retention.target}</p>
        </div>

      </div>

      {/* Chart: Component Health Scores */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Soil Health Parameter Benchmark (Normalized 0 - 100 Score)
          </h3>
          <p className="text-xs text-slate-500">
            Scores below 70 indicate urgent targets for crop rotation interventions.
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score < 70 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
