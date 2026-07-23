# FleetLog - Trip Planner & ELD Logs

## Overview

FleetLog is a full-stack trip planning application designed for commercial truck drivers. It helps plan routes, calculate fuel stops, and generate FMCSA-compliant ELD (Electronic Logging Device) logs.

The application takes trip details as input and outputs a route map with stops, along with completed daily log sheets that truck drivers are required to maintain.

## Live Demo

- **Frontend:** https://fleetlog-trip-planner.vercel.app
- **Backend API:** https://nayar900.pythonanywhere.com
- **Backend:** https://nayar900.pythonanywhere.com/api/plan-trip/

## Features

- Trip planning with current location, pickup, and dropoff
- Route visualization on an interactive map
- HOS (Hours of Service) rule enforcement
- Automatic ELD log generation
- Fuel stop calculation (every 1,000 miles)
- 34-hour restart handling for extended trips
- Professional driver-focused interface

## Technology Stack

### Backend
- Django 5.0.6
- Django REST Framework
- SQLite (development) / PostgreSQL (production-ready)
- OpenRouteService API for routing and geocoding

### Frontend
- React 19.2.8
- Vite build tool
- Leaflet for interactive maps
- Axios for API communication

### Deployment
- Backend: PythonAnywhere
- Frontend: Vercel

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```
ORS_API_KEY=your_openroute_service_api_key
```

Run migrations and start the server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

### POST /api/plan-trip/

Plan a trip and generate ELD logs.

**Request Body:**

```json
{
    "current_location": "Chicago, IL",
    "pickup_location": "Chicago, IL",
    "dropoff_location": "Los Angeles, CA",
    "current_cycle_used": 10
}
```

**Response:**

```json
{
    "trip": {
        "id": 1,
        "current_location": "Chicago, IL",
        "pickup_location": "Chicago, IL",
        "dropoff_location": "Los Angeles, CA",
        "total_distance_miles": 2179.08,
        "total_driving_hours": 39.62,
        "total_fuel_cost": 762.68,
        "current_cycle_used": 10.0
    },
    "route": {
        "path": [[-87.66063, 41.87897], [-118.25703, 34.05513]],
        "start_coords": {"latitude": 41.87897, "longitude": -87.66063},
        "end_coords": {"latitude": 34.05513, "longitude": -118.25703}
    },
    "days": [
        {
            "day_number": 1,
            "date": "2026-07-23",
            "driving_hours": 11.0,
            "off_duty_hours": 10.5,
            "hour_status": [0,0,0,0,0,0,0,0,3,3,0,2,2,2,2,2,2,2,2,2,2,2,3,3]
        }
    ],
    "fuel_stops": [
        {
            "stop_order": 1,
            "location": "Fuel Stop 1",
            "latitude": 41.87897,
            "longitude": -87.66063,
            "cost": 350.0
        }
    ]
}
```

## HOS Rules Implemented

| Rule | Limit |
|------|-------|
| Driving Limit | 11 hours per day |
| Driving Window | 14 consecutive hours from shift start |
| Rest Break | 30 minutes after 8 hours of driving |
| Weekly Limit | 70 hours in any 8-day period |
| Reset | 34 consecutive hours off duty |

## ELD Log Status Codes

| Code | Status | Color |
|------|--------|-------|
| 0 | Off Duty | Green |
| 1 | Sleeper Berth | Blue |
| 2 | Driving | Red |
| 3 | On Duty (Not Driving) | Orange |

## Project Structure

```
trip-planner-eld/
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── services/
│   │   │   ├── hos_calculator.py
│   │   │   ├── routing.py
│   │   │   └── trip_calculator.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── trip_planner/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.jsx
│   │   │   ├── TripSummary.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   └── ELDLog.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── .gitignore
├── Procfile
├── runtime.txt
└── README.md
```

## Deployment

### Backend (PythonAnywhere)

1. Create a PythonAnywhere account
2. Clone the repository
3. Set up a virtual environment
4. Configure the web app with the correct source and working directories
5. Set environment variables

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

## License

MIT

## Author

Rayan Badar

---

**Note:** This application is for demonstration purposes. Always verify compliance with current FMCSA regulations.
