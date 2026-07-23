import os
import sys

# Add the backend folder to the path
path = '/home/yourusername/trip-planner-eld/backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trip_planner.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()