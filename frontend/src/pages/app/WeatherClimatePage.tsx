import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sun,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export const WeatherClimatePage: React.FC = () => {
  const { selectedField } = useFarm();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedField) return;
    setLoading(true);
    apiService.getWeather(selectedField.id).then(data => {
      setWeatherData(data);
      setLoading(false);
    });
  }, [selectedField]);

  const monthlyRainfall = weatherData?.historical_climate?.monthly_rainfall || [
    { month: "Jan", rainfall_mm: 18, historical_avg: 22, anomaly: -4 },
    { month: "Feb", rainfall_mm: 24, historical_avg: 25, anomaly: -1 },
    { month: "Mar", rainfall_mm: 35, historical_avg: 30, anomaly: 5 },
    { month: "Apr", rainfall_mm: 48, historical_avg: 55, anomaly: -7 },
    { month: "May", rainfall_mm: 72, historical_avg: 70, anomaly: 2 },
    { month: "Jun", rainfall_mm: 140, historical_avg: 130, anomaly: 10 },
    { month: "Jul", rainfall_mm: 210, historical_avg: 225, anomaly: -15 },
    { month: "Aug", rainfall_mm: 185, historical_avg: 190, anomaly: -5 },
    { month: "Sep", rainfall_mm: 120, historical_avg: 115, anomaly: 5 },
    { month: "Oct", rainfall_mm: 45, historical_avg: 50, anomaly: -5 },
    { month: "Nov", rainfall_mm: 15, historical_avg: 18, anomaly: -3 },
    { month: "Dec", rainfall_mm: 12, historical_avg: 15, anomaly: -3 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 text-sky-800">
            Agrometeorology & Climatology
          </span>
          <span className="text-xs text-slate-400">• Field: {selectedField?.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Weather & Climate Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Hyper-local weather telemetry, 7-day agricultural forecasts, historical anomaly tracking, and risk indexes.
        </p>
      </div>

      {/* 13. CURRENT WEATHER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Temperature</span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {weatherData?.current?.temperature || 27.4}°C
          </p>
          <p className="text-[11px] text-slate-500">Feels like {weatherData?.current?.apparent_temperature || 28.6}°C</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {weatherData?.current?.humidity || 58}%
          </p>
          <p className="text-[11px] text-slate-500">Dewpoint 18.2°C</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Current Rain</span>
            <CloudRain className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {weatherData?.current?.precipitation || 0.0} <span className="text-xs text-slate-400 font-normal">mm/h</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">No rainfall currently</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Wind Speed</span>
            <Wind className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {weatherData?.current?.wind_speed || 12.0} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </p>
          <p className="text-[11px] text-slate-500">Light breeze (NW)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Sky Condition</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            {weatherData?.current?.condition || 'Partly Cloudy'}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold">Clear spray window</p>
        </div>

      </div>

      {/* 7-Day Agricultural Forecast */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>7-Day Agricultural Field Forecast</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(weatherData?.forecast || []).map((day: any, i: number) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl text-center border space-y-2 ${
                i === 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              <p className="text-xs font-bold text-slate-700">{day.date}</p>
              <div className="text-sm font-extrabold text-slate-900">
                {day.temp_max}° <span className="text-xs font-normal text-slate-400">/ {day.temp_min}°</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{day.condition}</p>
              <div className="text-[10px] text-sky-700 bg-sky-100/70 py-0.5 rounded-md font-semibold">
                💧 {day.precipitation}mm ({day.precip_prob}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 13. FUTURE RISK INDICATORS (Low, Moderate, High badges) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Seasonal Climate Risk Assessment for {selectedField?.name}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Heatwave Stress</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                🟡 Moderate Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mid-day peak canopy temperatures projected to reach 33°C during flowering. Maintain moisture buffers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Drought Vulnerability</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                🟢 Low Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Root-zone soil moisture is currently supported by recent 38mm precipitation events.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Fungal Humidity Window</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                🟡 Moderate Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Relative humidity exceeding 75% in morning hours may encourage leaf rust or powdery mildew spores.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Unseasonal Frost</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                🟢 Low Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nighttime minima remaining above 17°C throughout the 14-day projection window.
            </p>
          </div>

        </div>
      </div>

      {/* 13. HISTORICAL CLIMATE CHARTS (Monthly Rainfall & Anomalies) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Annual Monthly Rainfall vs 10-Year Historical Baseline & Anomalies
          </h3>
          <p className="text-xs text-slate-500">
            Helps farmers detect whether regional rainfall shifts require switching from thirsty crops to resilient millets/pulses.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRainfall}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" mm" />
              <Tooltip />
              <Legend />
              <Bar dataKey="rainfall_mm" fill="#0284c7" name="Observed Rainfall (mm)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="historical_avg" fill="#94a3b8" name="10-Year Avg (mm)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
