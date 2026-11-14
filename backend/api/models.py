from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('advisor', 'Agricultural Advisor'),
        ('researcher', 'Researcher'),
    ]
    name = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='farmer')
    phone_number = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.name and (self.first_name or self.last_name):
            self.name = f"{self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name or self.username} ({self.role})"


class Farm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    total_area = models.FloatField(default=0.0, help_text="Total area in acres")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.location}"


class Field(models.Model):
    SOIL_CHOICES = [
        ('loamy', 'Loamy Soil'),
        ('clay_loam', 'Clay Loam'),
        ('sandy_loam', 'Sandy Loam'),
        ('black_cotton', 'Black Cotton Soil'),
        ('alluvial', 'Alluvial Soil'),
        ('red_soil', 'Red Soil'),
        ('silt_loam', 'Silt Loam'),
    ]
    IRRIGATION_CHOICES = [
        ('drip', 'Drip Irrigation'),
        ('sprinkler', 'Sprinkler System'),
        ('flood', 'Canal / Flood Irrigation'),
        ('rainfed', 'Rainfed (No Irrigation)'),
        ('borewell', 'Groundwater / Borewell'),
    ]
    HEALTH_STATUS_CHOICES = [
        ('healthy', 'Healthy (Optimal)'),
        ('moderate', 'Moderate (Attention Required)'),
        ('stressed', 'Stressed (Intervention Needed)'),
    ]

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    area = models.FloatField(help_text="Area in acres")
    soil_type = models.CharField(max_length=100, choices=SOIL_CHOICES, default='loamy')
    irrigation_type = models.CharField(max_length=100, choices=IRRIGATION_CHOICES, default='drip')
    latitude = models.FloatField(default=28.6139)
    longitude = models.FloatField(default=77.2090)
    boundary = models.JSONField(default=list, blank=True, help_text="List of [lat, lng] coordinates")
    current_crop = models.CharField(max_length=100, default='Rice')
    health_score = models.IntegerField(default=82)
    health_status = models.CharField(max_length=50, choices=HEALTH_STATUS_CHOICES, default='healthy')
    expected_planting_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.area} ac) - {self.farm.name}"


class CropHistory(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='crop_history')
    crop = models.CharField(max_length=100)
    season = models.CharField(max_length=50, help_text="Kharif, Rabi, Summer / Spring, Fall")
    year = models.IntegerField()
    yield_kg_ha = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-year', 'season']

    def __str__(self):
        return f"{self.field.name} - {self.crop} ({self.year} {self.season})"


class Crop(models.Model):
    WATER_CHOICES = [
        ('low', 'Low (300-450 mm)'),
        ('moderate', 'Moderate (450-650 mm)'),
        ('high', 'High (650-900 mm)'),
        ('very_high', 'Very High (>900 mm)'),
    ]
    NITROGEN_CHOICES = [
        ('fixing', 'Nitrogen-Fixing (Legume)'),
        ('neutral', 'Nitrogen-Neutral'),
        ('depleting', 'Nitrogen-Demanding (Exhaustive)'),
    ]
    ROOT_CHOICES = [
        ('shallow', 'Shallow (<40 cm)'),
        ('medium', 'Medium (40-90 cm)'),
        ('deep', 'Deep (>90 cm)'),
    ]

    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=50, help_text="Cereal, Pulse, Oilseed, Millets, Vegetables, Cash")
    water_requirement = models.CharField(max_length=20, choices=WATER_CHOICES, default='moderate')
    growing_period_days = models.IntegerField(help_text="Typical duration in days")
    soil_requirements = models.TextField()
    climate_tolerance = models.TextField(help_text="Drought tolerance, heat sensitivity, etc.")
    nitrogen_effect = models.CharField(max_length=20, choices=NITROGEN_CHOICES, default='neutral')
    root_depth = models.CharField(max_length=20, choices=ROOT_CHOICES, default='medium')
    market_value_index = models.IntegerField(default=75, help_text="1 to 100 economic profitability index")
    biomass_potential = models.CharField(max_length=50, default='Medium')
    icon_name = models.CharField(max_length=50, default='Sprout')

    def __str__(self):
        return f"{self.name} ({self.category})"


class EarthObservation(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='earth_observations')
    date = models.DateField()
    ndvi = models.FloatField(help_text="Normalized Difference Vegetation Index (0.0 to 1.0)")
    temperature = models.FloatField(help_text="Land Surface Temperature (°C)")
    precipitation = models.FloatField(help_text="Rainfall / Precipitation (mm)")
    soil_moisture = models.FloatField(help_text="Volumetric Soil Moisture (%)")
    drought_index = models.FloatField(help_text="Standardized Precipitation Index / Drought Index")
    evapotranspiration = models.FloatField(default=3.5, help_text="ET (mm/day)")
    raw_nasa_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.field.name} NASA Obs ({self.date}): NDVI={self.ndvi}"


class RotationPlan(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='rotation_plans')
    title = models.CharField(max_length=255, default='Adaptive Rotation Strategy')
    rotation_sequence = models.JSONField(help_text="List of crop steps over years")
    duration_years = models.IntegerField(default=3)
    score = models.IntegerField(default=85, help_text="Overall composite score 0-100")
    soil_score = models.IntegerField(default=88)
    water_score = models.IntegerField(default=84)
    climate_score = models.IntegerField(default=86)
    profit_score = models.IntegerField(default=82)
    risk_score = models.IntegerField(default=25, help_text="Lower is safer")
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.title} - Score {self.score}/100"


class Recommendation(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='recommendations')
    rotation = models.ForeignKey(RotationPlan, on_delete=models.CASCADE, related_name='recommendations', null=True, blank=True)
    title = models.CharField(max_length=255)
    explanation = models.TextField()
    benefits = models.JSONField(default=list)
    risks = models.JSONField(default=list)
    model_version = models.CharField(max_length=50, default='FieldShift-ML-v1.4')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rec: {self.title} for {self.field.name}"


class FarmerAlert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low Notice'),
        ('warning', 'Moderate Warning'),
        ('critical', 'High Risk Alert'),
        ('info', 'Agronomic Tip'),
    ]
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    alert_type = models.CharField(max_length=50)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='warning')
    title = models.CharField(max_length=255)
    message = models.TextField()
    action_recommendation = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.severity.upper()}] {self.title}"
