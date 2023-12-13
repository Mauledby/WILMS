"""wil URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.AdminLoginController.as_view(), name='index'),
    path('login', views.AdminLoginController.as_view(), name='adminlogin'),
    path('logout', views.handleLogout, name='adminlogout'),
    path('admindashboard', views.AdminDashboardController.as_view(), name='admindashboard'),
    path('updatedashboard', views.AdminDashboardController.update_dashboard, name='updatedashboard'),
    path('reportlogs', views.AdminReportLogsController.as_view(), name='reportlogs'),
    path('walkindashboard', views.AdminWalkinDashboardController.as_view(), name='walkindashboard'),
    path('reserveddashboard', views.AdminReservedDashboardController.as_view(), name='reserveddashboard'),
    path('updatebooking/<int:bookingid>', views.AdminWalkinDashboardController.as_view(), name='updatebooking'),
    path('deletebooking/<int:bookingid>', views.AdminWalkinDashboardController.as_view(), name='deletebooking'),
    path('updatereserved/<int:id>', views.AdminReservedDashboardController.as_view(), name='updatereserved'),
    path('deletereserved/<int:id>', views.AdminReservedDashboardController.as_view(), name='deletereserved'),
    path('bookguest', views.BookGuestController.as_view(), name='bookguest'),
    path('workspaces', views.ViewWorkspacesController.as_view(), name='workspaces'),
    path('workspaces/<str:areaid>', views.ViewWorkspacesController.as_view(), name='usersinarea'),
    path('updateworkspaces', views.ViewWorkspacesController.update_workspaces, name='updateworkspaces'),
    path('test', views.TestController.as_view(), name='test'),
    path('test/<str:areaid>', views.TestController.as_view(), name='testusers'),
]
