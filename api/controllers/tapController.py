import datetime
import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework import *
# from rest_framework.views import APIView
from rest_framework import status
from api.models import Attendance
from api.models import Booking,Venue,User as user,Attendee
from api.serializers import BookingSerializer, VenueSerializer,BookingRequestSerializer,UserSerializer,AttendeeSerializer
# from rest_framework.permissions import IsAuthenticated,AllowAny
from api.jwt_util import decode_user
# from datetime import datetime, date, timedelta
from rest_framework.decorators import api_view
from wallet.models import UserProfileInfo
from wallet.models import User as WalletUser
# from django.contrib.auth.models import User
from django.http import JsonResponse
# from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class TapController():
    @api_view(['POST'])
    def logAttendance(request):        
        request_body = json.loads(request.body.decode('utf-8'))
        dateToday=datetime.datetime.now().date()
        timeNow=datetime.datetime.now().time()
        thirtyMinutes=datetime.datetime.today()+datetime.timedelta(minutes = +30)
        # mao na pra makuha ang name sa user
        rfid=request_body['rfid']
        userEmail=UserProfileInfo.objects.get(rfid_value=rfid)
        
        # store ang email as name variable so name=email in this case sorry bad practice
        name=userEmail
        print(name)
        hasBooking=0
        signedInAttendance=Attendance.objects.filter(name=name,isSignedIn=True)
        print(len(signedInAttendance))
        if len(signedInAttendance) != 0:
            
            for attendance in signedInAttendance:
                booking=Booking.objects.get(pk=attendance.booking.id)
                attendance.isSignedIn=False
                attendance.signOutTime=datetime.datetime.now().time()
                
                # convert nato ang end
                bookingTimePlusTen =datetime.datetime.combine(datetime.datetime.now().date(),datetime.time(booking.endTime.hour,booking.endTime.minute))+datetime.timedelta(minutes=+10)
               
                # overstaying
                if(bookingTimePlusTen.time()<datetime.datetime.now().time() or booking.date<dateToday):
                    print("3gred")
                    if(booking.isOverstayingCharged==False):
                        booking.isOverstayingCharged=True
                        booking.save()
                        userProfile=UserProfileInfo.objects.get(user=booking.user)
                        # deduct sa points sa user
                        if booking.coins==0:
                           pointDeduction=booking.points*0.3
                           userProfile.point_balance-=pointDeduction
                        # deduct sa coins sa user 
                        elif booking.points==0:
                            coinDeduction=booking.coins*0.3
                            userProfile.coin_balance-=coinDeduction
                        userProfile.save()
                    attendance.isOverstaying=True                    
                    
                else:
                    attendance.isOverstaying=False
                    
                attendance.save()
                    
                    
            return JsonResponse({"message":"You are Now Logged Out","state":"logout"},status=status.HTTP_200_OK)
        else:
            for attendee in Attendee.objects.filter(name=name):
                booking=Booking.objects.get(pk=attendee.booking.id)
                if len(Attendance.objects.filter(booking=booking,name=name))!=0:
                    hasBooking=0
                else:                   
                    
                    
                    if booking.date==dateToday and booking.endTime > timeNow and booking.startTime<=thirtyMinutes.time() and booking.status=="Booked":
                        
                        if booking.isUsed==False:                        
                            booking.isUsed=True
                            booking.save()
                        venue=Venue.objects.get(id=booking.venue.id)
                        hasBooking=1
                        Attendance.objects.create(signInTime=datetime.datetime.now().time(),venueName=venue.name,booking=booking,name=name,venueId=venue.id,isSignedIn=True)
            if hasBooking <= 0:
                return JsonResponse({"message":"You Have No Booking within 30 minutes!","state":"noBooking"},status=status.HTTP_200_OK)
            else:
                return JsonResponse({"message":"Welcome To The Lab!","state":"login"},status=status.HTTP_200_OK)
    # @api_view(['GET'])
    # def getCurrentBookings(request):
    #     # auth_header=request.META['HTTP_AUTHORIZATION']
    #     # # pra mawa ang word na Bearer
    #     # token=auth_header[7:len(auth_header)+1]
    #     # print(token)
    #     # user=decode_user(token)
    #     # owner=user['user_id']
    #     week_start = date.today()
    #     week_start -= timedelta(days=week_start.weekday())
    #     week_end = week_start + timedelta(days=14)        
    #     obj = Booking.objects.filter(date__gte=week_start,date__lt=week_end,status="Booked",)
    #     serializer = BookingSerializer(obj,many=True)
    #     return Response(serializer.data,status=status.HTTP_200_OK)
    
    # @api_view(['POST'])
    # def saveBooking(request):       
    #     if request.method=='POST':
    #         serializer= BookingRequestSerializer(data=request.data)   
                
    #         if serializer.is_valid():
    #             date=serializer.validated_data['date']
    #             # calculate hours_difference
    #             startTime=serializer.validated_data['startTime']
    #             endTime=serializer.validated_data['endTime']
    #             duration=datetime.combine(date,endTime)-datetime.combine(date,startTime)
    #             hours_difference = (duration).total_seconds()/3600.0
    #             serializer._validated_data['duration']=hours_difference
    #             # set status to booked
    #             serializer._validated_data['status']='Booked'
    #             serializer.save()
    #             response_data={
    #                 'message':'Succesfully booked'
    #             }
    #             return Response(serializer.data,status=status.HTTP_201_CREATED)
    #         return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)