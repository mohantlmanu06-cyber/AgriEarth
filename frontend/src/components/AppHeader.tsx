import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Bell,
  MapPin,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar }) => {
  const { fields, selectedField, setSelectedFieldId, alerts } = useFarm();
  const { user } = useAuth();
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Mobile trigger & Field Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Field Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setFieldDropdownOpen(!fieldDropdownOpen);
              setAlertsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-normal hidden sm:inline">Active Field:</span>
            <span className="max-w-[140px] sm:max-w-[190px] truncate">
              {selectedField?.name || 'Select Field'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {fieldDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Switch Field
                </span>
                <Link
                  to="/add-field"
                  onClick={() => setFieldDropdownOpen(false)}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  + Add New
                </Link>
              </div>

              <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                {fields.map((f) => {
                  const isCurrent = f.id === selectedField?.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFieldId(f.id);
                        setFieldDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {f.area} ac • {f.current_crop}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          f.health_status === 'healthy'
                            ? 'bg-emerald-100 text-emerald-700'
                            : f.health_status === 'moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {f.health_score}/100
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick actions, Alerts bell, User badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/planner"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Rotation</span>
        </Link>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setAlertsOpen(!alertsOpen);
              setFieldDropdownOpen(false);
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 relative transition"
            aria-label="View agro alerts"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Environmental & Crop Alerts ({alerts.length})
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {alerts.map((al) => (
                  <div key={al.id} className="py-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          al.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : al.severity === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {al.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">{al.created_at}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{al.title}</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{al.message}</p>
                    <p className="text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg text-[11px] font-medium border border-emerald-100">
                      💡 {al.action_recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile preview */}
        <Link
          to="/settings"
          className="flex items-center gap-2 pl-2 border-l border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-semibold text-slate-800 block leading-tight">
              {user?.name || 'Sarah Jenkins'}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              {selectedField?.farm_name || 'Green Horizon Farm'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
