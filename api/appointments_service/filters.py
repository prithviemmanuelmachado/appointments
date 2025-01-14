from django_filters import rest_framework as filters
from .models import Appointment

class CalendarFilter(filters.FilterSet):
    created_for = filters.CharFilter(method='filter_created_for')
    
    class Meta:
        model = Appointment
        fields = {
            'date': ['gt', 'lt'],
        }
        
    def filter_created_for(self, queryset, name, value):
        return queryset.filter(
            created_for__first_name__icontains=value
        ) | queryset.filter(
            created_for__last_name__icontains=value
        )

class CustomAppointmentFilter(filters.FilterSet):
    created_for = filters.CharFilter(method='filter_created_for')

    class Meta:
        model = Appointment
        fields = {
            'id': ['exact'],
            'date': ['exact', 'gt', 'lt'],
            'time': ['exact', 'gt', 'lt'],
            'visit_type': ['exact'],
            'is_closed': ['exact'],
        }

    def filter_created_for(self, queryset, name, value):
        return queryset.filter(
            created_for__first_name__icontains=value
        ) | queryset.filter(
            created_for__last_name__icontains=value
        )