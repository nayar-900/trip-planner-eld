from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Trip, TripDay, FuelStop
from .services.trip_calculator import TripCalculator

class TripPlannerView(APIView):
    def post(self, request):
        current_location = request.data.get('current_location')
        pickup_location = request.data.get('pickup_location')
        dropoff_location = request.data.get('dropoff_location')
        current_cycle_used = float(request.data.get('current_cycle_used', 0))
        
        if not all([current_location, pickup_location, dropoff_location]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        calculator = TripCalculator()
        result = calculator.calculate(
            current_location, pickup_location, dropoff_location, current_cycle_used
        )
        
        trip = Trip.objects.create(
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            current_cycle_used=current_cycle_used,
            total_distance_miles=result['total_distance_miles'],
            total_driving_hours=result['total_driving_hours'],
            total_fuel_cost=result['total_fuel_cost'],
        )
        
        for day_data in result['hos_days']:
            TripDay.objects.create(
                trip=trip,
                day_number=day_data['day_number'],
                date=day_data['date'],
                off_duty_hours=day_data['off_duty_hours'],
                sleeper_berth_hours=day_data['sleeper_berth_hours'],
                driving_hours=day_data['driving_hours'],
                on_duty_not_driving_hours=day_data['on_duty_not_driving_hours'],
                total_on_duty_hours=day_data['total_on_duty_hours'],
                total_driving_hours_day=day_data['total_driving_hours_day'],
                cycle_used=day_data.get('cycle_used', 0),
                hour_status=day_data['hour_status'],
                remarks=day_data.get('remarks', ''),
            )
        
        for stop_data in result['fuel_stops']:
            FuelStop.objects.create(
                trip=trip,
                location=stop_data['location'],
                address=stop_data['address'],
                latitude=stop_data['latitude'],
                longitude=stop_data['longitude'],
                price_per_gallon=stop_data['price_per_gallon'],
                gallons_purchased=stop_data['gallons_purchased'],
                cost=stop_data['cost'],
                cumulative_distance=stop_data['cumulative_distance'],
                stop_order=stop_data['stop_order'],
            )
        
        response_data = {
            'trip': {
                'id': trip.id,
                'current_location': trip.current_location,
                'pickup_location': trip.pickup_location,
                'dropoff_location': trip.dropoff_location,
                'total_distance_miles': trip.total_distance_miles,
                'total_driving_hours': trip.total_driving_hours,
                'total_fuel_cost': trip.total_fuel_cost,
                'current_cycle_used': trip.current_cycle_used,
            },
            'route': {
                'path': result['route']['path'],
                'start_coords': result['route']['start_coords'],
                'end_coords': result['route']['end_coords'],
            },
            'days': result['hos_days'],
            'fuel_stops': result['fuel_stops'],
        }
        
        return Response(response_data, status=status.HTTP_200_OK)