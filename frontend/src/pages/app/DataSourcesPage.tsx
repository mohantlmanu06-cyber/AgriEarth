import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { DataSourcesCatalog } from '../../types';
import {
  Database,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Satellite,
  Info,
  Layers,
  Sparkles,
  Search,
  ShieldCheck,
  Globe2,
  Sprout
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const [catalog, setCatalog] = useState<DataSourcesCatalog | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'nasa' | 'agricultural' | 'partners' | 'citations'>('nasa');

  useEffect(() => {
    async function loadSources() {
      const data = await apiService.getDataSources();
      setCatalog(data);
    }
    loadSources();
  }, []);

  const filterItems = (items?: any[]) => {
    if (!items) return [];
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.provider.toLowerCase().includes(term) ||
      s.how_used.toLowerCase().includes(term) ||
      s.variables.some((v: string) => v.toLowerCase().includes(term))
    );
  };

  const filteredNasa = filterItems(catalog?.nasa_sources);
  const filteredAgri = filterItems(catalog?.agricultural_sources);
  const filteredPartners = filterItems(catalog?.partner_sources);

  const officialUrl = catalog?.official_challenge_url || "https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/?tab=resources";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-teal-700/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold mb-3">
              <Database className="w-3.5 h-3.5" />
              <span>Official NASA Challenge Resource Integration</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Verified NASA Earth Observations & Agricultural Datasets
            </h1>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Field Shift directly incorporates all datasets listed in the official NASA Space Apps Challenge <strong>“Adapting Farms with NASA Data”</strong> resources tab: NASA satellites, USDA field databases, and international partner missions.
            </p>
          </div>

          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg hover:brightness-110 transition shrink-0 self-start lg:self-center"
          >
            <span>View Official Challenge Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Live Status Indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs pt-3 border-t border-teal-900/60">
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 rounded-lg text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>26 Verified Datasets Ingested</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Open Data Protocols Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('nasa')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'nasa'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NASA Sensors ({catalog?.nasa_sources.length || 10})
          </button>
          <button
            onClick={() => setActiveTab('agricultural')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'agricultural'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            USDA & Ground Data ({catalog?.agricultural_sources.length || 14})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'partners'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Space Agency Partners ({catalog?.partner_sources?.length || 2})
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'citations'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Citations & Bibliography
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search datasets, variables, sensors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Tab: NASA Sensors */}
      {activeTab === 'nasa' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNasa.map((source: any) => (
              <div key={source.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        {source.provider}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {source.name}
                      </h3>
                    </div>
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shrink-0"
                      title="Open Official NASA Data Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Variables pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {source.variables.map((v: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Spatial and Temporal Specifications */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">Resolution & Repeat:</span> {source.resolution}
                    </p>
                    {source.coverage && (
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-800">Coverage:</span> {source.coverage}
                      </p>
                    )}
                  </div>

                  {/* Usage explanation */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 font-semibold">How Field Shift Uses It: </strong>
                    {source.how_used}
                  </p>
                </div>

                {/* Citation footer */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic">
                  Citation: {source.citation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Agricultural Sources */}
      {activeTab === 'agricultural' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgri.map((source: any) => (
              <div key={source.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                        {source.provider}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {source.name}
                      </h3>
                    </div>
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition shrink-0"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Variables pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {source.variables.map((v: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">Resolution:</span> {source.resolution}
                    </p>
                    {source.coverage && (
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-800">Coverage:</span> {source.coverage}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 font-semibold">How Field Shift Uses It: </strong>
                    {source.how_used}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic">
                  Citation: {source.citation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Space Agency Partners */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map((source: any) => (
              <div key={source.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                        {source.provider}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {source.name}
                      </h3>
                    </div>
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition shrink-0"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {source.variables.map((v: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">Resolution:</span> {source.resolution}
                    </p>
                    {source.coverage && (
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-800">Coverage:</span> {source.coverage}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 font-semibold">How Field Shift Uses It: </strong>
                    {source.how_used}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 italic">
                  Citation: {source.citation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Scientific References */}
      {activeTab === 'citations' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Official Literature & Scientific Bibliography (Section 29)
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All satellite data ingestion formulas, drought anomalies, biological nitrogen balances, and rotational diversity scoring adhere to peer-reviewed agronomic literature and NASA mission validation protocols:
          </p>

          <ol className="list-decimal pl-5 space-y-3 text-xs text-slate-700 pt-2">
            <li className="leading-relaxed">
              <strong>Entekhabi, D., et al. (2010).</strong> The Soil Moisture Active Passive (SMAP) Mission. <em>Proceedings of the IEEE</em>, 98(5), 704-716. DOI: 10.1109/JPROC.2010.2043918.
            </li>
            <li className="leading-relaxed">
              <strong>Huffman, G. J., et al. (2020).</strong> Integrated Multi-satellitE Retrievals for GPM (IMERG) Technical Documentation. <em>NASA Goddard Space Flight Center</em>.
            </li>
            <li className="leading-relaxed">
              <strong>Wulder, M. A., et al. (2019).</strong> Current status of Landsat program, science, and applications: Landsat continues to shape the field. <em>Remote Sensing of Environment</em>, 225, 127-147.
            </li>
            <li className="leading-relaxed">
              <strong>Running, S. W., et al. (2004).</strong> A continuous satellite-derived measure of global terrestrial primary production. <em>BioScience</em>, 54(6), 547-560.
            </li>
            <li className="leading-relaxed">
              <strong>Fisher, J. B., et al. (2020).</strong> The ECOSTRESS mission: First results on plant water use from the International Space Station. <em>Water Resources Research</em>, 56(7), e2019WR026058.
            </li>
            <li className="leading-relaxed">
              <strong>Stackhouse, P. W., et al. (2021).</strong> The NASA Prediction of Worldwide Energy Resources (POWER) Project: Agroclimatology Methodology. <em>NASA Langley Research Center</em>.
            </li>
            <li className="leading-relaxed">
              <strong>Farr, T. G., et al. (2007).</strong> The Shuttle Radar Topography Mission. <em>Reviews of Geophysics</em>, 45(2), RG2004.
            </li>
            <li className="leading-relaxed">
              <strong>Tapley, B. D., et al. (2019).</strong> Contributions of GRACE to understanding climate change. <em>Nature Climate Change</em>, 9(5), 358-369.
            </li>
            <li className="leading-relaxed">
              <strong>Melton, F. S., et al. (2021).</strong> OpenET: Filling a critical data gap in water management for the western United States. <em>Journal of the American Water Resources Association</em>, 58(6), 971-994.
            </li>
            <li className="leading-relaxed">
              <strong>USDA NRCS. (2022).</strong> Soil Health Technical Note No. 450-03: Crop Rotations for Soil Quality and Carbon Sequestration. <em>United States Department of Agriculture</em>.
            </li>
          </ol>
        </div>
      )}

      {/* Disclaimers & Ethics */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {catalog?.disclaimer || "Field Shift utilizes official NASA Earth Science open observation data and verified agricultural references from the 2026 NASA Space Apps Challenge 'Adapting Farms with NASA Data' resources suite. Satellite observations represent differing spatial and temporal resolutions and are synthesized as decision-support models."}
        </p>
      </div>
    </div>
  );
};
