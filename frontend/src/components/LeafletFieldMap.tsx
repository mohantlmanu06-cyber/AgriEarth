import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Field } from '../types';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, Satellite } from 'lucide-react';

interface LeafletFieldMapProps {
  fields: Field[];
  selectedFieldId?: number;
  onFieldSelect?: (field: Field) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  isEditable?: boolean;
  onBoundaryChange?: (boundary: [number, number][]) => void;
  activeLayer?: 'standard' | 'satellite' | 'ndvi' | 'moisture' | 'temperature';
  showControls?: boolean;
}

export const LeafletFieldMap: React.FC<LeafletFieldMapProps> = ({
  fields,
  selectedFieldId,
  onFieldSelect,
  center = [38.5816, -121.4944],
  zoom = 14,
  height = '420px',
  isEditable = false,
  onBoundaryChange,
  activeLayer = 'satellite',
  showControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const drawPolygonRef = useRef<L.Polygon | null>(null);
  const drawnPointsRef = useRef<[number, number][]>([]);

  const [currentMapType, setCurrentMapType] = useState<'satellite' | 'street' | 'topo'>(
    activeLayer === 'satellite' ? 'satellite' : 'street'
  );
  const [activeOverlay, setActiveOverlay] = useState<string>('none');

  const getTileUrl = (type: string) => {
    switch (type) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topo':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileAttribution = (type: string) => {
    switch (type) {
      case 'satellite':
        return '&copy; Esri & NASA Earth Observation';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
      });

      const tileLayer = L.tileLayer(getTileUrl(currentMapType), {
        attribution: getTileAttribution(currentMapType),
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      polygonLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle click for editable polygon creation
      if (isEditable) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const newPt: [number, number] = [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))];
          drawnPointsRef.current = [...drawnPointsRef.current, newPt];

          if (drawPolygonRef.current) {
            drawPolygonRef.current.setLatLngs(drawnPointsRef.current);
          } else {
            drawPolygonRef.current = L.polygon(drawnPointsRef.current, {
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.35,
              weight: 3,
              dashArray: '4, 4',
            }).addTo(map);
          }

          if (onBoundaryChange) {
            onBoundaryChange(drawnPointsRef.current);
          }
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Base Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(getTileUrl(currentMapType), {
      attribution: getTileAttribution(currentMapType),
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [currentMapType]);

  // Render Polygons
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayerGroupRef.current) return;
    polygonLayerGroupRef.current.clearLayers();

    if (fields.length === 0) return;

    const bounds = L.latLngBounds([]);

    fields.forEach((field) => {
      const isSelected = selectedFieldId === field.id;
      let color = '#10b981'; // Healthy
      let fillColor = '#10b981';

      if (field.health_status === 'moderate' || (field.health_score >= 50 && field.health_score < 75)) {
        color = '#f59e0b'; // Amber
        fillColor = '#f59e0b';
      } else if (field.health_status === 'stressed' || field.health_score < 50) {
        color = '#ef4444'; // Red
        fillColor = '#ef4444';
      }

      if (field.boundary && field.boundary.length >= 3) {
        const polygon = L.polygon(field.boundary, {
          color: isSelected ? '#38bdf8' : color,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.55 : 0.35,
          weight: isSelected ? 4 : 2,
        });

        const popupContent = `
          <div style="font-family: inherit; padding: 4px; min-width: 170px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 4px;">
              ${field.name}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 3px;">
              <span style="font-weight: 600;">Area:</span> ${field.area} acres
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 3px;">
              <span style="font-weight: 600;">Current Crop:</span> ${field.current_crop}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 6px;">
              <span style="font-weight: 600;">Soil:</span> ${field.soil_type}
            </div>
            <div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${color}20; color: ${color}; border: 1px solid ${color}60;">
              Health: ${field.health_score}/100 (${field.health_status})
            </div>
          </div>
        `;

        polygon.bindPopup(popupContent);

        polygon.on('click', () => {
          if (onFieldSelect) {
            onFieldSelect(field);
          }
        });

        polygonLayerGroupRef.current?.addLayer(polygon);
        polygon.getLatLngs().forEach((latLngArray: any) => {
          if (Array.isArray(latLngArray)) {
            latLngArray.forEach((pt: any) => bounds.extend(pt));
          }
        });
      } else if (field.latitude && field.longitude) {
        const marker = L.circleMarker([field.latitude, field.longitude], {
          radius: 8,
          color: color,
          fillColor: fillColor,
          fillOpacity: 0.8,
          weight: 2,
        });
        marker.bindPopup(`<b>${field.name}</b><br/>Area: ${field.area} ac<br/>Health: ${field.health_score}/100`);
        marker.on('click', () => onFieldSelect && onFieldSelect(field));
        polygonLayerGroupRef.current?.addLayer(marker);
        bounds.extend([field.latitude, field.longitude]);
      }
    });

    if (bounds.isValid() && !isEditable && fields.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 16 });
    }
  }, [fields, selectedFieldId]);

  const clearDrawing = () => {
    drawnPointsRef.current = [];
    if (drawPolygonRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(drawPolygonRef.current);
      drawPolygonRef.current = null;
    }
    if (onBoundaryChange) {
      onBoundaryChange([]);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md group" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Control Overlays */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          {/* Layer switcher */}
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200/80 flex flex-col gap-1 text-xs">
            <button
              onClick={() => setCurrentMapType('satellite')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                currentMapType === 'satellite' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="NASA / Esri High-Resolution Satellite Imagery"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setCurrentMapType('street')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                currentMapType === 'street' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="OpenStreetMap Standard"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Street</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 flex flex-col overflow-hidden">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-200/80 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 hover:bg-slate-100 text-slate-700 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 text-xs flex items-center gap-3">
        <span className="font-semibold text-slate-700">Health Index:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-600">Healthy (&gt;75)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span className="text-slate-600">Moderate (50-74)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
          <span className="text-slate-600">Stressed (&lt;50)</span>
        </div>
      </div>

      {/* Drawing mode toolbar */}
      {isEditable && (
        <div className="absolute top-4 left-4 z-[400] bg-emerald-950/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-emerald-500/30 text-xs max-w-xs">
          <div className="font-semibold flex items-center gap-1.5 text-emerald-300 mb-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Interactive Field Boundary Mode</span>
          </div>
          <p className="text-slate-300 text-[11px] mb-2 leading-relaxed">
            Click on map to drop corners of your plot. At least 3 points are required to define the boundary polygon.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearDrawing}
              className="px-2.5 py-1 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition"
            >
              Reset Points
            </button>
            <span className="text-[11px] text-emerald-200">
              {drawnPointsRef.current.length} points placed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
