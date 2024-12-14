from django.contrib.auth import get_user_model
from django_filters import rest_framework as filters

User = get_user_model()

class CustomUserFilter(filters.FilterSet):
    last_name = filters.CharFilter(field_name='last_name', lookup_expr='icontains')
    first_name = filters.CharFilter(field_name='first_name', lookup_expr='icontains')
    email = filters.CharFilter(field_name='email', lookup_expr='icontains')
    username = filters.CharFilter(field_name='username', lookup_expr='icontains')

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_staff', 
            'is_active'
        ]