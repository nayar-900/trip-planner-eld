import requests
import math
from django.conf import settings

class RoutingService:
    BASE_URL = "https://api.openrouteservice.org"
    
    def __init__(self):
        self.api_key = settings.ORS_API_KEY
        self.headers = {'Authorization': self.api_key, 'Content-Type': 'application/json'}
    
    def geocode(self, location):
        url = f"{self.BASE_URL}/geocode/search"
        params = {'text': location, 'api_key': self.api_key, 'size': 1}
        
        try:
            response = requests.get(url, params=params)
            data = response.json()
            if data['features']:
                coords = data['features'][0]['geometry']['coordinates']
                return {'latitude': coords[1], 'longitude': coords[0]}
        except:
            pass
        return {'latitude': 40.7128, 'longitude': -74.0060}
    
    def get_route(self, start, end):
        start_coords = self.geocode(start)
        end_coords = self.geocode(end)
        
        url = f"{self.BASE_URL}/v2/directions/driving-car"
        coordinates = [[start_coords['longitude'], start_coords['latitude']],
                       [end_coords['longitude'], end_coords['latitude']]]
        
        try:
            response = requests.post(url, json={'coordinates': coordinates, 'units': 'mi'}, headers=self.headers)
            data = response.json()
            route = data['features'][0]['properties']['segments'][0]
            return {
                'total_distance_miles': route['distance'],
                'total_duration_hours': route['duration'] / 3600,
                'start_location': start,
                'end_location': end,
                'start_coords': start_coords,
                'end_coords': end_coords,
                'path': data['features'][0]['geometry']['coordinates'],
            }
        except:
            return self._mock_route(start_coords, end_coords, start, end)
    
    def _mock_route(self, start_coords, end_coords, start, end):
        lat_diff = end_coords['latitude'] - start_coords['latitude']
        lon_diff = end_coords['longitude'] - start_coords['longitude']
        approx_miles = math.sqrt(lat_diff**2 + lon_diff**2) * 69
        return {
            'total_distance_miles': approx_miles,
            'total_duration_hours': approx_miles / 55,
            'start_location': start,
            'end_location': end,
            'start_coords': start_coords,
            'end_coords': end_coords,
            'path': [[start_coords['longitude'], start_coords['latitude']],
                     [end_coords['longitude'], end_coords['latitude']]],
        }