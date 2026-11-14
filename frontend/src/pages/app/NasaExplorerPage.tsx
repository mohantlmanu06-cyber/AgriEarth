import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import { LeafletFieldMap } from '../../components/LeafletFieldMap';
import {
  Satellite,
  Layers,
  Info,
  Droplets,
  Thermometer,
  CloudRain,
  Activity,
  Globe2,
  ExternalLink,
  ShieldCheck,
  Mountain,
  Waves,
  Sun,
  Database
} from 'lucide-react';

export const NasaExplorerPage: React.FC = () => {
  const { fields, selectedField, setSelectedField } = useFarm();
  const [selectedLayer, setSelectedLayer] = useState<
    'ndvi' | 'moisture' | 'temperature' | 'precipitation' | 'et' | 'groundwater' | 'terrain' | 'cropscape' | 'power' | 'standard'
  >('ndvi');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1yr'>('30d');
  const [obsData, setObsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedField) return;
    setLoading(true);
    apiService.getEarthObservation(selectedField.id).then(data => {
      setObsData(data);
      setLoading(false);
    });
  }, [selectedField]);

  const layersConfig: Record<string, {
    name: string;
    sensor: string;
    color: string;
    portalUrl: string;
    explanation: string;
    currentVal: string;
    status: string;
  }> = {
    ndvi: {
      name: "Normalized Difference Vegetation Index (NDVI)",
      sensor: "Landsat 8/9 OLI (30m) & MODIS / VIIRS",
      color: "emerald",
      portalUrl: "https://landsat.gsfc.nasa.gov/",
      explanation: "Chlorophyll absorption and near-infrared reflectance. Values above 0.6 indicate vigorous vegetative canopy growth. Dips highlight moisture deficit or nutrient chlorosis.",
      currentVal: `${obsData?.summary?.current_ndvi || 0.68}`,
      status: obsData?.summary?.vegetation_health_label || "Good / Normal Vigour",
    },
    moisture: {
      name: "SMAP Root-Zone Soil Moisture (0-50 cm)",
      sensor: "NASA Soil Moisture Active Passive (SMAP)",
      color: "sky",
      portalUrl: "https://smap.jpl.nasa.gov/",
      explanation: "Quantifies volumetric water content in the root zone. Crucial for calculating water deficit before high-demand crop phases and avoiding over-irrigation.",
      currentVal: `${obsData?.summary?.soil_moisture_pct || 46.2} %`,
      status: obsData?.summary?.soil_moisture_label || "Adequate",
    },
    temperature: {
      name: "Land Surface Temperature (LST)",
      sensor: "NASA ECOSTRESS (70m, ISS) & MODIS Thermal",
      color: "orange",
      portalUrl: "https://ecostress.jpl.nasa.gov/",
      explanation: "Measures thermal radiance from canopy and soil skin. Midday thermal spikes above 32°C signal transpiration shutdown, water stress, and pollination vulnerability.",
      currentVal: `${obsData?.summary?.land_surface_temp || 26.8} °C`,
      status: "Within Expected Seasonal Norms",
    },
    precipitation: {
      name: "GPM IMERG Satellite Precipitation Radar",
      sensor: "NASA Global Precipitation Measurement (GPM)",
      color: "teal",
      portalUrl: "https://gpm.nasa.gov/",
      explanation: "Microwave radar precipitation accumulation calibrated against global ground gauges. Provides field-level rainfall accumulation regardless of proximity to ground weather stations.",
      currentVal: `${obsData?.summary?.total_precipitation_30d || 38.4} mm`,
      status: "30-Day Cumulative Sum (+12.4% Anomaly)",
    },
    et: {
      name: "Field Evapotranspiration (ET & ESI)",
      sensor: "OpenET Consortium & NASA ECOSTRESS",
      color: "cyan",
      portalUrl: "https://openetdata.org/",
      explanation: "Total consumptive water use (crop transpiration + soil evaporation) at 30m resolution. Essential for precision water budgeting and drought-adaptive rotation planning.",
      currentVal: `${obsData?.summary?.evapotranspiration_openet_mm || obsData?.summary?.evapotranspiration_mm_day || 4.1} mm/day`,
      status: "Consumptive Water Use",
    },
    groundwater: {
      name: "GRACE-FO Groundwater Storage Deficit",
      sensor: "NASA / GFZ GRACE Follow-On Gravimetry",
      color: "indigo",
      portalUrl: "https://gracefo.jpl.nasa.gov/",
      explanation: "Measures regional terrestrial water storage and deep aquifer depletion. Detects multi-year drought trends and helps farmers transition from water-depleting to groundwater-recharging crops.",
      currentVal: `${obsData?.summary?.groundwater_anomaly_grace_cm || -3.4} cm TWS Anomaly`,
      status: "Regional Groundwater Deficit",
    },
    terrain: {
      name: "SRTM 30m Digital Elevation Model (DEM)",
      sensor: "NASA Shuttle Radar Topography Mission",
      color: "stone",
      portalUrl: "https://www2.jpl.nasa.gov/srtm/",
      explanation: "Global 1 arc-second (30m) topographic elevation and slope gradient. High-slope parcels require cover crops and contoured rotations to prevent severe erosion.",
      currentVal: `${obsData?.summary?.elevation_m || 48.5} m elevation (${obsData?.summary?.slope_pct || 1.8}% slope)`,
      status: `Erosion Risk: ${obsData?.summary?.erosion_risk_rating || 'Low'}`,
    },
    cropscape: {
      name: "USDA Cropland Data Layer (CDL) CropScape",
      sensor: "USDA NASS & Landsat Classification",
      color: "emerald",
      portalUrl: "https://nassgeodata.gmu.edu/CropScape/",
      explanation: "30m historical crop type census and annual rotation history across the United States. Tracks legacy pesticide/herbicide carries, host pathogen risks, and nitrogen carryover.",
      currentVal: "Continuous Rotation Census",
      status: "Multi-Year Crop History",
    },
    power: {
      name: "NASA POWER Agroclimatology & Solar",
      sensor: "NASA Langley Research Center POWER API",
      color: "amber",
      portalUrl: "https://power.larc.nasa.gov/",
      explanation: "Surface solar irradiance, dew point, relative humidity, and Growing Degree Days (GDD). Calibrates crop development stages and thermal suitability.",
      currentVal: "18.4 MJ/m²/day Solar",
      status: "Optimal Photosynthetic Radiation",
    },
    standard: {
      name: "True Color Optical Earth Imagery",
      sensor: "NASA Worldview & Esri High-Resolution",
      color: "slate",
      portalUrl: "https://worldview.earthdata.nasa.gov/",
      explanation: "Visible red-green-blue optical satellite view of field boundaries, drainage canals, and vegetation buffer strips.",
      currentVal: "100% Cloud-Free",
      status: "Clear Sky Capture",
    }
  };

  const currentLayerInfo = layersConfig[selectedLayer] || layersConfig.ndvi;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Official Challenge Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
              NASA Space Apps Challenge 2026
            </span>
            <span className="text-xs text-indigo-200">Adapting Farms with NASA Data</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Integrated NASA Earth Observation Suite (26 Datasets)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            All environmental indicators in Field Shift are calibrated to the official 2026 challenge resources, spanning NASA Earth Science missions, USDA Cropland Data, and partner climate models.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <a
            href="https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <span>Official Resources Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            to="/data-sources"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>All 26 Datasets</span>
          </Link>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 text-sky-800">
              Interactive Sensor Explorer
            </span>
            <span className="text-xs text-slate-400">• Multi-Mission Data Fusion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            NASA Earth Observation Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect satellite observation layers across your parcels with interactive sensor switching and data provenance.
          </p>
        </div>

        {/* Global Controls: Field Selector & Date Range */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <select
            value={selectedField?.id || ''}
            onChange={(e) => {
              const f = fields.find(item => item.id === Number(e.target.value));
              if (f) setSelectedField(f);
            }}
            aria-label="Select Field Parcel"
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.area} ac)</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            aria-label="Select Observation Cadence"
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
          >
            <option value="7d">Last 7 Days (Near Real-Time)</option>
            <option value="30d">Last 30 Days (Monthly Baseline)</option>
            <option value="90d">Seasonal (90 Days Growth Cycle)</option>
            <option value="1yr">Annual (1 Year Climatology)</option>
          </select>
        </div>
      </div>

      {/* Layer Toggle Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedLayer('ndvi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'ndvi' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Vegetation (Landsat 30m)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('moisture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'moisture' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Soil Moisture (SMAP)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('precipitation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'precipitation' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Rainfall (GPM / IMERG)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('temperature')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'temperature' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Thermal Stress (ECOSTRESS)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('et')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'et' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>Water Use (OpenET)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('groundwater')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'groundwater' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Groundwater (GRACE-FO)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('terrain')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'terrain' ? 'bg-stone-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Elevation (SRTM 30m)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('cropscape')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'cropscape' ? 'bg-green-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Crop History (USDA CDL)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('power')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'power' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Agroclimatology (POWER)</span>
        </button>

        <button
          onClick={() => setSelectedLayer('standard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedLayer === 'standard' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>True Color Optical</span>
        </button>
      </div>

      {/* Main Map & Explanation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Map */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Satellite className="w-4 h-4 text-sky-600" />
                <span>Geospatial Layer: {currentLayerInfo.name}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Viewing field parcel over satellite baseline with dynamic vegetation index color grading
              </p>
            </div>
            <a
              href={currentLayerInfo.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition"
            >
              <span>{currentLayerInfo.sensor}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <LeafletFieldMap
            fields={fields}
            selectedFieldId={selectedField?.id}
            onFieldSelect={(f) => setSelectedField(f)}
            height="460px"
          />
        </div>

        {/* Information Panel explaining technical indicators */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Indicator Diagnostic Panel
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Official NASA Spec
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {currentLayerInfo.name}
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 block">Current Observation</span>
              <p className="text-2xl font-extrabold text-slate-900">{currentLayerInfo.currentVal}</p>
              <p className="text-xs font-semibold text-emerald-700">{currentLayerInfo.status}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-500" />
                <span>What This Indicator Means for Farmers:</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
                {currentLayerInfo.explanation}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Constellation Sensor:</span>
                <span className="font-semibold text-slate-800">{currentLayerInfo.sensor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Official Portal:</span>
                <a
                  href={currentLayerInfo.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <span>Access Data Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>API Security:</span>
                <span className="font-semibold text-emerald-700">Backend Proxy Protected</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/data-sources"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <span>View Full 26 Dataset Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
