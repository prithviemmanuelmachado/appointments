from rest_framework.validators import ValidationError
from .models import Appointment

def validate_appointment_time(validated_data, id):
    #check if the slot is already taken
    create_date = validated_data["date"]
    create_time = validated_data["time"]
    exisiting_appointments = Appointment.objects\
                            .filter(date = create_date, created_for = validated_data['created_for'])
    if id:
        exisiting_appointments = exisiting_appointments.exclude(pk=id)
    existing_appointment_times = exisiting_appointments.values_list('time', flat=True)
    conflicting_slots = [
        time_obj.strftime('%I %p') for time_obj in existing_appointment_times
    ]
    if any(time_obj.hour == create_time.hour for time_obj in existing_appointment_times):
        raise ValidationError({
            "conflicting_slots": conflicting_slots
        })