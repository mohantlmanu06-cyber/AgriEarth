# Field Shift — AI-Powered Crop Rotation with NASA Earth Data

**Field Shift** is a modern, production-ready agricultural decision-support web application that empowers farmers, agricultural advisors, researchers, and students to answer:

> **“Which crop rotation strategy is best for my field under current and changing environmental conditions?”**

The platform combines **NASA Earth observation data** (NASA POWER agroclimatology, MODIS NDVI, SMAP root-zone soil moisture, GPM rainfall radar), local soil parameters, crop biological traits, and personalized farmer priorities into explainable, multi-year rotation plans.

---

## 🚀 Quick Start Commands

### 1. Frontend Commands (`/frontend`)

Navigate into the frontend directory:
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server (Runs on http://localhost:5173)
```bash
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Run Linter
```bash
npm run lint
```

---

### 2. Backend Commands (`/backend`)

Navigate into the backend directory:
```bash
cd backend
```

#### Install Python Dependencies
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt requests
```

#### Apply Database Migrations
```bash
python manage.py makemigrations api
python manage.py migrate
```

#### Seed Demo Farm & NASA Observations (One-Click Setup)
```bash
python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fieldshift_core.settings'); django.setup(); from api.views import SeedDemoView; from rest_framework.test import APIRequestFactory; rf = APIRequestFactory(); req = rf.post('/api/demo/seed'); res = SeedDemoView().post(req); print(res.data)"
```

#### Start Backend Server (Runs on http://127.0.0.1:8000)
```bash
python manage.py runserver 127.0.0.1:8000
```

---

## 🌟 Key Application Features & Pages

### Public Pages
1. **Landing Page (`/`)**: Hero with satellite field visualizer, problem section, 5-step workflow, UX principle highlight, and final CTA.
2. **About Field Shift (`/about`)**: Scientific mission, methodology, and NASA data fusion principles.
3. **How It Works (`/how-it-works`)**: 5-step technical engineering pipeline.
4. **NASA Earth Data (`/nasa-data`)**: Public interactive explorer for MODIS, SMAP, GPM, and POWER sensors.
5. **Features (`/features`)**: Breakdown of AI rotation, soil health tracking, and agrometeorology.
6. **Contact (`/contact`)**: Support inquiries and extension advisor contact form.
7. **Login (`/login`)**: Authentication with instant **"Try Demo Farm"** 1-click launcher.
8. **Register (`/register`)**: Onboarding with Farmer, Advisor, and Researcher role selections.

### Farmer Application (Dashboard & Intelligence)
9. **Farmer Dashboard (`/dashboard`)**: Time-based greeting, acreage, environmental indicator cards (Temperature, Rain, Soil Moisture, NDVI, Water Stress, Weather Risk), and interactive Leaflet map.
10. **Field Management (`/fields`)**: Searchable and filterable grid of all agricultural parcels.
11. **Add Field (`/add-field`)**: Interactive map boundary drawing tool and coordinate setup.
12. **Field Analysis (`/field-analysis`)**: NASA Earth observation timeseries charts and plain-language diagnosis.
13. **Crop Rotation Planner (`/planner`)**: Baseline crop, candidate selection, duration (2–5 yrs), and 5 farmer priority sliders (Soil Health, Water, Profit, Climate, Low Risk) with presets.
14. **AI Recommendations (`/recommendations`)**: Strategies A, B, and C with composite scores, radar charts, step-by-step timelines, and explainable justifications.
15. **NASA Earth Observation Explorer (`/nasa-explorer`)**: Layer toggles (NDVI, LST, Soil Moisture, GPM Rain, SPI Drought, Optical Land Cover) with farmer indicator explanations.
16. **Weather & Climate (`/weather-climate`)**: Live conditions, 7-day forecast, monthly rainfall anomalies, and risk badges (🟢, 🟡, 🔴).
17. **Soil Health (`/soil-health`)**: 78/100 scorecard, component breakdown (organic matter, N-P-K, pH, salinity), and legume recharge recommendations.
18. **Crop Database (`/crops`)**: Searchable catalog of 12+ crops with water requirements, root depths, and market profitability.
19. **Rotation Comparison (`/compare-rotations`)**: Section 18 comparison matrix, multi-strategy radar overlap, and resource savings charts.
20. **Sustainability Reports (`/reports`)**: Executive Field Sustainability Report generator with print/export layout and JSON download.
21. **Profile & Settings (`/settings`)**: Farm operation profile, unit toggles, alert settings, and 1-click Demo Farm reset.

---

## 🛰️ NASA Data & API Integration

- **NASA POWER API**: Agroclimatology point data (solar radiation, air temperature, precipitation, relative humidity, topsoil wetness proxy).
- **MODIS Terra / Landsat-8**: Normalized Difference Vegetation Index (NDVI) & Land Surface Temperature (LST).
- **NASA SMAP**: Volumetric root-zone soil moisture (0-50 cm).
- **NASA GPM IMERG**: Global satellite radar precipitation accumulation.
- **Open-Meteo**: Hyper-local 7-day agricultural weather and soil temperature.
- **Resilient Fallback Pipeline**: Built-in high-fidelity geospatial generator ensuring 100% demo uptime and offline resilience during hackathon judging.
