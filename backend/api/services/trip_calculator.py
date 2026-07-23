import math
from .routing import RoutingService
from .hos_calculator import HOSCalculator

class TripCalculator:
    def __init__(self):
        self.routing_service = RoutingService()
    
    def calculate(self, current_location, pickup_location, dropoff_location, current_cycle_used):
        route = self.routing_service.get_route(pickup_location, dropoff_location)
        total_distance = route['total_distance_miles']
        total_duration = route['total_duration_hours']
        
        hos_days = HOSCalculator.calculate_trip_days(total_duration, current_cycle_used)
        
        fuel_stops = []
        if total_distance > 500:
            num_stops = math.floor(total_distance / 1000)
            path = route['path']
            for i in range(1, num_stops + 1):
                fraction = i / (num_stops + 1)
                idx = min(int(fraction * len(path)), len(path) - 1)
                point = path[idx]
                fuel_stops.append({
                    'stop_order': i,
                    'latitude': point[1],
                    'longitude': point[0],
                    'location': f"Fuel Stop {i}",
                    'address': f"Along route, mile {int(i * 1000)}",
                    'price_per_gallon': 3.50,
                    'gallons_purchased': 100,
                    'cost': 350.00,
                    'cumulative_distance': i * 1000,
                })
        
        return {
            'route': route,
            'hos_days': hos_days,
            'fuel_stops': fuel_stops,
            'total_distance_miles': total_distance,
            'total_driving_hours': total_duration,
            'total_fuel_cost': (total_distance / 10) * 3.50,
            'current_location': current_location,
            'pickup_location': pickup_location,
            'dropoff_location': dropoff_location,
            'current_cycle_used': current_cycle_used,
        }