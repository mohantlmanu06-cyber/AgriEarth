import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Satellite, Globe, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/80">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">Field Shift</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered agricultural decision-support platform empowering farmers to formulate climate-adaptive crop rotations using NASA Earth observations and local soil intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Satellite className="w-4 h-4 text-sky-400" />
              <span>NASA POWER • MODIS • SMAP • GPM</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/dashboard" className="hover:text-white transition">Farmer Dashboard</Link></li>
              <li><Link to="/planner" className="hover:text-white transition">Crop Rotation Planner</Link></li>
              <li><Link to="/nasa-explorer" className="hover:text-white transition">NASA Earth Observation</Link></li>
              <li><Link to="/soil-health" className="hover:text-white transition">Soil Health Scoring</Link></li>
              <li><Link to="/weather-climate" className="hover:text-white transition">Weather & Climate Risk</Link></li>
              <li><Link to="/crops" className="hover:text-white transition">Crop Database</Link></li>
            </ul>
          </div>

          {/* Scientific Methodology */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Earth Observations
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/nasa-data" className="hover:text-white transition">MODIS Normalized Vegetation (NDVI)</Link></li>
              <li><Link to="/nasa-data" className="hover:text-white transition">Land Surface Temperature (LST)</Link></li>
              <li><Link to="/nasa-data" className="hover:text-white transition">SMAP Root Zone Soil Moisture</Link></li>
              <li><Link to="/nasa-data" className="hover:text-white transition">GPM IMERG Rainfall Radar</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Agronomic Synergy Algorithms</Link></li>
            </ul>
          </div>

          {/* Public & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Audience & Purpose
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed specifically for smallholder and commercial farmers, agricultural extension advisors, environmental researchers, and agronomy students.
            </p>
            <div className="p-3 rounded-xl bg-emerald-900/50 border border-emerald-800/60 text-[11px] text-emerald-200">
              💡 <strong>Farmer First Principle:</strong> Translating raw satellite numbers (e.g. NDVI = 0.63) into intuitive crop health actions.
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Field Shift Platform. Built with NASA Earth Data for Resilient Agriculture.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition">About</Link>
            <Link to="/features" className="hover:text-slate-300 transition">Features</Link>
            <Link to="/contact" className="hover:text-slate-300 transition">Contact Support</Link>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Global Agro Climatology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
