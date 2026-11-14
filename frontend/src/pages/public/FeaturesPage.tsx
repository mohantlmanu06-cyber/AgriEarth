import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Repeat,
  Satellite,
  Sprout,
  CloudSun,
  ShieldAlert,
  Sliders,
  FileText,
  Layers,
  BarChart4,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'Adaptive Multi-Year Rotation Planner',
      desc: 'Formulate 2, 3, 4, or 5-year crop rotation sequences tailored to your field’s soil condition and water availability.',
      icon: Repeat,
      tag: 'Core Feature'
    },
    {
      title: 'Explainable AI Agronomic Engine',
      desc: 'Transparently explains why a rotation was chosen, detailing nitrogen fixation gains, root depth alternating benefits, and disease cycle disruptions.',
      icon: Sparkles,
      tag: 'AI Decision Support'
    },
    {
      title: 'NASA Earth Observation Sync',
      desc: 'Continuous tracking of MODIS NDVI, Land Surface Temperature, SMAP root-zone soil moisture, and GPM precipitation radar.',
      icon: Satellite,
      tag: 'NASA Data'
    },
    {
      title: 'Farmer Priority Tuning Sliders',
      desc: 'Directly weight recommendation scores based on your immediate farm goals: Profitability, Soil Rehabilitation, Water Conservation, Climate Resilience, or Low Risk.',
      icon: Sliders,
      tag: 'Personalization'
    },
    {
      title: 'Comprehensive Soil Health Diagnosis',
      desc: 'Multi-parameter soil scorecard analyzing organic matter %, pH neutrality, N-P-K nutrient status, and volumetric water retention.',
      icon: Sprout,
      tag: 'Soil Science'
    },
    {
      title: 'Live Weather & 7-Day Agro Forecast',
      desc: 'Precipitation probability, heatwave alerts, humidity triggers for fungal sporulation, and historical climate anomaly charts.',
      icon: CloudSun,
      tag: 'Agrometeorology'
    },
    {
      title: 'Interactive Field Boundary Mapping',
      desc: 'Draw custom polygons on Leaflet satellite maps or enter GPS coordinates to visualize health color coding across multiple plots.',
      icon: Layers,
      tag: 'Geospatial'
    },
    {
      title: 'Field Sustainability PDF Reports',
      desc: 'Export executive-level sustainability audits with satellite benchmarks, projected water savings, and soil improvement trajectories.',
      icon: FileText,
      tag: 'Audit Ready'
    },
    {
      title: 'Early Warning Agro Alerts',
      desc: 'Automated warnings for impending drought stress, extreme thermal peaks, and favorable biological planting windows.',
      icon: ShieldAlert,
      tag: 'Proactive'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Features Built for Resilient Farming
          </h1>
          <p className="text-slate-600 text-base">
            Every tool in Field Shift is engineered to make satellite science practical, explainable, and profitable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
          >
            <span>Explore Live Features in Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
