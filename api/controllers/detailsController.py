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
from wallet.models import User as WalletUser,UserProfileInfo
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
        user=UserProfileInfo.objects.get(user=booking.user)
        # if coins iya gamit so 0 ang points
        if booking.points==0:
            user.coin_balance=user.coin_balance+(booking.coins*0.7)
        # if points iya gamit so 0 ang coins 
        elif booking.coins==0:
            user.point_balance=user.point_balance+(booking.points*0.7)
        booking.status="Cancelled"
        user.save()
        booking.save()
        serializer=BookingSerializer(booking)
        return Response(serializer.data,status=status.HTTP_200_OK)