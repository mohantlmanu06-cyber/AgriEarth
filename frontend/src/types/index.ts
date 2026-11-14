export interface User {
  id: number | string;
  username: string;
  email: string;
  name: string;
  role: 'farmer' | 'advisor' | 'researcher';
  phone_number?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface CropHistoryItem {
  id: number;
  crop: string;
  season: string;
  year: number;
  yield_kg_ha?: number;
  notes?: string;
}

export interface HistoricalTrendItem {
  year: number;
  mean_ndvi: number;
  peak_ndvi: number;
  annual_rainfall_mm: number;
  mean_lst_c: number;
  mean_soil_moisture_pct: number;
  drought_event_months: number;
  crop_season_anomalies: string;
}

export interface EarthObservationItem {
  id?: number;
  date: string;
  ndvi: number;
  temperature: number;
  temp_max?: number;
  temp_min?: number;
  precipitation: number;
  relative_humidity?: number;
  soil_moisture: number;
  drought_index: number;
  evapotranspiration?: number;
}

export interface EarthObservationSummary {
  current_ndvi: number;
  vegetation_health_label: string;
  land_surface_temp: number;
  soil_moisture_pct: number;
  surface_moisture_status: string;
  root_zone_moisture_pct: number;
  monthly_rainfall_mm: number;
  rainfall_anomaly_pct: number;
  drought_risk: string;
  et_daily_mm: number;
  water_stress_label: string;
  elevation_m: number;
  slope_pct: number;
  runoff_vulnerability: string;
}

export interface EarthObservationResponse {
  field_id: number;
  field_name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  live_source_status: string;
  resolution_advisory: string;
  summary: EarthObservationSummary;
  time_series: EarthObservationItem[];
  historical_5year_trends?: HistoricalTrendItem[];
  data_sources_provenance?: Array<{
    sensor: string;
    product: string;
    spatial_resolution: string;
    temporal_resolution: string;
    variables: string[];
    status: string;
  }>;
}

export interface FieldAlert {
  id: number;
  alert_type: string;
  severity: 'low' | 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  action_recommendation: string;
  created_at: string;
}

export interface Field {
  id: number;
  name: string;
  farm?: number;
  farm_name?: string;
  area: number;
  soil_type: string;
  irrigation_type: string;
  latitude: number;
  longitude: number;
  boundary: [number, number][];
  current_crop: string;
  health_score: number;
  health_status: 'healthy' | 'moderate' | 'stressed';
  expected_planting_date?: string;
  crop_history?: CropHistoryItem[];
  earth_observations?: EarthObservationItem[];
  alerts?: FieldAlert[];
}

export interface Crop {
  id: number;
  name: string;
  scientific_name: string;
  category: string;
  water_requirement: 'low' | 'moderate' | 'high' | 'very_high';
  growing_period_days: number;
  soil_requirements: string;
  climate_tolerance: string;
  nitrogen_effect: 'fixing' | 'neutral' | 'depleting';
  root_depth: 'shallow' | 'medium' | 'deep';
  market_value_index: number;
  biomass_potential: string;
  icon_name: string;
}

export interface RotationStep {
  year: string;
  crop: string;
  category: string;
  water_req_mm: number;
  nitrogen_balance_kg: number;
  root_depth: string;
  icon: string;
  transition_rationale: string;
}

export interface StructuredNarrative {
  title: string;
  why: string;
  evidence: string[];
  benefits: string[];
  trade_offs: string[];
  risks: string[];
  uncertainty: string;
  local_validation: string[];
}

export interface RotationStrategy {
  strategy_id: string;
  strategy_type?: 'existing' | 'strategy_a' | 'strategy_b' | 'strategy_c' | string;
  title: string;
  is_baseline?: boolean;
  badge?: string;
  sequence: string[];
  steps: RotationStep[];
  composite_score: number;
  alignment_score?: number;
  soil_score: number;
  water_score: number;
  profit_score: number;
  climate_score: number;
  risk_score: number;
  net_nitrogen_kg_ha: number;
  avg_water_mm: number;
  estimated_water_savings_pct: number;
  estimated_om_gain_pct: number;
  trade_offs?: {
    strengths: string[];
    trade_offs: string[];
  };
  uncertainty_range?: {
    water_range_mm: string;
    nitrogen_range_kg: string;
    om_gain_range: string;
    confidence_level: string;
  };
  structured_narrative?: StructuredNarrative;
  structured_recommendation?: any;
  narrative?: {
    why_this_rotation: string;
    expected_benefits: string[];
    key_risks: string[];
    scientific_note: string;
  };
}

export interface FarmerPriorities {
  soil_health: number;
  water_conservation: number;
  climate_resilience: number;
  economic_potential: number;
  erosion_reduction: number;
  risk_reduction: number;
  market_suitability: number;
  // Aliases for compatibility
  profitability?: number;
  low_risk?: number;
}

export interface WhatIfScenarioResult {
  strategy_id: string;
  title: string;
  is_baseline: boolean;
  original_score: number;
  simulated_score: number;
  score_change: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  risk_badge: string;
  risk_score: number;
  resilience_summary: string;
}

export interface WhatIfResponse {
  field_id: number | null;
  parameters: {
    rainfall_delta_pct: number;
    temp_delta_c: number;
    moisture_delta_pct: number;
    water_availability: string;
  };
  scenarios: WhatIfScenarioResult[];
  notice: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  provider: string;
  variables: string[];
  resolution: string;
  coverage?: string;
  how_used: string;
  link: string;
  citation: string;
}

export interface DataSourcesCatalog {
  official_challenge_url?: string;
  nasa_sources: DataSourceItem[];
  agricultural_sources: DataSourceItem[];
  partner_sources?: DataSourceItem[];
  total_datasets?: number;
  disclaimer: string;
}
