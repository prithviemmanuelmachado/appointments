from decouple import config
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import EmailMessage
import os

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def user_activated_for_first_time(sender, instance, created, **kwargs):    
    if not created:
        if instance.is_active and not instance.is_already_activated:
            #send welcome email 
            base_dir = os.path.dirname(os.path.abspath(__file__))
            base_dir = os.path.dirname(base_dir)
            template_path = os.path.join(base_dir, 'email_templates', 'welcome.html')
            with open(template_path, 'r') as file:
                html_content = file.read()
            
            html_content = html_content.replace('{{username}}', instance.username)
            html_content = html_content.replace('{{site_name}}', config('SITE_NAME'))
            email = EmailMessage(
                f'Welcome to {config("SITE_NAME")}',
                html_content,
                [instance.email],
            )
            email.content_subtype = "html"
            email.send()
            # Mark the user as already activated
            instance.is_already_activated = True
            instance.save(update_fields=["is_already_activated"])
