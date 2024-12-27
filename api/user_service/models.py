from django.contrib.auth.models import AbstractUser
from django.db import models
from .validators import validate_file_size

class User(AbstractUser):
    email = models.EmailField(unique = True)
    is_already_activated = models.BooleanField(default = False)
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
class Avatar(models.Model):
    user = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
        primary_key = True,
        related_name = 'avatar'
    )
    avatar = models.ImageField(
        upload_to='media/',
        null=True,
        blank=True,
        validators=[
            validate_file_size
        ]
    )