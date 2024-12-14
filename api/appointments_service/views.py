from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .filters import CustomAppointmentFilter
from .models import Appointment, Note
from .pagination import CustomPagination
from .permissions import IsUserAppointmentOrAdmin
from .serializers import AppointmentSerializer, CreateAppointmentSerializer, NoteSerializer

class AppointmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter
    ]
    filterset_class = CustomAppointmentFilter
    ordering_fields = [
        'id',
        'date',
        'time',
        'created_for',
        'is_active',
    ]
    pagination_class = CustomPagination
    
    def get_queryset(self):
        user = self.request.user 
        if user.is_staff:
            return Appointment.objects.all().select_related('created_for')
        else:
            return Appointment.objects.filter(created_for=user).select_related('created_for')
    
    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'create':
            return CreateAppointmentSerializer
        return AppointmentSerializer
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.request.user
        }
    
class NoteViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsUserAppointmentOrAdmin]
    serializer_class = NoteSerializer
    
    def get_queryset(self):
        user = self.request.user 
        if user.is_staff:
            return Note.objects.filter(appointment = self.kwargs['appointment_pk']).select_related('created_by', 'appointment')
        else:
            return Note.objects.filter(
                appointment = self.kwargs['appointment_pk'],
                appointment__created_for = user
            ).select_related('created_by', 'appointment')
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.request.user,
            'appointment_id': self.kwargs['appointment_pk']
        }