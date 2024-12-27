from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def set_already_activated_state(sender, instance, created, **kwargs):
    if not created:
        if instance.is_active and not instance.is_already_activated:
            # Mark the user as already activated
            instance.is_already_activated = True
            instance.save(update_fields=["is_already_activated"])
