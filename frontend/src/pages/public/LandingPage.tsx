import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Satellite,
  Sprout,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Droplet,
  Sun,
  ShieldAlert,
  Wind,
  Layers,
  CheckCircle2,
  BarChart3,
  Globe2,
  Calendar,
  Compass,
  FileCheck,
  ChevronRight,
  Flame,
  CloudRain,
  Activity,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { tryDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await tryDemo();
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* 5. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Animated Background Grids & Orbs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Satellite className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Powered by NASA Earth Observation & Agro-AI</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Field Shift
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-300">
                Adapting Farms with NASA Earth Data
              </h2>

              <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Turn satellite observations, soil information, climate conditions, and crop knowledge into smarter crop rotation decisions.
              </p>

              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs italic flex items-center gap-2 max-w-xl">
                <span>🚀 “We don't need to travel to another world to find a challenge worthy of exploration. The mission is here.” — NASA Space Apps Challenge 2026</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleDemo}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Analyze My Farm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/nasa-data"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/40 text-white font-semibold text-base shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Satellite className="w-5 h-5 text-sky-400" />
                  <span>Explore NASA Data</span>
                </Link>

                <button
                  onClick={handleDemo}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-semibold text-base flex items-center justify-center gap-2 transition"
                >
                  <span>Quick Start</span>
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/40 text-left">
                <div>
                  <p className="text-2xl font-extrabold text-white">35%</p>
                  <p className="text-xs text-emerald-300/80 font-medium">Avg. Water Conserved</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">+45 kg/ha</p>
                  <p className="text-xs text-emerald-300/80 font-medium">Biological N Recharged</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">26 Datasets</p>
                  <p className="text-xs text-emerald-300/80 font-medium">10 NASA Missions & USDA</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual (Satellite Imagery + Environmental Visualizer) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-900/80 to-slate-900/90 border border-emerald-500/40 p-2 shadow-2xl backdrop-blur-xl">
                  {/* Mock Satellite Canvas */}
                  <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                      alt="Agricultural field viewed from satellite"
                      className="w-full h-full object-cover opacity-80 filter contrast-125"
                    />

                    {/* Gradient Overlay for NASA aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Simulated Field Polygon boundary */}
                    <div className="absolute top-12 left-10 right-14 bottom-16 border-2 border-dashed border-emerald-400 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                      <div className="text-center p-3 bg-emerald-950/90 rounded-xl border border-emerald-500/50 shadow-xl">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase mb-1">
                          Field Active
                        </span>
                        <p className="text-white font-bold text-sm">North Meadow • 48.0 ac</p>
                        <p className="text-emerald-300 text-xs">NDVI: 0.72 (Vibrant Canopy)</p>
                      </div>
                    </div>

                    {/* Live Satellite HUD Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] text-sky-300 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>MODIS TERRA ORBIT 4821</span>
                    </div>

                    {/* Float Badge 1: Soil Moisture */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/40 text-xs shadow-lg flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] leading-tight">Soil Moisture</p>
                        <p className="font-bold text-white text-xs">46.2% Adequate</p>
                      </div>
                    </div>

                    {/* Float Badge 2: AI Recommendation preview */}
                    <div className="absolute bottom-3 right-3 bg-emerald-950/90 backdrop-blur-md p-2.5 rounded-xl border border-amber-400/50 text-xs shadow-lg flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-amber-300 text-[10px] leading-tight">AI Strategy A</p>
                        <p className="font-bold text-white text-xs">Rice → Pulses → Maize</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PROBLEM SECTION */}
      <section className="py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider">
              The Agricultural Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Farming Under Rapid Environmental Shifts
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Climate volatility is disrupting generational agricultural schedules. Traditional mono-cropping and static rotations leave fields vulnerable to weather extremes and soil exhaustion.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4">
                🌡️
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Changing Temperatures</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Elevated daytime land surface temperatures accelerate canopy transpiration, stressing cool-season staple crops during flowering phases.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4">
                🌧️
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Changing Rainfall Patterns</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Erratic monsoon delays and unseasonal deluge pulses disrupt seedbed preparation and harvest drying windows across traditional cycles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-2xl mb-4">
                💧
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Water Shortages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aquifer depletion and canal rationing penalize thirsty monocultures like paddy rice and sugarcane without early adaptive crop shifting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-4">
                🌪️
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Extreme Weather</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sudden heat spikes, mid-season flash droughts, and severe wind shear cause crop lodging and irreversible yield loss.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-4">
                🌱
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Declining Soil Health</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consecutive cereal crops leach micronutrients, degrade organic humus carbon below 1.5%, and foster soil-borne fungal pathogens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-4">
                🌾
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Difficult Rotation Decisions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Balancing commercial price stability with water budgeting and soil rejuvenation requires complex multidimensional analysis.
              </p>
            </div>

          </div>

          {/* Visual Transition: Environment -> Data -> AI Analysis -> Better Decisions */}
          <div className="mt-14 bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/80">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-emerald-400 mb-8">
              The Field Shift Solution Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3 font-bold text-lg">
                  1
                </div>
                <h4 className="font-bold text-white text-base">Changing Environment</h4>
                <p className="text-xs text-emerald-200/70 mt-1">Temperature spikes, drought risk & erratic rains</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3 font-bold text-lg">
                  2
                </div>
                <h4 className="font-bold text-white text-base">NASA Earth Data</h4>
                <p className="text-xs text-emerald-200/70 mt-1">Landsat 30m NDVI, SMAP moisture, GPM rain, ECOSTRESS & POWER</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 font-bold text-lg">
                  3
                </div>
                <h4 className="font-bold text-white text-base">AI Analysis</h4>
                <p className="text-xs text-emerald-200/70 mt-1">Agronomic synergy matrices & multi-year optimization</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-800/80 border border-emerald-500/60 flex flex-col items-center text-center shadow-lg">
                <div className="w-12 h-12 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mb-3 font-extrabold text-lg">
                  4
                </div>
                <h4 className="font-bold text-emerald-300 text-base">Better Decisions</h4>
                <p className="text-xs text-emerald-100 mt-1">Climate-resilient, profitable & soil-rehabilitating rotations</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. HOW IT WORKS: 5-STEP WORKFLOW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              5-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How Field Shift Works
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              A frictionless pathway from satellite telemetry to practical on-the-ground planting schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition transform">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Add Your Field</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmer selects or draws their field boundary on an interactive Leaflet map or enters GPS coordinates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition group">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition transform">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Collect Earth Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                System retrieves NASA Earth observations: Landsat 30m NDVI, SMAP root moisture, GPM rainfall radar, and ECOSTRESS thermal LST.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition transform">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Combine Local Info</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fuses local soil composition, crop history, irrigation infrastructure, and custom farmer priority preferences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition group">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition transform">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">AI Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The machine learning engine evaluates multi-year permutations, checking nitrogen balances, root depths, and pathogen breaks.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition group">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition transform">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Get Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore recommended rotation plans with plain-language explanations, composite scores, and quantifiable expected benefits.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleDemo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Experience the 5-Step Demo Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 33. FARMER-FIRST UX PRINCIPLE HIGHLIGHT */}
      <section className="py-16 bg-emerald-950 text-white border-t border-b border-emerald-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-3xl p-8 sm:p-12">
            <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              Core UX Principle
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              No Cryptic Satellite Jargon. Just Actionable Agro Intelligence.
            </h3>
            <p className="text-emerald-100/80 text-sm sm:text-base mt-2 leading-relaxed">
              We believe remote sensing is only valuable if it can be understood in the tractor cabin. Instead of just displaying raw sensor numbers, Field Shift translates them into practical insights:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-red-500/30">
                <span className="text-xs text-red-400 font-mono font-bold block mb-1">
                  ❌ Raw Technical Output
                </span>
                <p className="text-slate-300 font-mono text-sm">
                  NDVI = 0.63 | LST = 34.2°C | SMAP = 24.1%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50">
                <span className="text-xs text-emerald-400 font-semibold block mb-1">
                  ✅ Field Shift Farmer Translation
                </span>
                <p className="text-white font-semibold text-sm">
                  “Vegetation Health: Moderate — Vegetation appears slightly below the healthy range. Topsoil moisture deficit detected. Consider a drought-tolerant pulse rotation.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 34. FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-emerald-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 text-emerald-300 text-xs font-semibold border border-emerald-600/40">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Ready for Resilient Farming?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn Earth Data into Better Farm Decisions
          </h2>

          <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Field Shift combines NASA Earth observations, local field information and AI-powered analysis to help farmers explore more resilient crop rotation strategies.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Start Analyzing</span>
            </button>

            <Link
              to="/nasa-data"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/40 text-white font-semibold text-base transition flex items-center justify-center gap-2"
            >
              <Satellite className="w-5 h-5 text-sky-400" />
              <span>Explore NASA Data</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
