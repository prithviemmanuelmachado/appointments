from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("users/", include('user_service.urls')),
    path("auth/", include('djoser.urls')),
    path("auth/", include('djoser.urls.jwt')),
]
