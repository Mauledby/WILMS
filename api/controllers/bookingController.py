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
from api.models import Booking,Venue,User as user,Attendee
from api.serializers import BookingSerializer, VenueSerializer,BookingRequestSerializer,UserSerializer,AttendeeSerializer
from wallet.models import User as WalletUser
# from rest_framework.permissions import IsAuthenticated,AllowAny
from api.jwt_util import decode_user
# from datetime import datetime, date, timedelta
from rest_framework.decorators import api_view
# from django.contrib.auth.models import User
from django.http import JsonResponse
from facility.models import Setting_Facility
# from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class BookingController():
    @api_view(['POST'])
    def getDurations(request):    
        request_body = json.loads(request.body.decode('utf-8'))    
        chosen_date=request_body['date']
        user_id=request_body['id']
        # chosen_date="2023-11-05"
        converted_date=datetime.datetime.strptime(chosen_date, "%Y-%m-%d")
        
        
        monday=converted_date-datetime.timedelta(converted_date.weekday())
        sunday=monday+datetime.timedelta(days=6)
        print(sunday)
        obj = Booking.objects.filter(date__gte=monday.date(),date__lte=sunday.date(),user=user_id,status="Booked")
        duration=0
        for item in obj:
            duration+=item.duration
        serializer = BookingSerializer(obj,many=True)
        return Response({"duration":duration,"data":serializer.data,"monday":monday},status=status.HTTP_200_OK)
    @api_view(['GET'])
    def getAllUsers(request):        
        obj = WalletUser.objects.all()
        serializer = UserSerializer(obj,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    # @api_view(['POST'])
    # def calculateCancelCost(request,booking_id):  
    #     booking=Booking.objects.get(facility=booking_id)
    #     #kuwang ug input start time ug end time
    #     request_body = json.loads(request.body.decode('utf-8'))
    #     # starttime split
        
    #     data={"cost":cost}
    #     return JsonResponse(data)
    @api_view(['POST'])
    def calculateCost(request,venue_id):  
        facility=Setting_Facility.objects.get(facility=venue_id)
        #kuwang ug input start time ug end time
        request_body = json.loads(request.body.decode('utf-8'))
        # starttime split
        sh,sm,ss= request_body['startTime'].split(':')
        #endtime split
        eh,em,es= request_body['endTime'].split(':')
        #subtract their duration
        duration =float((float(eh)*3600+float(em)*60+float(es))-(float(sh)*3600+float(sm)*60+float(ss)))/3600
        numStudents = request_body['numOfStudents']
        
        numComputers= request_body['numOfComputers']
        print(numStudents)
        # data={"numOfStudents":numStudents}
        cost=float(0)       
        if(numComputers>0):
            cost+=2*duration        
        else:
            cost+=duration
        cost*=numStudents
        cost*=facility.facility.rateperhour
        data={"cost":cost}
        return JsonResponse(data)
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