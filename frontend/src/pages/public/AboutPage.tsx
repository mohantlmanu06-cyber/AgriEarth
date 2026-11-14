import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Sprout, ShieldCheck, Globe, Users, Award, BookOpen, Target, Sparkles, Rocket, Quote } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            NASA Space Apps Challenge 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Field Shift: Adapting Farms with NASA Data
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Born from the NASA Space Apps Challenge, answering the fundamental planetary question:
            <span className="font-semibold text-emerald-950 block mt-1">
              “Which crop rotation strategy is best for my field under current and changing environmental conditions?”
            </span>
          </p>
        </div>

        {/* NASA Inspiration Hero Quote Box */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span>The NASA Challenge Call to Action</span>
            </div>

            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-emerald-100/95 leading-relaxed italic border-l-4 border-amber-400 pl-6">
              “In a universe filled with worlds, there is one we understand better than any other. And yet, look closer. Even here, the conditions beneath our feet are changing. Heat shifts, rainfall changes, water becomes less certain, soil loses nutrients, and farmers must decide what comes next. But Earth is constantly sending us signals, and NASA's public Earth observation data gives us new ways to listen.
              <br /><br />
              Rainfall, soil moisture, heat, vegetation, water. Different observations, different scales, pieces of the same story. Your mission: turn these observations into a tool that helps explore what could come next. Compare rotations, reveal trade-offs, understand risk, make uncertainty visible.
              <br /><br />
              <strong>We don't need to travel to another world to find a challenge worthy of exploration. The mission is here.</strong>”
            </blockquote>

            {/* Author Attribution from JSC Team */}
            <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-white text-sm">Sadie Burnett Boudro</p>
                <p className="text-emerald-300">Author, NASA Space Apps Challenge • NASA Johnson Space Center (Artemis & Moon Base)</p>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                <span><strong>William Stefanov</strong> (Senior Earth System Scientist, NASA JSC)</span>
                <span>•</span>
                <span><strong>Alex Stoken</strong> (Data Scientist / ML Expert, NASA JSC)</span>
                <span>•</span>
                <span><strong>Mani Deep Gogineni</strong> (Data Solutions Architect, NASA JSC)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <h3 className="text-2xl font-bold text-slate-900">
              Turning Satellite Signals into Farm Actions
            </h3>
            <p>
              NASA's satellite constellation generates petabytes of daily observational data: chlorophyll fluorescence from MODIS, microwave radar rainfall from GPM, dielectric moisture constants from SMAP, and all-sky radiation from NASA POWER.
            </p>
            <p>
              Field Shift transforms these multi-scale observations into an intuitive agricultural decision-support engine. By integrating local soil profiles, botanical crop traits, and the individual farmer’s priorities, our AI ranks adaptive multi-year crop rotations.
            </p>
            <p className="font-medium text-emerald-950 bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80">
              We make uncertainty visible, reveal critical resource trade-offs, and prove that climate-smart farming can be economically rewarding.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80"
              alt="Farmer inspecting crop in field"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Satellite className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">NASA Data Integrity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time agroclimatological feeds from NASA POWER, MODIS Terra/Aqua, SMAP soil moisture, and GPM radar precipitation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Agronomic Synergy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Root depth diversification, biological nitrogen fixation balances, and pest lifecycle disruption matrices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Farmer Sovereignty</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recommendations adapt dynamically to the farmer’s individual priorities: whether maximizing profit, saving water, or healing depleted soils.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
