import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { LeafletFieldMap } from '../../components/LeafletFieldMap';
import { apiService } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Satellite,
  Droplets,
  Thermometer,
  CloudRain,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Wind
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { fields, selectedField, setSelectedField, alerts } = useFarm();
  const navigate = useNavigate();

  const [nasaSummary, setNasaSummary] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingNasa, setLoadingNasa] = useState<boolean>(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const totalAcreage = fields.reduce((sum, f) => sum + f.area, 0);
  const avgHealth = fields.length > 0
    ? Math.round(fields.reduce((sum, f) => sum + f.health_score, 0) / fields.length)
    : 78;

  useEffect(() => {
    const fetchEnvData = async () => {
      if (!selectedField) return;
      setLoadingNasa(true);
      try {
        const [nasa, weather] = await Promise.all([
          apiService.getEarthObservation(selectedField.id),
          apiService.getWeather(selectedField.id)
        ]);
        setNasaSummary(nasa);
        setWeatherData(weather);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoadingNasa(false);
      }
    };
    fetchEnvData();
  }, [selectedField]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 9. TOP GREETING & SUMMARY HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Farm Telemetry Synchronized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {getGreeting()}, {user?.name || 'Sarah Jenkins'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Active Plot: <span className="text-white font-semibold">{selectedField?.name || 'All Fields'}</span> • {selectedField?.area || 48} acres ({selectedField?.current_crop || 'Rice'})
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Link
            to="/planner"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Plan Next Rotation</span>
          </Link>
          <Link
            to="/field-analysis"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-600/40 transition"
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>Full Analysis</span>
          </Link>
        </div>
      </div>

      {/* 9. FARM SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Total Fields</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{fields.length}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Monitored by NASA
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Total Acreage</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{totalAcreage.toFixed(1)} <span className="text-xs font-normal text-slate-400">ac</span></p>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Sacramento Valley</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Current Crop</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{selectedField?.current_crop || 'Rice'}</p>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Kharif / Mid-season</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Soil Health Score</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">{avgHealth}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Good Condition</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Water Availability</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {nasaSummary?.summary?.soil_moisture_pct || 46.2}%
          </p>
          <p className="text-[10px] text-sky-600 font-medium mt-1">Adequate Moisture</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Current Weather</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {weatherData?.current?.temperature || 27.4}°C
          </p>
          <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
            {weatherData?.current?.condition || 'Partly Cloudy'}
          </p>
        </div>

      </div>

      {/* 9. ENVIRONMENTAL INDICATORS (Cards + Charts) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Satellite className="w-4 h-4 text-emerald-600" />
            <span>NASA Environmental Indicators for {selectedField?.name || 'Selected Field'}</span>
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/data-sources"
              className="text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
            >
              26 Official Challenge Datasets →
            </Link>
            <span className="text-slate-400 font-medium">Updated 15 mins ago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Card 1: Temperature */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Temperature</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {nasaSummary?.summary?.land_surface_temp || 26.8}°C
            </p>
            <div className="text-[11px] text-slate-500 leading-tight">
              LST Canopy: <span className="font-semibold text-slate-700">Normal range</span>
            </div>
          </div>

          {/* Card 2: Rainfall */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">30d Rainfall</span>
              <CloudRain className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {nasaSummary?.summary?.total_precipitation_30d || 38.4} <span className="text-xs font-normal text-slate-500">mm</span>
            </p>
            <div className="text-[11px] text-slate-500 leading-tight">
              Anomaly: <span className="font-semibold text-emerald-600">+5 mm vs 10yr avg</span>
            </div>
          </div>

          {/* Card 3: Soil Moisture */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Soil Moisture</span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {nasaSummary?.summary?.soil_moisture_pct || 46.2}%
            </p>
            <div className="text-[11px] text-slate-500 leading-tight">
              Root-zone: <span className="font-semibold text-sky-700">Adequate</span>
            </div>
          </div>

          {/* Card 4: Vegetation Health */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Vegetation (NDVI)</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">
              {nasaSummary?.summary?.current_ndvi || 0.68}
            </p>
            <div className="text-[11px] text-slate-500 leading-tight">
              Health: <span className="font-semibold text-emerald-700">Good Vigour</span>
            </div>
          </div>

          {/* Card 5: Water Stress */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Water Stress</span>
              <TrendingUp className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-2xl font-extrabold text-teal-700">Low</p>
            <div className="text-[11px] text-slate-500 leading-tight">
              Evaporative index: <span className="font-semibold text-teal-700">-0.2 SPI</span>
            </div>
          </div>

          {/* Card 6: Weather Risk */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Weather Risk</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <p className="text-2xl font-extrabold text-slate-900">Moderate</p>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight truncate">
              Heatwave pulse mid-week
            </div>
          </div>

        </div>
      </div>

      {/* 9. FIELD MAP SECTION & RECENT ROTATION PLANS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Field Map */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Farm Field Spatial Map</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click any field polygon on the map to switch context and inspect telemetry.
              </p>
            </div>
            <Link
              to="/add-field"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto"
            >
              + Add New Field
            </Link>
          </div>

          <LeafletFieldMap
            fields={fields}
            selectedFieldId={selectedField?.id}
            onFieldSelect={(f) => setSelectedField(f)}
            height="380px"
          />

          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedField(f)}
                className={`p-2.5 rounded-xl text-left border transition ${
                  selectedField?.id === f.id
                    ? 'border-emerald-500 bg-emerald-50/60 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-slate-800">{f.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      f.health_status === 'healthy' ? 'bg-emerald-500' : f.health_status === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{f.area} ac • {f.current_crop}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: AI Quick Recommendation & Alerts */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Top Recommendation Box */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-5 rounded-3xl border border-emerald-800/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950">
                AI Recommendation
              </span>
              <span className="text-xs text-emerald-300 font-bold">Score: 88/100</span>
            </div>

            <div>
              <p className="text-xs text-slate-400">Optimal 3-Year Shift for {selectedField?.name}:</p>
              <h4 className="text-lg font-bold text-white mt-1">
                {selectedField?.current_crop || 'Rice'} → Pulses → Maize
              </h4>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Introducing nitrogen-fixing pulses cuts required fertilizer while restoring +45 kg/ha biological nitrogen. Following with maize yields peak revenue with 35% less irrigation.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-emerald-900/80">
              <div className="text-[11px] text-emerald-300">
                Water Savings: <span className="font-bold text-white">35%</span>
              </div>
              <Link
                to="/planner"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
              >
                <span>Customize Sliders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Field Health Alerts</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 2).map((al) => (
                <div key={al.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{al.title}</span>
                    <span className="text-[9px] font-bold uppercase text-amber-600">{al.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{al.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
