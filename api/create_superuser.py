import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'appointments_api.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()

    # Input credentials
    username = input("Enter username: ")
    email = input("Enter email: ")
    password = input("Enter password: ")

    # Check if superuser already exists
    if User.objects.filter(username=username).exists():
        print(f"Superuser with username '{username}' already exists.")
        return

    # Create superuser
    try:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser '{username}' created successfully!")
    except Exception as e:
        print(f"Error creating superuser: {e}")

if __name__ == "__main__":
    create_superuser()