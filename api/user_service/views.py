from djoser.views import UserViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .filters import CustomUserFilter
from .pagination import CustomPagination
from .serializers import CustomUserSerializer

User = get_user_model()

class CustomUserViewSet(UserViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter
    ]
    filterset_class = CustomUserFilter
    ordering_fields = [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'is_staff',
        'is_active',
    ]
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated, IsAdminUser]