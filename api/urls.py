from django.urls import path
from .views import *
from api.controllers.calendarController import CalendarController
from api.controllers.bookingController import BookingController
from api.controllers.detailsController import DetailsController
from api.controllers.managementController import ManagementController
from api.controllers.dashboardController import DashboardController
from api.controllers.logsController import *
from api.controllers.tapController import TapController
from api.controllers.logsController import LogsController
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    # path('booking/',BookingDetail.as_view(),name='creation'),
    # path('currentBookings/',CurrentBookings.as_view(),name='currentBookings'),
    # path('getBookingByVenue/<id>/',BookingByVenue.as_view(),name='bookingsByVenue'),
    # path('booking/',BookingDetail.as_view(),name='creation'),

    ##Calendar controllers
    path('createBooking/',CalendarController.saveBooking,name='create booking'),
    path('currentBookings/',CalendarController.getCurrentBookings,name='current bookings'),
    ##Controllers na wa pa na separate
    path('getAttendees/<id>/',AttendeeDetail.as_view(),name='getBookingAttendees'),
    path('users/',Users.as_view(),name='getAllUsers'),

    #view details na controller
    path('cancelBooking/<id>',DetailsController.cancelBooking,name="cancelbooking"),

    #booking creation controller
    path('calculateCost/',BookingController.calculateCost,name="calculate payment or cost"),
    path('getUsers/',BookingController.getAllUsers,name="get all users"),

    #booking management controller
    #admin view sa booking management
    path('getDurations/',BookingController.getDurations,name="calculate total hour for users"),
    path('getAllBookings/',ManagementController.getAllBooking,name="get all bookings"),
    path('getAllCancelledBookings/',ManagementController.getAllCancelledBooking,name="get all cancelled bookings"),
    path('getAllNoShowBookings/',ManagementController.getAllNoShowBooking,name="get all no show bookings"),
    #for non admin or normal users  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getAllUserBookings/<user_id>/',ManagementController.getAllUserBookings,name="get booking of user"),
    path('getUpcomingUserBookings/<user_id>/',ManagementController.getUpcomingUserBookings,name="get upcoming bookings of user"),
    path('getHistoryUserBookings/<user_id>/',ManagementController.getHistoryUserBookings,name="get user bookings in the past"),
    #for editting
    path('deleteAttendee/<attendee_id>/',ManagementController.removeBookingAttendee,name="remove attendee"),
    path('addAttendee/<booking_id>/',ManagementController.addBookingAttendee,name="add attendee for booking"),
    path('editBooking/<booking_id>/',ManagementController.editBooking,name="update booking details"),
    #for tap or sign in
    path('logAttendance/',TapController.logAttendance,name="tapping or sign in"),
    #for dashboard
    path('getSignedIn/',DashboardController.getSignedIn,name='get all signed in currently in facilities'),
    path('getExpected/',DashboardController.getExpected,name="get all expected count for each facility"),
    path('getWaiting/',DashboardController.getWaiting,name="get all waiting for bookings"),
    path('getOngoing/',DashboardController.getOngoing,name="get all ongoing"),
    path('getOverstaying/',DashboardController.getOverstaying,name="get overstaying beyond their booking"),
    path('login/',login,name='login'),
    path('signup/',signup,name='signup'),
    #for logs page
    path('getAllAttendance/',LogsController.getAllAttendance, name="get all attendance"),
]