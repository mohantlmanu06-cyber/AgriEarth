import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  Globe,
  Droplets,
  Sun,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Mountain,
  Waves,
  Database
} from 'lucide-react';

export const NasaDataPublicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'ndvi' | 'smap' | 'gpm' | 'ecostress' | 'openet' | 'grace' | 'power' | 'srtm' | 'cropscape' | 'ssurgo'
  >('ndvi');

  const layers = [
    {
      id: 'ndvi',
      name: 'Landsat 8/9 & MODIS Normalized Difference Vegetation Index (NDVI)',
      sensor: 'Landsat 8/9 OLI (30m) & MODIS Terra/Aqua (250m)',
      portalUrl: 'https://landsat.gsfc.nasa.gov/',
      resolution: '30m - 250m / 8 to 16-day cadence',
      whatItMeasures: 'Ratio of near-infrared reflectance (cellular plant structure) to red reflectance (absorbed by active chlorophyll).',
      farmerMeaning: 'Tells you how vigorously your crops are growing. Values above 0.7 indicate a dense, healthy leaf canopy; dips below 0.4 signal moisture stress, nutrient chlorosis, or weed competition.',
      fieldShiftUse: 'Validates post-harvest crop residue coverage, identifies vegetative recovery after dry spells, and calibrates yield potential.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'smap',
      name: 'SMAP Root-Zone Soil Moisture (0-50 cm)',
      sensor: 'Soil Moisture Active Passive (SMAP L-Band Radiometer)',
      portalUrl: 'https://smap.jpl.nasa.gov/',
      resolution: '9 km downscaled to 1 km / 2-3 day repeat',
      whatItMeasures: 'Dielectric permittivity of the top 50cm soil column, representing water volume available to root systems.',
      farmerMeaning: 'Direct measure of the subterranean water bank available to plant roots. Eliminates guesswork on whether deeper subsoil is parched.',
      fieldShiftUse: 'Enforces irrigation conservation penalties in the rotation engine; prevents planting high-demand crops into deficit moisture beds.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'gpm',
      name: 'GPM IMERG Global Precipitation Radar',
      sensor: 'Global Precipitation Measurement Dual-Frequency Radar',
      portalUrl: 'https://gpm.nasa.gov/',
      resolution: '0.1° (~10 km) / 30-min to daily cadence',
      whatItMeasures: 'Satellite microwave radar precipitation accumulation calibrated against international ground gauge networks.',
      farmerMeaning: 'Actual rainfall received on your field, even if the nearest government weather station is dozens of miles away.',
      fieldShiftUse: 'Calculates 30-day cumulative precipitation anomalies and projects rain reliability for rainfed crop rotations.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'ecostress',
      name: 'ECOSTRESS Evaporative Stress & Thermal Temperature',
      sensor: 'NASA ECOSTRESS (International Space Station Thermal Radiometer)',
      portalUrl: 'https://ecostress.jpl.nasa.gov/',
      resolution: '70m spatial resolution / 1-5 day revisit',
      whatItMeasures: 'High-resolution land surface skin temperature and canopy evaporative stress index (ESI).',
      farmerMeaning: 'Flags midday thermal pulses before plants visibly wilt. When roots run out of moisture, leaves stop cooling by transpiration and overheat.',
      fieldShiftUse: 'Warns of pollination-window heat stress and triggers recommendations for heat-tolerant millets or legumes.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'openet',
      name: 'OpenET Field-Scale Evapotranspiration',
      sensor: 'OpenET Consortium (NASA / USGS / DRI / USDA)',
      portalUrl: 'https://openetdata.org/',
      resolution: '30m spatial resolution / Daily & monthly data',
      whatItMeasures: 'Consumptive water use across individual farm fields using multi-satellite surface energy balance models.',
      farmerMeaning: 'Tells you exactly how many inches of water your crop consumed versus what evaporated from bare soil.',
      fieldShiftUse: 'Balances crop water demand against available irrigation quotas and rewards water-saving rotation sequences.',
      status: 'Active Partner Pipeline'
    },
    {
      id: 'grace',
      name: 'GRACE & GRACE-FO Regional Groundwater Storage',
      sensor: 'NASA / GFZ Gravity Recovery and Climate Experiment Follow-On',
      portalUrl: 'https://gracefo.jpl.nasa.gov/',
      resolution: '0.5° (~50 km) / Monthly gravimetric solution',
      whatItMeasures: 'Changes in Earth’s gravitational field driven by regional groundwater depletion and aquifer storage variations.',
      farmerMeaning: 'Reveals whether the local aquifer feeding your tube wells or irrigation canals is declining over multi-year horizons.',
      fieldShiftUse: 'Enables long-term rotation resilience by nudging farms toward low-water-duty crops during multi-year groundwater deficit phases.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'power',
      name: 'NASA POWER Agroclimatology & Solar Energy',
      sensor: 'NASA Langley Research Center POWER API',
      portalUrl: 'https://power.larc.nasa.gov/',
      resolution: '0.5° grid / Multi-decade historical archive',
      whatItMeasures: 'All-sky solar irradiance, relative humidity, dew point, air temperature profiles, and Growing Degree Days (GDD).',
      farmerMeaning: 'Determines crop thermal heat units, photosynthesis potential, and optimum planting windows.',
      fieldShiftUse: 'Powers the core rotation suitability algorithm and multi-year economic scenario forecasts.',
      status: 'Active NASA Pipeline'
    },
    {
      id: 'srtm',
      name: 'SRTM 30m Digital Elevation Model (DEM)',
      sensor: 'NASA Shuttle Radar Topography Mission',
      portalUrl: 'https://www2.jpl.nasa.gov/srtm/',
      resolution: '30m (1 arc-second) global elevation',
      whatItMeasures: 'High-precision surface topography, terrain slope percentage, and watershed drainage flow lines.',
      farmerMeaning: 'Identifies slope-driven soil runoff, washouts, and field depression areas where waterlogging kills roots.',
      fieldShiftUse: 'Recommends erosion-control cover crops (e.g., rye, clover) and contoured strip cropping for high-slope parcels.',
      status: 'Verified NASA DEM'
    },
    {
      id: 'cropscape',
      name: 'USDA Cropland Data Layer (CDL) CropScape',
      sensor: 'USDA NASS & Landsat Classification',
      portalUrl: 'https://nassgeodata.gmu.edu/CropScape/',
      resolution: '30m resolution / Annual national cropland census',
      whatItMeasures: 'Historical satellite-classified crop types across every contiguous US agricultural acre.',
      farmerMeaning: 'Verifies past field rotation histories to identify pathogen buildup (e.g., soybean cyst nematodes) and herbicide carryover.',
      fieldShiftUse: 'Enforces agronomic rotation rules (e.g., prohibiting back-to-back nightshades) and tracks legacy nutrient banks.',
      status: 'Active USDA Pipeline'
    },
    {
      id: 'ssurgo',
      name: 'USDA NRCS Web Soil Survey (WSS / SSURGO)',
      sensor: 'USDA NRCS National Cooperative Soil Survey',
      portalUrl: 'https://websoilsurvey.nrcs.usda.gov/',
      resolution: '1:12,000 - 1:24,000 spatial soil polygons',
      whatItMeasures: 'Soil taxonomy, clay/sand texture percentages, Available Water Capacity (AWC), pH, cation exchange, and organic matter.',
      farmerMeaning: 'Tells you your soil’s foundational hydraulic capacity, compaction tendency, and inherent fertility.',
      fieldShiftUse: 'Calibrates fertilizer efficiency models and matches crop root penetration depth to soil profile layers.',
      status: 'Active USDA Pipeline'
    }
  ];

  const currentLayer = layers.find(l => l.id === activeTab) || layers[0];

  return (
    <div className="bg-slate-50 text-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Official Space Apps Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs uppercase tracking-wider border border-sky-400/30">
              <Satellite className="w-3.5 h-3.5" />
              <span>NASA Space Apps Challenge 2026 Resources</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Calibrated to Official Challenge Data Specifications
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Field Shift ingests and fuses 26 authoritative datasets spanning 10 NASA Earth Science missions, 14 USDA and open agricultural archives, and 2 global space agency partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <span>View Official Challenge Resources</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/data-sources"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>All 26 Datasets Catalog</span>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Earth Science Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How NASA Earth Data Powers Field Shift
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            We transform multi-scale public Earth observation data into actionable agricultural intelligence, guiding crop rotation decisions under shifting climate realities.
          </p>
        </div>

        {/* Interactive Layer Explorer Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {layers.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveTab(l.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === l.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {l.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Active Layer Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  href={currentLayer.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 inline-flex items-center gap-1.5 transition"
                >
                  <span>{currentLayer.sensor}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
                <span className="text-xs text-slate-500 font-medium">
                  Resolution: {currentLayer.resolution}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">{currentLayer.name}</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    What It Measures
                  </h4>
                  <p>{currentLayer.whatItMeasures}</p>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    What This Means for Farmers
                  </h4>
                  <p className="text-emerald-900">{currentLayer.farmerMeaning}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    How Field Shift Uses It
                  </h4>
                  <p>{currentLayer.fieldShiftUse}</p>
                </div>
              </div>
            </div>

            {/* Quick Stat Card */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
                <Satellite className="w-4 h-4" />
                <span>API TELEMETRY & STATUS</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Pipeline Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-sm text-white">{currentLayer.status}</span>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-slate-800 pt-3 text-xs text-slate-300">
                <p>• Multi-mission sensor fusion</p>
                <p>• Transparent spatial downscaling warnings</p>
                <p>• Secure server-side proxy cache</p>
                <p>• Direct links to official open science portals</p>
              </div>
              <div className="pt-2 space-y-2">
                <a
                  href={currentLayer.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <span>Official Provider Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  to="/nasa-explorer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
                >
                  <span>Launch Interactive Explorer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
