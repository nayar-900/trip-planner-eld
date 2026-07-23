# At the top, add:
import os

# Update ALLOWED_HOSTS:
ALLOWED_HOSTS = ['*']  # For testing, or use your Railway URL

# Add CSRF trusted origins (if using Django forms):
CSRF_TRUSTED_ORIGINS = [
    'https://trip-planner-eld-production.up.railway.app',
    'https://*.railway.app',
]

# Update CORS settings:
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    'https://trip-planner-eld-production.up.railway.app',
    'https://*.railway.app',
]

# Make sure DEBUG is False in production:
DEBUG = os.getenv('DEBUG', 'False') == 'True'