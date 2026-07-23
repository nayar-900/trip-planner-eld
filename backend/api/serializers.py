from rest_framework import serializers
from .models import Trip, TripDay, FuelStop

class TripDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = TripDay
        fields = '__all__'

class FuelStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelStop
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    days = TripDaySerializer(many=True, read_only=True)
    fuel_stops = FuelStopSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'