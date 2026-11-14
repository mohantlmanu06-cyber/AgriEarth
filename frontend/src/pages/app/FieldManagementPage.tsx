import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Activity,
  ArrowRight,
  Droplet,
  Trash2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const FieldManagementPage: React.FC = () => {
  const { fields, setSelectedField } = useFarm();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredFields = fields.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.current_crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.health_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAndNavigate = (field: any, path: string) => {
    setSelectedField(field);
    navigate(path);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Field Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your registered agricultural plots, inspect NASA telemetry, and plan rotations.
          </p>
        </div>

        <Link
          to="/add-field"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Field</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by plot name or crop..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Filter by Health:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Fields ({fields.length})</option>
            <option value="healthy">Healthy Only</option>
            <option value="moderate">Moderate Only</option>
            <option value="stressed">Stressed Only</option>
          </select>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => {
          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let dotColor = 'bg-emerald-500';
          if (field.health_status === 'moderate') {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
            dotColor = 'bg-amber-500';
          } else if (field.health_status === 'stressed') {
            badgeColor = 'bg-red-100 text-red-800 border-red-300';
            dotColor = 'bg-red-500';
          }

          return (
            <div
              key={field.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{field.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{field.farm_name || 'Green Horizon Farm'}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span>{field.health_score}/100</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Area</span>
                    <span className="font-bold text-slate-800">{field.area} acres</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Current Crop</span>
                    <span className="font-bold text-slate-800">{field.current_crop}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Soil Texture</span>
                    <span className="font-bold text-slate-800 capitalize">{field.soil_type.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Irrigation</span>
                    <span className="font-bold text-slate-800 capitalize">{field.irrigation_type}</span>
                  </div>
                </div>

                {field.crop_history && field.crop_history.length > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Past Crops: </span>
                    {field.crop_history.map(c => `${c.crop} ('${String(c.year).slice(-2)})`).join(' → ')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSelectAndNavigate(field, '/field-analysis')}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Telemetry</span>
                </button>

                <button
                  onClick={() => handleSelectAndNavigate(field, '/planner')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Rotation</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
