from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Avatar

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name', 
            'is_staff'
        ]
        
    def validate(self, attrs):
        """
        Skip password validation during user creation as temp password is auto generated
        """
        User = get_user_model()
        user = User(**attrs)
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        random_password = get_random_string(length=8)
        validated_data['password'] = make_password(random_password)
        if request and request.user.is_staff:
            # Activate user if staff
            validated_data['is_active'] = True
        else:
            # Deactivate user if not staff
            validated_data['is_active'] = False
            validated_data['is_staff'] = False

        user = super().create(validated_data)
        return user
    
class AvatarSerializer(serializers.ModelSerializer):
    class Meta():
        model = Avatar
        fields = [
            'user_id',
            'avatar'
        ]
        
    def create(self, validated_data):
        user_id = self.context['user_id']
        if Avatar.objects.filter(user_id=user_id).exists():
            raise ValidationError({"error": "An avatar already exists for this user."})
        avatar = Avatar(**validated_data)
        avatar.user_id = user_id
        avatar.save()
        return avatar
    
    def update(self, instance: Avatar, validated_data):
        instance.avatar = validated_data['avatar']
        instance.user_id = self.context['user_id']
        instance.save()
        return instance
    
class CustomUserSerializer(UserSerializer):
    avatar = AvatarSerializer(read_only=True)
    
    class Meta(UserSerializer.Meta):
        fields = [
            'id',
            'username',
            'email',
            'avatar',
            'first_name',
            'last_name',
            'is_staff',
            'is_active',
            'is_already_activated'
        ]
        read_only_fields = [
            'is_already_activated',
        ]