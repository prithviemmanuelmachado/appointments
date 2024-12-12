from djoser.serializers import UserCreateSerializer, UserSerializer

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = [
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name', 
            'is_staff'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_staff:
            # Activate user if staff
            validated_data['is_active'] = True
        else:
            # Deactivate user if not staff
            validated_data['is_active'] = False
            validated_data['is_staff'] = False

        user = super().create(validated_data)
        return user
    
class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'is_active'
        ]