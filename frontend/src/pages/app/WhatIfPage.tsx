import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Field, WhatIfResponse } from '../../types';
import {
  SlidersHorizontal,
  CloudRain,
  Thermometer,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const WhatIfPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number>(1);
  const [rainfallDelta, setRainfallDelta] = useState<number>(-15);
  const [tempDelta, setTempDelta] = useState<number>(2.0);
  const [moistureDelta, setMoistureDelta] = useState<number>(-10);
  const [waterAvail, setWaterAvail] = useState<'low' | 'medium' | 'high'>('low');

  const [simulation, setSimulation] = useState<WhatIfResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const fieldList = await apiService.getFields();
      setFields(fieldList);
      if (fieldList.length > 0) {
        setSelectedFieldId(fieldList[0].id);
      }
    }
    init();
  }, []);

  useEffect(() => {
    runSimulation();
  }, [selectedFieldId, rainfallDelta, tempDelta, moistureDelta, waterAvail]);

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const selectedField = fields.find(f => f.id === selectedFieldId);
      const res = await apiService.simulateWhatIf({
        field_id: selectedFieldId,
        current_crop: selectedField?.current_crop || "Rice",
        candidate_crops: ["Pulses", "Maize", "Wheat", "Groundnut", "Soybean", "Millets"],
        rainfall_delta_pct: rainfallDelta,
        temp_delta_c: tempDelta,
        moisture_delta_pct: moistureDelta,
        water_availability: waterAvail
      });
      setSimulation(res);
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPresets = (preset: 'drought' | 'heatwave' | 'optimal' | 'excess_rain') => {
    if (preset === 'drought') {
      setRainfallDelta(-25);
      setTempDelta(3.5);
      setMoistureDelta(-20);
      setWaterAvail('low');
    } else if (preset === 'heatwave') {
      setRainfallDelta(-5);
      setTempDelta(4.0);
      setMoistureDelta(-15);
      setWaterAvail('medium');
    } else if (preset === 'optimal') {
      setRainfallDelta(0);
      setTempDelta(0);
      setMoistureDelta(0);
      setWaterAvail('medium');
    } else if (preset === 'excess_rain') {
      setRainfallDelta(25);
      setTempDelta(-1.0);
      setMoistureDelta(20);
      setWaterAvail('high');
    }
  };

  const currentField = fields.find(f => f.id === selectedFieldId) || fields[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Scenario Simulator (Sections 17 & 18)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            What-If? Climate & Stress Simulation
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Test how different crop rotation strategies endure sudden climate perturbations: drought pulses, temperature increases, and seasonal irrigation constraints.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="mt-4 flex flex-wrap gap-2 z-10 relative">
          <span className="text-xs text-slate-300 self-center font-medium mr-1">Quick Scenarios:</span>
          <button
            onClick={() => handleResetPresets('drought')}
            className="px-3 py-1 text-xs rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/50 transition font-medium"
          >
            🔥 Severe Drought (-25% Rain, +3.5°C)
          </button>
          <button
            onClick={() => handleResetPresets('heatwave')}
            className="px-3 py-1 text-xs rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/50 transition font-medium"
          >
            ☀️ Peak Heatwave (+4.0°C)
          </button>
          <button
            onClick={() => handleResetPresets('excess_rain')}
            className="px-3 py-1 text-xs rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/50 transition font-medium"
          >
            🌧️ Heavy Monsoon (+25% Rain)
          </button>
          <button
            onClick={() => handleResetPresets('optimal')}
            className="px-3 py-1 text-xs rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 transition font-medium"
          >
            ⚖️ Normal Baseline (0% Delta)
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sliders sidebar */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Active Field Parcel
            </label>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.area} ac • {f.current_crop})
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-5">
            {/* Rainfall Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  Rainfall Anomaly
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${rainfallDelta < 0 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                  {rainfallDelta > 0 ? `+${rainfallDelta}%` : `${rainfallDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={rainfallDelta}
                onChange={(e) => setRainfallDelta(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>-30% (Drought)</span>
                <span>Normal</span>
                <span>+30% (Surplus)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  Temperature Delta
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${tempDelta > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="5"
                step="0.5"
                value={tempDelta}
                onChange={(e) => setTempDelta(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>-3°C (Cooler)</span>
                <span>0°C</span>
                <span>+5°C (Extreme)</span>
              </div>
            </div>

            {/* Soil Moisture Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-600" />
                  Soil Moisture Delta
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${moistureDelta < 0 ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>
                  {moistureDelta > 0 ? `+${moistureDelta}%` : `${moistureDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={moistureDelta}
                onChange={(e) => setMoistureDelta(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>-30% (Dry)</span>
                <span>Normal</span>
                <span>+30% (Moist)</span>
              </div>
            </div>

            {/* Water Availability Toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Irrigation / Water Availability
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {(['low', 'medium', 'high'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWaterAvail(mode)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                      waterAvail === mode
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Simulations run through the Field Shift AI physiological model, assessing species root depth, heat resistance, and water demand.
            </p>
          </div>
        </div>

        {/* Simulation Output Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Strategy Resilience Comparison</span>
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />}
            </h2>
            <span className="text-xs text-slate-500">
              Evaluated against 4 Rotation Approaches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulation?.scenarios.map((scen) => {
              const isBase = scen.is_baseline;
              const isPositive = scen.score_change >= 0;
              const riskColor = scen.risk_level === 'High'
                ? 'bg-red-50 text-red-700 border-red-200'
                : scen.risk_level === 'Moderate'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={scen.strategy_id}
                  className={`bg-white rounded-2xl border p-5 transition shadow-xs hover:shadow-md ${
                    isBase ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      {isBase ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 mb-1">
                          Current Baseline
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
                          Adaptive Alternative
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {scen.title}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${riskColor}`}>
                      {scen.risk_level} Risk
                    </span>
                  </div>

                  {/* Score Delta Display */}
                  <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Baseline Score</p>
                      <p className="text-base font-extrabold text-slate-700">{scen.original_score}/100</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Under Stress</p>
                      <p className="text-base font-extrabold text-slate-900">{scen.simulated_score}/100</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Shock Impact</p>
                      <div className="flex items-center gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-base font-extrabold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {scen.score_change > 0 ? `+${scen.score_change}` : scen.score_change}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resilience Narrative */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Agronomic Sensitivity:</p>
                    <p className="leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                      {scen.resilience_summary}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Simulated Performance Index</span>
                      <span className="font-bold text-slate-900">{scen.simulated_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          scen.simulated_score > 75 ? 'bg-emerald-500' : scen.simulated_score > 55 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, scen.simulated_score)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Notice */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">
              💡 {simulation?.notice || "Scenario estimates reflect physiological crop sensitivities under perturbed climate variables."}
            </span>
            <span className="text-[11px] text-slate-600">Decision-Support Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
