from datetime import datetime
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
# from datetime import datetime, date, timedelta
from rest_framework.decorators import api_view
# from django.contrib.auth.models import User
from django.http import JsonResponse
# from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.
class ManagementController():
    ##first section: api for admin view of booking management
    @api_view(['GET'])
    # get all bookings pra sa admin kay makakita ang admin sa tanan booking    
    def getAllBooking(request):        
        bookings=Booking.objects.all().order_by('-date','-startTime')        
        serializer=BookingSerializer(bookings, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    @api_view(['GET'])    
    def getAllCancelledBooking(request):        
        bookings=Booking.objects.filter(status="Cancelled").order_by('-date','-startTime')     
        serializer=BookingSerializer(bookings, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    @api_view(['GET'])
    def getAllNoShowBooking(request):

        bookings=Booking.objects.filter(date__lte=datetime.today(),endTime__lt=datetime.now().strftime("%H:%M:%S")).order_by('date','startTime')
        print(datetime.today())
        serializer=BookingSerializer(bookings,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)




    ##2nd section ni which is user view of booking management.
    @api_view(['GET'])
    def getAllUserBookings(request, user_id):
        today = datetime.now()       
        my_bookings = Booking.objects.filter(user_id=user_id).order_by('-date','-startTime')
        serializer = BookingSerializer(my_bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @api_view(['GET'])
    def getUpcomingUserBookings(request, user_id):
        today = datetime.now()       
        upcoming_bookings = Booking.objects.filter(date__gte=today, user_id=user_id).order_by('-date','-startTime')
        serializer = BookingSerializer(upcoming_bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @api_view(['GET'])
    def getHistoryUserBookings(request, user_id):
        today = datetime.now()
        history_bookings = Booking.objects.filter(date__lt=today, user_id=user_id).order_by('-date','-startTime')
        serializer = BookingSerializer(history_bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    ##3rd section for editting booking details
    @api_view(['DELETE'])
    def removeBookingAttendee(request, attendee_id):
        attendee= Attendee.objects.get(id=attendee_id)
        attendee.delete()
        serializer = AttendeeSerializer(attendee)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @api_view(['POST'])
    def addBookingAttendee(request,booking_id):
        request_body = json.loads(request.body.decode('utf-8'))
        booking=Booking.objects.get(id=booking_id)
        user_id=request_body['user_id']
        name=request_body['name']
        Attendee.objects.create(name=name,booking=booking,user_id=user_id)
        return Response({"attendee added"},status=status.HTTP_200_OK)
    @api_view(['PUT'])
    def editBooking(request,booking_id):
        request_body = json.loads(request.body.decode('utf-8'))
        title=request_body['title']
        purpose=request_body['purpose']
        
        booking=Booking.objects.get(id=booking_id)
        booking.description=title
        booking.purpose=purpose
        
        booking.save()
        return Response({"booking saved"},status=status.HTTP_200_OK)