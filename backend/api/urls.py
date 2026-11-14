from django.urls import path
from .views import (
    RegisterView, LoginView, CurrentUserView,
    FieldListCreateView, FieldDetailView,
    EarthObservationView, WeatherView, SoilHealthView,
    RotationAnalyzeView, RotationRecommendationsView,
    GenerateReportView, CropListView, AlertsListView, SeedDemoView,
    WhatIfSimulateView, DataSourcesView
)

urlpatterns = [
    # Auth
    path('auth/register', RegisterView.as_view(), name='auth-register'),
    path('auth/login', LoginView.as_view(), name='auth-login'),
    path('auth/me', CurrentUserView.as_view(), name='auth-me'),

    # Fields
    path('fields', FieldListCreateView.as_view(), name='fields-list-create'),
    path('fields/<int:pk>', FieldDetailView.as_view(), name='fields-detail'),

    # Earth Observation & Environment
    path('earth-observation/<int:field_id>', EarthObservationView.as_view(), name='earth-observation'),
    path('weather/<int:field_id>', WeatherView.as_view(), name='weather'),
    path('soil/<int:field_id>', SoilHealthView.as_view(), name='soil-health'),

    # AI Crop Rotation & What-If
    path('rotation/analyze', RotationAnalyzeView.as_view(), name='rotation-analyze'),
    path('rotation/recommendations/<int:field_id>', RotationRecommendationsView.as_view(), name='rotation-recommendations'),
    path('rotation/what-if', WhatIfSimulateView.as_view(), name='rotation-what-if'),

    # Data Sources & Transparency
    path('data-sources', DataSourcesView.as_view(), name='data-sources'),

    # Reports
    path('reports/generate', GenerateReportView.as_view(), name='reports-generate'),

    # Crops & Alerts
    path('crops', CropListView.as_view(), name='crops-list'),
    path('alerts', AlertsListView.as_view(), name='alerts-list'),

    # Demo Seed
    path('demo/seed', SeedDemoView.as_view(), name='demo-seed'),
]
