from django.conf import settings
from django.db import models

class Appointment(models.Model):
    VISIT_TYPES = [
        ('I', 'In person'),
        ('V', 'Virtual')
    ]
    
    date = models.DateField()
    time = models.TimeField()
    visit_type = models.CharField(
        max_length = 1,
        choices = VISIT_TYPES
    )
    created_for = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name = 'appointments'
    )
    is_closed = models.BooleanField(
        default = False
    )
    
class Note(models.Model):
    appointment = models.ForeignKey(
        Appointment,
        on_delete = models.CASCADE,
        related_name = 'notes'
    )
    description = models.CharField(
        max_length = 5000
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name = 'notes'
    )
    created_on = models.DateTimeField(
        auto_now_add = True
    )