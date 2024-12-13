from rest_framework.permissions import BasePermission
from .models import Appointment, Note

class IsUserAppointmentOrAdmin(BasePermission):
    def has_permission(self, request, view):
        appointment_pk = view.kwargs.get('appointment_pk')
        if appointment_pk:
            return Appointment.objects.filter(
                id=appointment_pk,
                created_for=request.user
            ).exists() or request.user.is_staff
        return False
        
    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return obj.appointment.created_for == request.user or request.user.is_staff
        if isinstance(obj, Note):
            return obj.created_by == request.user or request.user.is_staff
        else: 
            return False