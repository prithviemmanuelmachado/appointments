from django.core.exceptions import ValidationError

def validate_file_size(file):
    max_file_size_in_kb = 1000
    
    if file.size > max_file_size_in_kb * 1024:
        raise ValidationError(
            message = f'File cannot be bigger than {max_file_size_in_kb} KB.'
        )