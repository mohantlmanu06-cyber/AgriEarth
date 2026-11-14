from rest_framework import serializers
from .models import User, Farm, Field, CropHistory, Crop, EarthObservation, RotationPlan, Recommendation, FarmerAlert

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'role', 'phone_number', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone_number', 'role', 'password', 'confirm_password']

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data.get('email')
        username = email.split('@')[0] if email else f"user_{User.objects.count()+1}"
        # Ensure username uniqueness
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            name=validated_data.get('name', ''),
            role=validated_data.get('role', 'farmer'),
            phone_number=validated_data.get('phone_number', ''),
            password=validated_data.get('password')
        )
        return user


class CropHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CropHistory
        fields = '__all__'


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'


class EarthObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EarthObservation
        fields = '__all__'


class RotationPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RotationPlan
        fields = '__all__'


class RecommendationSerializer(serializers.ModelSerializer):
    rotation = RotationPlanSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = '__all__'


class FarmerAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerAlert
        fields = '__all__'


class FieldSerializer(serializers.ModelSerializer):
    crop_history = CropHistorySerializer(many=True, read_only=True)
    earth_observations = serializers.SerializerMethodField()
    alerts = FarmerAlertSerializer(many=True, read_only=True)
    farm_name = serializers.CharField(source='farm.name', read_only=True)

    class Meta:
        model = Field
        fields = [
            'id', 'farm', 'farm_name', 'name', 'area', 'soil_type', 'irrigation_type',
            'latitude', 'longitude', 'boundary', 'current_crop', 'health_score',
            'health_status', 'expected_planting_date', 'crop_history',
            'earth_observations', 'alerts', 'created_at'
        ]

    def get_earth_observations(self, obj):
        recent = obj.earth_observations.all()[:10]
        return EarthObservationSerializer(recent, many=True).data


class FarmSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True)

    class Meta:
        model = Farm
        fields = ['id', 'user', 'name', 'location', 'total_area', 'fields', 'created_at']
