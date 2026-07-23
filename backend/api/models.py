from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0)
    total_distance_miles = models.FloatField(null=True, blank=True)
    total_driving_hours = models.FloatField(null=True, blank=True)
    total_fuel_cost = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"

class TripDay(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='days')
    day_number = models.IntegerField()
    date = models.DateField(null=True, blank=True)
    off_duty_hours = models.FloatField(default=0)
    sleeper_berth_hours = models.FloatField(default=0)
    driving_hours = models.FloatField(default=0)
    on_duty_not_driving_hours = models.FloatField(default=0)
    total_on_duty_hours = models.FloatField(default=0)
    total_driving_hours_day = models.FloatField(default=0)
    cycle_used = models.FloatField(default=0)
    hour_status = models.JSONField(default=list)
    remarks = models.TextField(blank=True)
    
    def __str__(self):
        return f"Day {self.day_number} of Trip {self.trip.id}"

class FuelStop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='fuel_stops')
    day = models.ForeignKey(TripDay, on_delete=models.CASCADE, null=True, blank=True, related_name='fuel_stops')
    location = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    price_per_gallon = models.FloatField(default=3.50)
    gallons_purchased = models.FloatField(default=0)
    cost = models.FloatField(default=0)
    cumulative_distance = models.FloatField(default=0)
    stop_order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Fuel stop {self.stop_order}: {self.location}"