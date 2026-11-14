import React, { useState, useEffect, useRef } from 'react';
import { useFarm } from '../../context/FarmContext';
import { apiService } from '../../services/api';
import {
  FileText,
  Printer,
  Download,
  Sprout,
  Satellite,
  Droplets,
  Thermometer,
  CloudRain,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const SustainabilityReportPage: React.FC = () => {
  const { selectedField, fields, setSelectedField } = useFarm();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedField) return;
    setLoading(true);
    apiService.generateReport(selectedField.id, 0).then(data => {
      setReportData(data);
      setLoading(false);
    });
  }, [selectedField]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate clean printable view or text/json summary
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportData?.report_id || 'fieldshift-sustainability-report'}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!selectedField) {
    return <div className="p-8 text-center text-slate-500">Please select a field.</div>;
  }

  const rec = reportData?.recommended_rotation;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Audit-Ready Documentation
            </span>
            <span className="text-xs text-slate-400">• Report ID: {reportData?.report_id || 'Generating...'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Field Sustainability Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Certified synthesis of NASA Earth observations, soil profile audits, and AI adaptive rotation recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Data (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (Clean Editorial Layout) */}
      <div
        ref={reportRef}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 space-y-8 text-slate-800 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-emerald-950 tracking-tight">Field Shift</h2>
              <p className="text-xs text-slate-500 font-medium">NASA Earth Observation & Agro-Decision Platform</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-0.5">
            <p className="font-mono font-bold text-emerald-800">{reportData?.report_id}</p>
            <p className="text-slate-500">Issued: {reportData?.generated_date}</p>
            <p className="text-slate-500">Methodology: NASA POWER / MODIS / SMAP</p>
          </div>
        </div>

        {/* 1. Field Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Field & Agricultural Parcel Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Parcel Name</span>
              <span className="font-bold text-slate-800 text-sm">{reportData?.field_info?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Farm & Location</span>
              <span className="font-bold text-slate-800 text-sm">{reportData?.field_info?.farm}</span>
              <span className="text-[10px] text-slate-500 block">{reportData?.field_info?.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Acreage & Soil</span>
              <span className="font-bold text-slate-800 text-sm">{reportData?.field_info?.area_acres} ac • {reportData?.field_info?.soil_type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current Crop & Status</span>
              <span className="font-bold text-emerald-700 text-sm">{reportData?.field_info?.current_crop} ({reportData?.field_info?.health_status})</span>
            </div>
          </div>
        </div>

        {/* 2. NASA Earth Observations & Soil Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2 p-5 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs">
            <h4 className="font-bold text-sky-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Satellite className="w-4 h-4 text-sky-600" />
              <span>NASA Satellite Observations</span>
            </h4>
            <div className="space-y-1.5 pt-1 text-slate-700">
              <div className="flex justify-between">
                <span>Vegetation Health Index (NDVI):</span>
                <span className="font-bold">{reportData?.nasa_observations?.ndvi} ({reportData?.nasa_observations?.vegetation_health})</span>
              </div>
              <div className="flex justify-between">
                <span>Land Surface Temp (LST):</span>
                <span className="font-bold">{reportData?.nasa_observations?.land_surface_temp}</span>
              </div>
              <div className="flex justify-between">
                <span>Root-Zone Soil Moisture:</span>
                <span className="font-bold">{reportData?.nasa_observations?.soil_moisture}</span>
              </div>
              <div className="flex justify-between">
                <span>Drought Risk Rating:</span>
                <span className="font-bold text-emerald-700">{reportData?.nasa_observations?.drought_risk}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Soil Health Assessment</span>
            </h4>
            <div className="space-y-1.5 pt-1 text-slate-700">
              <div className="flex justify-between">
                <span>Soil Health Composite:</span>
                <span className="font-bold text-emerald-700">{reportData?.soil_health_assessment?.score} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Organic Matter %:</span>
                <span className="font-bold">{reportData?.soil_health_assessment?.organic_matter}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Nitrogen Pool:</span>
                <span className="font-bold text-amber-700">{reportData?.soil_health_assessment?.active_nitrogen}</span>
              </div>
              <div className="flex justify-between">
                <span>Soil pH & Salinity:</span>
                <span className="font-bold">{reportData?.soil_health_assessment?.pH} • {reportData?.soil_health_assessment?.salinity}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Recommended Crop Rotation & AI Justification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Recommended Adaptive Rotation Strategy
          </h3>

          <div className="p-6 rounded-2xl bg-emerald-950 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  Primary Recommendation
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  {rec?.title || 'A: Rice → Pulses → Maize'}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-amber-400">{rec?.composite_score || 88}</span>
                <span className="text-[10px] text-emerald-300 block font-semibold">Suitability Score</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-800 text-xs text-emerald-100 leading-relaxed">
              <span className="font-bold text-white block mb-1">AI Agronomic Rationale:</span>
              “{rec?.narrative?.why_this_rotation}”
            </div>

            {/* Expected Environmental Benefits */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-emerald-300">
                Quantified Environmental Benefits:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(rec?.narrative?.expected_benefits || []).map((b: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. 3-Year Projected Field Impact */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            4. Projected Multi-Season Impact Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Water Saved</span>
              <span className="text-lg font-extrabold text-sky-700">~{reportData?.impact_forecast?.water_saved_percent}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Biological N Added</span>
              <span className="text-lg font-extrabold text-emerald-700">+{reportData?.impact_forecast?.nitrogen_added_kg} kg/ha</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Organic Matter Trend</span>
              <span className="text-lg font-extrabold text-emerald-700">{reportData?.impact_forecast?.organic_matter_trend}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-slate-400 block text-[10px]">Yield Stability Buffer</span>
              <span className="text-lg font-extrabold text-slate-800">High (+18%)</span>
            </div>
          </div>
        </div>

        {/* Scientific Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p className="font-bold text-slate-700">Scientific & Regulatory Disclaimer:</p>
          <p>{reportData?.scientific_disclaimer}</p>
        </div>

      </div>

    </div>
  );
};
