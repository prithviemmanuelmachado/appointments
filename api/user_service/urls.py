from django.urls import path, include
from rest_framework_nested import routers
from .views import CustomUserViewSet, AvatarsViewSet

router = routers.DefaultRouter()
router.register(r'', CustomUserViewSet, basename='user')

user_router = routers.NestedDefaultRouter(router, '', lookup = 'user')
user_router.register(
    'avatars',
    AvatarsViewSet,
    basename = 'user-avatars'
)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(user_router.urls)),
]