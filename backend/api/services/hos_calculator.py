from datetime import datetime, timedelta

class HOSCalculator:
    MAX_DRIVING_HOURS_PER_DAY = 11
    MAX_ON_DUTY_WINDOW = 14
    MAX_WEEKLY_HOURS = 70
    RESET_HOURS = 34
    REST_BREAK_THRESHOLD = 8
    REST_BREAK_MINUTES = 30
    PICKUP_DROPOFF_HOURS = 1
    HIGHWAY_SPEED = 55
    CITY_SPEED = 30
    
    @classmethod
    def calculate_trip_days(cls, total_driving_hours, current_cycle_used):
        days = []
        remaining_hours = total_driving_hours
        cycle_used = current_cycle_used
        day_number = 1
        current_date = datetime.now().date()
        
        while remaining_hours > 0:
            available_hours = cls.MAX_DRIVING_HOURS_PER_DAY
            
            if cycle_used + available_hours > cls.MAX_WEEKLY_HOURS:
                available_hours = cls.MAX_WEEKLY_HOURS - cycle_used
            
            if available_hours <= 0:
                for _ in range(2):
                    days.append(cls._create_rest_day(day_number, current_date))
                    day_number += 1
                    current_date += timedelta(days=1)
                cycle_used = 0
                continue
            
            driving_today = min(available_hours, remaining_hours)
            remaining_hours -= driving_today
            cycle_used += driving_today
            
            on_duty_hours = driving_today + (cls.PICKUP_DROPOFF_HOURS * 2)
            
            if driving_today >= cls.REST_BREAK_THRESHOLD:
                on_duty_hours += cls.REST_BREAK_MINUTES / 60
            
            day = cls._create_day(
                day_number, current_date, driving_today, on_duty_hours, 
                cycle_used, remaining_hours
            )
            days.append(day)
            
            day_number += 1
            current_date += timedelta(days=1)
        
        return days
    
    @classmethod
    def _create_day(cls, day_number, date, driving_hours, on_duty_hours, cycle_used, remaining_hours):
        off_duty_hours = max(0, 24 - on_duty_hours)
        hour_status = [0] * 8  # 8 hours off duty (sleep)
        
        # On duty not driving (pre-trip + pickup)
        for _ in range(2):
            hour_status.append(3)
        
        # Driving hours
        driving_left = driving_hours
        hour = 10
        
        while driving_left > 0 and hour < 24:
            if hour >= 8:
                hour_status.append(0)
                hour += 1
            
            drive_block = min(driving_left, 24 - hour)
            for _ in range(int(drive_block)):
                if hour < 24:
                    hour_status.append(2)
                    hour += 1
            driving_left -= drive_block
        
        # On duty not driving (dropoff + post-trip)
        for _ in range(2):
            if hour < 24:
                hour_status.append(3)
                hour += 1
        
        # Remaining off duty
        while hour < 24:
            hour_status.append(0)
            hour += 1
        
        while len(hour_status) < 24:
            hour_status.append(0)
        hour_status = hour_status[:24]
        
        return {
            'day_number': day_number,
            'date': date.isoformat(),
            'off_duty_hours': off_duty_hours,
            'sleeper_berth_hours': 0,
            'driving_hours': driving_hours,
            'on_duty_not_driving_hours': on_duty_hours - driving_hours,
            'total_on_duty_hours': on_duty_hours,
            'total_driving_hours_day': driving_hours,
            'cycle_used': cycle_used,
            'remaining_hours': remaining_hours,
            'hour_status': hour_status,
            'remarks': f"Day {day_number}: {driving_hours:.1f} hours driving"
        }
    
    @classmethod
    def _create_rest_day(cls, day_number, date):
        return {
            'day_number': day_number,
            'date': date.isoformat(),
            'off_duty_hours': 24,
            'sleeper_berth_hours': 0,
            'driving_hours': 0,
            'on_duty_not_driving_hours': 0,
            'total_on_duty_hours': 0,
            'total_driving_hours_day': 0,
            'cycle_used': 0,
            'remaining_hours': 0,
            'hour_status': [0] * 24,
            'remarks': f"Rest Day - 34 hour reset"
        }