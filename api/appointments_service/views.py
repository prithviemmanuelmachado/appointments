import datetime
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED

from .filters import CustomAppointmentFilter, CalendarFilter
from .models import Appointment, Note
from .pagination import CustomPagination
from .permissions import IsUserAppointmentOrAdmin
from .serializers import AppointmentSerializer, CreateAppointmentSerializer, NoteSerializer, CalendarSerializer, DailyAppointmentSerailizer

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
            return Note.objects.filter(appointment = self.kwargs['appointment_pk'])\
                   .select_related('created_by__avatar', 'appointment')
        else:
            return Note.objects.filter(
                appointment = self.kwargs['appointment_pk'],
                appointment__created_for = user
            ).select_related('created_by__avatar', 'appointment')
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.request.user,
            'appointment_id': self.kwargs['appointment_pk']
        }
        
'''
    Endpoint for user to get their stats.
    When endpoint is hit 2 stat categories are generated
        1> Lifetime
        2> Today
    Note: the states are only date dependent and not time dependent for lifetime 
          the stats are both date and time dependent for todays stat
'''
@api_view(['GET'])
def dashboard(request):
    user = request.user
    if user.is_authenticated:
        today = datetime.date.today()
        time_now = datetime.datetime.now().time()
        l_total_appointments = Appointment.objects.filter(
                                created_for = user
                            ).count()
        l_open_appointments = Appointment.objects.filter(
                                date__gte = today, 
                                is_closed = False,
                                created_for = user
                            ).count()
        l_closed_appointments = Appointment.objects.filter(
                                is_closed = True,
                                created_for = user
                              ).count()
        l_past_due_appointments = Appointment.objects.filter(
                                    date__lt = today, 
                                    is_closed = False,
                                    created_for = user
                                ).count()
        t_total_appointments = Appointment.objects.filter(
                                date = today,
                                created_for = user
                               ).count()
        t_open_appointments = Appointment.objects.filter(
                                date = today, 
                                time__gte = time_now,
                                is_closed = False,
                                created_for = user
                            ).count()
        t_closed_appointments = Appointment.objects.filter(
                                date = today,
                                is_closed = True,
                                created_for = user
                              ).count()
        t_past_due_appointments = Appointment.objects.filter(
                                    date = today,
                                    time__lt = time_now,
                                    is_closed = False,
                                    created_for = user
                                ).count()
        
        return Response({
            'today': {
                'total': t_total_appointments,
                'open': t_open_appointments,
                'closed': t_closed_appointments,
                'past_due': t_past_due_appointments
            },
            'lifetime': {
                'total': l_total_appointments,
                'open': l_open_appointments,
                'closed': l_closed_appointments,
                'past_due': l_past_due_appointments
            }
        })
    else:
        return Response(
            status = HTTP_401_UNAUTHORIZED,
            data = {
                'user': ['Invalid user.']
            }
        )
        
class CalendarView(ListAPIView):
    queryset = Appointment.objects.all()\
                .select_related('created_for__avatar')\
                .order_by('date', 'time')
    serializer_class = CalendarSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CalendarFilter    

@api_view(['GET'])
def get_todays_appointments(request):
    user = request.user
    if user.is_authenticated:
        today = datetime.date.today()
        appointments = Appointment.objects.filter(created_for = user, date = today).order_by('time')
        serializer = DailyAppointmentSerailizer(appointments, many = True)
        return Response(data = serializer.data)
    else:
        return Response(
            status = HTTP_401_UNAUTHORIZED,
            data = {
                'user': ['Invalid user.']
            }
        )