import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Satellite, Combine, Brain, FileCheck, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Add Your Field',
      desc: 'Define your agricultural parcel boundary on the interactive Leaflet map or specify center coordinates. The platform calculates exact acreage and sets your geospatial observation envelope.',
      icon: MapPin,
      details: ['Interactive polygon boundary drawer', 'Calculates acreage automatically', 'Supports multiple plots across farms']
    },
    {
      num: '02',
      title: 'Collect Earth Data',
      desc: 'Field Shift automatically queries the NASA POWER API, MODIS Terra NDVI sensors, SMAP root-zone soil moisture models, and GPM precipitation grids for your exact coordinates.',
      icon: Satellite,
      details: ['30-day agroclimatological trends', 'Vegetation health index (VHI) calculations', 'Soil moisture saturation %']
    },
    {
      num: '03',
      title: 'Combine Local Information',
      desc: 'Fuses remote sensing with your farm’s real-world conditions: soil texture (loamy, clay loam, black cotton), irrigation infrastructure, historical crop yields, and planting windows.',
      icon: Combine,
      details: ['Historical crop cycle memory', 'Irrigation efficiency modifiers', 'Soil nutrient baseline tracking']
    },
    {
      num: '04',
      title: 'AI Multi-Objective Analysis',
      desc: 'Our machine learning and agronomic synergy pipeline evaluates dozens of multi-year rotational permutations, matching your customized priority sliders for soil health, water conservation, and profit.',
      icon: Brain,
      details: ['Botanical family pathogen break checks', 'Biological nitrogen balance scoring', 'Drought adaptation ranking']
    },
    {
      num: '05',
      title: 'Actionable Recommendations',
      desc: 'Receive ranked rotation strategies (A, B, C) featuring clear, transparent explanations, side-by-side radar comparison charts, and downloadable sustainability audit reports.',
      icon: FileCheck,
      details: ['Plain-language agronomic explanations', 'Expected benefit breakdown', 'Exportable PDF field sustainability report']
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            Technical Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Field Shift Analyzes Your Farm
          </h1>
          <p className="text-slate-600 text-base">
            A comprehensive 5-step engineering pipeline combining planetary remote sensing with on-farm realities.
          </p>
        </div>

        {/* Steps Walkthrough */}
        <div className="space-y-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-md">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">STEP {st.num}</span>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{st.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{st.desc}</p>
                  
                  <div className="pt-2 flex flex-wrap gap-2">
                    {st.details.map((d, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{d}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center pt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition"
          >
            <span>Launch Decision Engine</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
