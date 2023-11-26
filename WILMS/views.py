import os
from django.conf import settings
from django.http import JsonResponse
from . import settings



def serve_manifest(request):
    for static_dir in settings.STATICFILES_DIRS:
        manifest_path = os.path.join(static_dir, 'manifest.json')
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r') as manifest_file:
                manifest_content = manifest_file.read()
            return JsonResponse({'manifest': manifest_content})
    
    return JsonResponse({'error': 'Manifest file not found'}, status=404)
