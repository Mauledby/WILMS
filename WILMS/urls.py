from django.contrib import admin
from django.urls import path, include
from wallet import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path
from .views import serve_manifest


from django.contrib.auth import views as auth_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('wallet/', include('wallet.urls', namespace='wallet')),  # Include app-specific URLs with the 'wallet' namespace
    path('walletAPI/', include(('walletAPI.urls', 'walletAPI'), namespace='walletAPI')),
    path('polls/', include(('polls.urls', 'polls'), namespace='polls')),
    path('wiladmin/', include('wiladmin.urls')),
    path('api/', include(('api.urls', 'api'), namespace='api')),
    path('' , views.IndexView.as_view(), name='index'),
    path('facility/', include('facility.urls')),

    re_path(r'^manifest\.json$', serve_manifest),
    
    
    
    path('logout/',views.UserLogoutView.as_view(),name='logout'),

    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='wallet/password_reset.html'), name="password_reset"),

    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(template_name='wallet/password_reset_done.html'), name = "password_reset_done"),

    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='wallet/password_reset_confirm.html'), name='password_reset_confirm'),

    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='wallet/password_reset_complete.html'), name='password_reset_complete'),




    
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
