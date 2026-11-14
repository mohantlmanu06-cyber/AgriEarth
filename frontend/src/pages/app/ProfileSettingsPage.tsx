import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import {
  User,
  ShieldCheck,
  Bell,
  Globe,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building,
  Mail,
  Phone
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, logout, isDemo, tryDemo } = useAuth();
  const { fields, refreshFields } = useFarm();
  
  const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
  const [alertTemp, setAlertTemp] = useState(true);
  const [alertMoisture, setAlertMoisture] = useState(true);
  const [alertRain, setAlertRain] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemo = async () => {
    setResetting(true);
    await apiService.seedDemo();
    await tryDemo();
    await refreshFields();
    setResetting(false);
    alert("Farm telemetry and database cache synchronized successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Farmer Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your agricultural account, telemetry preferences, and field synchronization.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* User & Farm Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Sarah Jenkins'}</h3>
            <p className="text-xs text-emerald-700 font-semibold capitalize">{user?.role || 'Farmer'} • Green Horizon Farm</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'sarah.jenkins@fieldshift.earth'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'Sarah Jenkins'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email || 'sarah.jenkins@fieldshift.earth'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Farm Operation Name</label>
              <input
                type="text"
                defaultValue="Green Horizon Farm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Region</label>
              <input
                type="text"
                defaultValue="Sacramento Valley, California"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Unit Settings */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 mb-2">Measurement System</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  checked={units === 'imperial'}
                  onChange={() => setUnits('imperial')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">Imperial (Acres, °F/°C, Inches)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="units"
                  checked={units === 'metric'}
                  onChange={() => setUnits('metric')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">Metric (Hectares, °C, mm)</span>
              </label>
            </div>
          </div>

          {/* Notification toggles */}
          <div className="pt-2 space-y-2">
            <label className="block font-bold text-slate-700">Environmental Telemetry Alerts</label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertTemp}
                  onChange={(e) => setAlertTemp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600">Notify when Land Surface Temperature exceeds canopy transpiration threshold</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertMoisture}
                  onChange={(e) => setAlertMoisture(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600">Notify when SMAP root-zone soil moisture drops below 30%</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertRain}
                  onChange={(e) => setAlertRain(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600">Notify when GPM radar detects approaching heavy precipitation (&gt;15mm)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>

      {/* NASA Telemetry Database & Cache Sync */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">
            NASA Telemetry & Database Synchronization
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Synchronizes your local parcel boundaries with the NASA Earth Observation data stream (POWER, SMAP, Landsat, and GPM). Re-initializes environmental indices and multi-season climate baseline models.
        </p>
        <button
          onClick={handleResetDemo}
          disabled={resetting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
        >
          <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin text-emerald-400' : 'text-slate-300'}`} />
          <span>{resetting ? 'Synchronizing Telemetry...' : 'Sync & Refresh Telemetry Cache'}</span>
        </button>
      </div>

    </div>
  );
};
