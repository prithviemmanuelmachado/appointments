from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework import serializers

from .models import Appointment, Note

class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    is_editable = serializers.SerializerMethodField()
     
    class Meta:
        model = Note
        fields = [
            'id',
            'description',
            'created_by',
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

class CreateAppointmentSerializer(serializers.ModelSerializer):
    User = get_user_model()
    notes = NoteSerializer(write_only=True)
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
            'notes'
        ]
        read_only_fields = [
            'is_closed',
        ]

    def get_created_for_full_name(self, obj):
        return f"{obj.created_for.first_name} {obj.created_for.last_name}"
    
    def get_visit_type_full(self, obj):
        return obj.get_visit_type_display() 

    def create(self, validated_data):
        note_data = validated_data.pop('notes', [])
        user = self.context['user']
        if not user.is_staff:
            validated_data['created_for'] = user
        appointment = Appointment.objects.create(**validated_data)
        if note_data:
            Note.objects.create(appointment=appointment, created_by=self.context['request'].user, **note_data)
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
        ]
        read_only_fields = [
            'created_for',
        ]
        
    def get_created_for_full_name(self, obj):
        return f"{obj.created_for.first_name} {obj.created_for.last_name}"

    def get_visit_type_full(self, obj):
        return obj.get_visit_type_display() 