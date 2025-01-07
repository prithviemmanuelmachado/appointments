from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework import serializers

from .models import Appointment, Note
from .validators import validate_appointment_time

class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    is_editable = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
     
    class Meta:
        model = Note
        fields = [
            'id',
            'description',
            'created_by',
            'avatar',
            'created_on',
            'is_editable'
        ]
    
    def create(self, validated_data):
        appointment_id = self.context['appointment_id']
        user = self.context['user']
        
        note = Note(**validated_data)
        note.appointment_id = appointment_id
        note.created_by = user
        note.save()
        return note
    
    def update(self, instance: Note, validated_data):        
        instance.description =  validated_data['description']
        instance.created_by = self.context['user']
        instance.created_on = now()        
        instance.save()
        return instance
    
    def get_is_editable(self, obj):
        user = self.context['user']
        return user.is_staff or obj.created_by == user
    
    def get_avatar(self, obj):
        if obj.created_by and obj.created_by.avatar:
            return obj.created_by.avatar.avatar.url
        return None

class CreateAppointmentSerializer(serializers.ModelSerializer):
    User = get_user_model()
    created_for = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)
    created_for_full_name = serializers.SerializerMethodField()
    visit_type_full = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'date', 
            'time', 
            'visit_type', 
            'visit_type_full',
            'created_for', 
            'created_for_full_name',
            'is_closed', 
            'description'
        ]
        read_only_fields = [
            'is_closed',
        ]

    def get_created_for_full_name(self, obj):
        return f"{obj.created_for.first_name} {obj.created_for.last_name}"
    
    def get_visit_type_full(self, obj):
        return obj.get_visit_type_display() 

    def create(self, validated_data):
        user = self.context['user']
        
        if not user.is_staff:
            validated_data['created_for'] = user
        
        validate_appointment_time(validated_data, None)
        
        appointment = Appointment.objects.create(**validated_data)
        return appointment
    
class AppointmentSerializer(serializers.ModelSerializer):
    User = get_user_model()
    created_for = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)
    created_for_full_name = serializers.SerializerMethodField()
    visit_type_full = serializers.SerializerMethodField() 

    class Meta:
        model = Appointment
        fields = [
            'id',
            'date',
            'time',
            'visit_type',
            'visit_type_full',
            'created_for',
            'created_for_full_name',
            'is_closed',
            'description'
        ]
        read_only_fields = [
            'created_for',
        ]
        
    def get_created_for_full_name(self, obj):
        return f"{obj.created_for.first_name} {obj.created_for.last_name}"

    def get_visit_type_full(self, obj):
        return obj.get_visit_type_display() 
    
    def update(self, instance, validated_data):
        validate_appointment_time(validated_data, instance.id)
        return super().update(instance, validated_data)
    
class CalenderSerializer(serializers.ModelSerializer):
    created_for = serializers.StringRelatedField()
    created_for_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'date',
            'time',
            'created_for',
            'created_for_avatar'
        ]
        read_only_fields = [
            'id',
            'date',
            'time',
            'created_for',
            'created_for_avatar'
        ]
        
    def get_created_for_avatar(self, obj):
        try:
            return obj.created_for.avatar.avatar.url
        except AttributeError:
            return None