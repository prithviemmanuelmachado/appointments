from djoser.views import UserViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .pagination import CustomPagination
from .serializers import CustomUserSerializer

User = get_user_model()

class CustomUserViewSet(UserViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
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