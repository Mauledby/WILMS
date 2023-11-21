from django.contrib.auth.decorators import user_passes_test

def superuser_required(user):
    return user.is_superuser

superuser_required = user_passes_test(superuser_required)
