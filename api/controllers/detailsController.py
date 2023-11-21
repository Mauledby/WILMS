import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework import *
# from rest_framework.views import APIView
from rest_framework import status
from api.models import Booking,Venue,User as user,Attendee
from api.serializers import BookingSerializer, VenueSerializer,BookingRequestSerializer,UserSerializer,AttendeeSerializer
# from rest_framework.permissions import IsAuthenticated,AllowAny
from api.jwt_util import decode_user
from datetime import datetime, date, timedelta
from rest_framework.decorators import api_view
# from django.contrib.auth.models import User
from django.http import JsonResponse
# from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.
class DetailsController():
    @api_view(['GET'])
    def cancelBooking(request,id):
        # ako lng gistore ug lain variable ang id pra di libog ang query
        booking_id=id
        booking=Booking.objects.get(id=booking_id)
        booking.status="Cancelled"
        booking.save()
        serializer=BookingSerializer(booking)
        return Response(serializer.data,status=status.HTTP_200_OK)