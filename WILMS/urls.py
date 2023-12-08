from django.contrib import admin
from django.urls import path, include
from api.views import ReactAppView
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

# for api front end
    path('booking/login/', ReactAppView.as_view(), name='login'),
    # path('', ReactAppView.as_view(), name='login'),  # Uncomment this line if you want / to point to the login page
    path('booking/tracker/', ReactAppView.as_view(), name='tracker'),
    path('booking/calendar/', ReactAppView.as_view(), name='calendar'),
    path('booking/logs/', ReactAppView.as_view(), name='attendance_logs'),
    path('booking/bookings/', ReactAppView.as_view(), name='my_reservations'),
    path('attendance/', ReactAppView.as_view(), name='attendance'),
    path('booking/attendance/', ReactAppView.as_view(), name='booking_attendance'),
    path('react/', ReactAppView.as_view(), name='react_app'),


    
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
