import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useNavigate } from 'react-router-dom';
import { LeafletFieldMap } from '../../components/LeafletFieldMap';
import {
  MapPin,
  Layers,
  Sprout,
  Droplet,
  Calendar,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';

export const AddFieldPage: React.FC = () => {
  const { addNewField } = useFarm();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    area: 25.0,
    soil_type: 'loamy',
    irrigation_type: 'drip',
    latitude: 38.5816,
    longitude: -121.4944,
    current_crop: 'Rice',
    previous_crop_1: 'Wheat',
    previous_crop_2: 'Mustard',
    expected_planting_date: '2026-06-15',
  });

  const [drawnBoundary, setDrawnBoundary] = useState<[number, number][]>([
    [38.5816, -121.4944],
    [38.5850, -121.4900],
    [38.5800, -121.4870],
  ]);

  const [loading, setLoading] = useState(false);

  const handleBoundaryChange = (points: [number, number][]) => {
    setDrawnBoundary(points);
    if (points.length > 0) {
      setFormData(prev => ({
        ...prev,
        latitude: points[0][0],
        longitude: points[0][1],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newFieldData = {
      name: formData.name || "New Agricultural Plot",
      area: Number(formData.area),
      soil_type: formData.soil_type,
      irrigation_type: formData.irrigation_type,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      boundary: (drawnBoundary.length >= 3 ? drawnBoundary : [
        [formData.latitude, formData.longitude],
        [formData.latitude + 0.003, formData.longitude + 0.004],
        [formData.latitude - 0.002, formData.longitude + 0.005],
      ]) as [number, number][],
      current_crop: formData.current_crop,
      health_score: 82,
      health_status: 'healthy' as const,
      crop_history: [
        { id: Date.now(), crop: formData.previous_crop_1, season: 'Kharif', year: 2025 },
        { id: Date.now() + 1, crop: formData.previous_crop_2, season: 'Rabi', year: 2024 },
      ]
    };

    const created = await addNewField(newFieldData);
    setLoading(false);
    navigate('/field-analysis');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Add New Agricultural Field
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Register a new plot to enable automated NASA Earth observation ingestion and AI rotation modeling.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Field Specifications & Agronomic Profile</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Field Name / Plot Identifier</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. East Valley Plot 4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Standing Crop</label>
                <select
                  value={formData.current_crop}
                  onChange={(e) => setFormData({ ...formData, current_crop: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Rice">Rice (Paddy)</option>
                  <option value="Maize">Maize (Corn)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Pulses">Pulses / Chickpea</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Millets">Millets / Sorghum</option>
                  <option value="Vegetables">Vegetables / Fallow</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Soil Texture / Type</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="loamy">Loamy Soil</option>
                  <option value="clay_loam">Clay Loam</option>
                  <option value="sandy_loam">Sandy Loam</option>
                  <option value="black_cotton">Black Cotton Soil</option>
                  <option value="alluvial">Alluvial Soil</option>
                  <option value="red_soil">Red Soil</option>
                  <option value="silt_loam">Silt Loam</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Irrigation Method</label>
                <select
                  value={formData.irrigation_type}
                  onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler System</option>
                  <option value="flood">Flood / Furrow</option>
                  <option value="borewell">Groundwater Borewell</option>
                  <option value="rainfed">Rainfed (No Irrigation)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 mb-1">Previous Crop History (Past 2 Years)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.previous_crop_1}
                  onChange={(e) => setFormData({ ...formData, previous_crop_1: e.target.value })}
                  placeholder="Last year's crop (e.g. Wheat)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  value={formData.previous_crop_2}
                  onChange={(e) => setFormData({ ...formData, previous_crop_2: e.target.value })}
                  placeholder="2 years ago (e.g. Mustard)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 mb-1">Center GPS Coordinates</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Ingesting NASA Telemetry...' : 'Save Field & Fetch Earth Data'}</span>
          </button>
        </div>

        {/* Right Column: Interactive Map Boundary Drawer */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Interactive Field Boundary</span>
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Click map to draw boundary
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Click directly on the satellite map below to place plot boundary corner points. The system uses this polygon to sample NASA MODIS pixels and SMAP soil moisture grids.
          </p>

          <LeafletFieldMap
            fields={[]}
            center={[formData.latitude, formData.longitude]}
            zoom={15}
            height="440px"
            isEditable={true}
            onBoundaryChange={handleBoundaryChange}
          />

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span>Boundary Drawing Instructions:</span>
            </p>
            <p>1. Click 3 or more corners around your crop canopy.</p>
            <p>2. The polygon automatically adjusts and calculates your satellite observation envelope.</p>
            <p>3. Reset points at any time using the "Reset Points" button on the map.</p>
          </div>
        </div>

      </form>

    </div>
  );
};
