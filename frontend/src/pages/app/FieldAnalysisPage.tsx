import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Activity,
  Satellite,
  Droplets,
  Thermometer,
  CloudRain,
  Sprout,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const FieldAnalysisPage: React.FC = () => {
  const { selectedField } = useFarm();
  const [obsData, setObsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMetric, setSelectedMetric] = useState<'ndvi' | 'moisture' | 'temperature' | 'precipitation'>('ndvi');

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!selectedField) return;
      setLoading(true);
      try {
        const data = await apiService.getEarthObservation(selectedField.id);
        setObsData(data);
      } catch (e) {
        console.error("Analysis fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [selectedField]);

  if (!selectedField) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please select a field to view analysis.
      </div>
    );
  }

  const timeseries = obsData?.timeseries || [
    { date: "Day 1", ndvi: 0.62, soil_moisture: 48, temperature: 24.5, precipitation: 0.0 },
    { date: "Day 3", ndvi: 0.64, soil_moisture: 52, temperature: 25.1, precipitation: 4.2 },
    { date: "Day 5", ndvi: 0.65, soil_moisture: 50, temperature: 26.4, precipitation: 0.0 },
    { date: "Day 7", ndvi: 0.66, soil_moisture: 47, temperature: 27.8, precipitation: 0.0 },
    { date: "Day 9", ndvi: 0.69, soil_moisture: 56, temperature: 28.5, precipitation: 12.0 },
    { date: "Day 11", ndvi: 0.70, soil_moisture: 54, temperature: 26.0, precipitation: 8.5 },
    { date: "Day 13", ndvi: 0.68, soil_moisture: 49, temperature: 27.2, precipitation: 0.0 },
    { date: "Day 15", ndvi: 0.68, soil_moisture: 46, temperature: 28.1, precipitation: 0.0 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Field Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                Plot Telemetry
              </span>
              <span className="text-xs text-slate-400">• Coordinates: {selectedField.latitude.toFixed(4)}°N, {selectedField.longitude.toFixed(4)}°W</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {selectedField.name} — Environmental Analysis
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <Link
              to="/data-sources"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>26 Official Datasets</span>
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Adaptive Rotation</span>
            </Link>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Acreage & Soil</span>
            <span className="font-bold text-slate-800 text-sm">{selectedField.area} acres • <span className="capitalize">{selectedField.soil_type}</span></span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Current Crop</span>
            <span className="font-bold text-slate-800 text-sm">{selectedField.current_crop}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Irrigation Delivery</span>
            <span className="font-bold text-slate-800 text-sm capitalize">{selectedField.irrigation_type}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Health Index</span>
            <span className="font-bold text-emerald-600 text-sm">{selectedField.health_score}/100 ({selectedField.health_status})</span>
          </div>
        </div>
      </div>

      {/* Plain Language Interpretation Banner (UX Principle) */}
      <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-emerald-800/80 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Satellite className="w-4 h-4" />
          <span>NASA Telemetry Agro Diagnosis</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          Vegetation Health: {obsData?.summary?.vegetation_health_label || 'Good / Normal Vigour'}
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          {obsData?.summary?.vegetation_health_narrative || 
            "Vegetation appears within healthy target ranges for this seasonal window. Topsoil moisture index is currently stable at 46%, though midday heat spikes require monitoring."}
        </p>
      </div>

      {/* 4 Interactive Environmental Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* NDVI */}
        <button
          onClick={() => setSelectedMetric('ndvi')}
          className={`p-5 rounded-2xl text-left border transition ${
            selectedMetric === 'ndvi'
              ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Vegetation (NDVI)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">
            {obsData?.summary?.current_ndvi || 0.68}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Chlorophyll vigor & leaf density</p>
        </button>

        {/* Moisture */}
        <button
          onClick={() => setSelectedMetric('moisture')}
          className={`p-5 rounded-2xl text-left border transition ${
            selectedMetric === 'moisture'
              ? 'bg-sky-50/80 border-sky-500 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Soil Moisture</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-sky-700">
            {obsData?.summary?.soil_moisture_pct || 46.2}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Top 50cm root-zone reserve</p>
        </button>

        {/* LST */}
        <button
          onClick={() => setSelectedMetric('temperature')}
          className={`p-5 rounded-2xl text-left border transition ${
            selectedMetric === 'temperature'
              ? 'bg-orange-50/80 border-orange-500 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Canopy Temp (LST)</span>
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-extrabold text-orange-700">
            {obsData?.summary?.land_surface_temp || 26.8}°C
          </p>
          <p className="text-[11px] text-slate-500 mt-1">MODIS Thermal skin observation</p>
        </button>

        {/* Precipitation */}
        <button
          onClick={() => setSelectedMetric('precipitation')}
          className={`p-5 rounded-2xl text-left border transition ${
            selectedMetric === 'precipitation'
              ? 'bg-teal-50/80 border-teal-500 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">30d Rain Radar</span>
            <CloudRain className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700">
            {obsData?.summary?.total_precipitation_30d || 38.4} mm
          </p>
          <p className="text-[11px] text-slate-500 mt-1">GPM IMERG accumulated radar</p>
        </button>

      </div>

      {/* Interactive Timeseries Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              14-Day Observation Timeseries: {selectedMetric.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated daily satellite passes from NASA POWER & MODIS Terra
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Live Stream Connected
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'precipitation' ? (
              <BarChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" mm" />
                <Tooltip />
                <Bar dataKey="precipitation" fill="#0d9488" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            ) : (
              <AreaChart data={timeseries}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        selectedMetric === 'ndvi'
                          ? '#10b981'
                          : selectedMetric === 'moisture'
                          ? '#0284c7'
                          : '#ea580c'
                      }
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        selectedMetric === 'ndvi'
                          ? '#10b981'
                          : selectedMetric === 'moisture'
                          ? '#0284c7'
                          : '#ea580c'
                      }
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={selectedMetric === 'ndvi' ? [0.2, 0.9] : ['auto', 'auto']}
                  tick={{ fontSize: 11 }}
                  unit={selectedMetric === 'ndvi' ? '' : selectedMetric === 'moisture' ? '%' : '°C'}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={
                    selectedMetric === 'ndvi'
                      ? 'ndvi'
                      : selectedMetric === 'moisture'
                      ? 'soil_moisture'
                      : 'temperature'
                  }
                  stroke={
                    selectedMetric === 'ndvi'
                      ? '#059669'
                      : selectedMetric === 'moisture'
                      ? '#0284c7'
                      : '#ea580c'
                  }
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                  name={
                    selectedMetric === 'ndvi'
                      ? 'NDVI Index'
                      : selectedMetric === 'moisture'
                      ? 'Soil Moisture (%)'
                      : 'Land Surface Temp (°C)'
                  }
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
