from djoser.views import UserViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.viewsets import ModelViewSet
from .filters import CustomUserFilter
from .models import Avatar
from .pagination import CustomPagination
from .serializers import CustomUserSerializer, AvatarSerializer

User = get_user_model()

class AvatarsViewSet(ModelViewSet):
    serializer_class = AvatarSerializer
    permission_classes = []
    
    def get_queryset(self):
        return Avatar.objects.filter(user = self.kwargs['user_id'])
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'user_id': self.kwargs['user_id']
        }
    
    def get_permissions(self):
        # Restrict PUT and DELETE methods to admin users
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        # Allow unrestricted access for other methods
        return [AllowAny()]

class CustomUserViewSet(UserViewSet):
    queryset = User.objects.select_related('avatar').all()
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
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsAdminUser])
    def doctors(self, request, *args, **kwargs):
        active_doctors = self.queryset.filter(is_active=True, is_staff=False)
        serializer = CustomUserSerializer(active_doctors, many=True)
        return Response(serializer.data)