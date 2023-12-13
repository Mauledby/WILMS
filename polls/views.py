from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from polls.user_login_controller import UserLoginController
from .assigned_area_controller import AssignedAreaController
from polls.models import AssignedArea
from polls.time_monitoring import TimeMonitoringController
from wiladmin.models import WalkinBookingModel
from .facility_map_controller import FacilityMapController
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .user_login_controller import UserLoginController
from django.contrib.auth.forms import AuthenticationForm

from polls.user_login_controller import UserLoginController, user_logout
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from polls.models import Timer
from django.views import View
from polls.models import Timer 
from asgiref.sync import sync_to_async

from .models import AssignedArea, Booking
from django.db import models

from collections import defaultdict
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from api.models.BookingModel import Booking as ResBooking




from django.http import JsonResponse

facility_controller = FacilityMapController()
assigned_area_controller = AssignedAreaController()
time_monitoring_controller = TimeMonitoringController()
user_login_controller = UserLoginController()



def show_message_view(request):
    message = facility_controller.showMessage(request)
    return JsonResponse({'message': message})

@login_required(redirect_field_name="polls:userlogin")
def map(request):

    user = request.user.id
    userreserve = ResBooking.objects.filter(user_id=user).count()
    bookings = WalkinBookingModel.objects.all().count()
    userbooks = WalkinBookingModel.objects.filter(userid=user).count()
    area_bookings = AssignedArea.objects.values('area_id').annotate(booked_count=models.Count('area_id'))
    
    areas = []
    for area_id in ["A3", "A4", "A5", "A6", "A8", "A9", "A7"]:
            if area_id == "A7":
                total_count = 24 
            else:
                total_count = 6
            area_data = next((item for item in area_bookings if item['area_id'] == area_id), {'booked_count': 0})
            areas.append({'area_id': area_id, 'booked_count': area_data['booked_count'], 'total_count': total_count})

    
    if bookings != 0 and userbooks != 0:
        userbooking = WalkinBookingModel.objects.get(userid=user)
        

        if userbooking.status=="Booked":
            return redirect('polls:timer')
        else:
            return render(request, 'wil/map.html', {'areas': areas})
    elif bookings != 0 and userreserve != 0:
        userreservebooking = ResBooking.objects.get(user=user)
        if userreservebooking.status=="Booked":   
            return redirect('polls:timer')
        else:
            return render(request,'wil/map.html', {'areas': areas})
    else:
        return render(request, 'wil/map.html', {'areas': areas})

@login_required(redirect_field_name="polls:userlogin")
def location(request):
    return assigned_area_controller.getAssignedArea(request)
@login_required(redirect_field_name="polls:userlogin")
def user_profile(request):
    return render(request, "wil/userprofile.html", {})


@login_required(redirect_field_name="polls:userlogin")
def timer(request):
    try:
       
        
        walkinbooking = WalkinBookingModel.objects.get(userid=request.user.id)
        reference = walkinbooking.referenceid

        context = {
            'id_number': walkinbooking.userid if walkinbooking else 'N/A',
            'booking_reference_number': walkinbooking.referenceid if walkinbooking else 'N/A',
            'assigned_area': reference[:2] if reference else 'N/A',
            'date_of_use': walkinbooking.start_time if walkinbooking else 'N/A',
            
        }
        
        return render(request, "wil/timer.html", context=context)
    except WalkinBookingModel.DoesNotExist:
        
        return redirect('polls:userdashboard')




@login_required(redirect_field_name="polls:userlogin")
def user_login(request):
    return user_login_controller.as_view()(request)

def user_logout(request):
    logout(request)
    return redirect('polls:user_login')

@login_required(redirect_field_name="polls:userlogin")
def user_dashboard(request):
    
    area_bookings = AssignedArea.objects.values('area_id').annotate(booked_count=models.Count('area_id'))
    
    areas = []
    for area_id in ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"]:
        if area_id == "A1" or area_id == "A2":
            total_count = 1
        elif area_id == "A7":
            total_count = 24
        else:
            total_count = 6

        area_data = next((item for item in area_bookings if item['area_id'] == area_id), {'booked_count': 0})
        areas.append({'area_id': area_id, 'booked_count': area_data['booked_count'], 'total_count': total_count})

    
    try:
        reservedbookingcount = ResBooking.objects.filter(user_id=request.user.id).count()
        booking = ResBooking.objects.filter(user_id=request.user.id)
        if(reservedbookingcount > 0):
            if(booking.status == "Pending"):
                area_id = booking.reference_number
                context = {
                    'area_id': area_id[:2],
                    'reference_number': booking.reference_number,
                    'date': booking.date,
                    }
                return render(request, "wil/activebooking.html", context)
            else:
                timer = Timer.objects.get(user_id=request.user.email)
                context = {
                    'id_number': booking.user_id,
                    'booking_reference_number': booking.reference_number,
                    'assigned_area': booking.area_id,
                    'date_of_use': booking.date,
                    'timer_data': {
                        'minutes': timer.minutes,
                        'seconds': timer.seconds,
                    }
                }
                
                return render(request, "wil/timer.html", context)
            
    except Booking.DoesNotExist:
        areas = []
        for area_id in ["A1", "A2", "A3", "A4", "A5","A6"]:
            area_data = next((item for item in area_bookings if item['area_id'] == area_id), {'booked_count': 0})
            total_count = 6
            areas.append({'area_id': area_id, 'booked_count': area_data['booked_count'], 'total_count': total_count})
        
    return render(request, "wil/userdashboard.html", {'areas': areas})


def get_timer_data(request):
    
    timers = Timer.objects.all().count()
    
    if timers == 0:
        return redirect(user_dashboard)
    else:
        usertimer = Timer.objects.get(user_id=request.user.id)
    
        if usertimer is not None and usertimer.session_ended != True:
            if not usertimer.session_ended:
                if usertimer.seconds > 0:
                    usertimer.seconds -= 1
                elif usertimer.minutes > 0:
                    usertimer.minutes -= 1
                    usertimer.seconds = 59
                else:
                    usertimer.session_ended = True
                
                usertimer.save()

            timer_data = {
                'minutes': usertimer.minutes,
                'seconds': usertimer.seconds,
                'session_ended': usertimer.session_ended,
            }

            return JsonResponse(timer_data)
        
        else:
            return render(request, "wil/userdashboard.html", {})
@login_required
def end_session_view(request):
    if request.method == 'POST':
        
        try:
            timer = Timer.objects.get(pk=str(request.user.id))
            timer.session_ended = True
            timer.save()

            return JsonResponse({'success': True})

        except Timer.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Timer not found for the user.'})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})



def get_booking_info(request):
    
    area_bookings = AssignedArea.objects.values('area_id').annotate(booked_count=models.Count('area_id'))
    
    
    data = {}
    for area_data in area_bookings:
        area_id = area_data['area_id']
        booked_count = area_data['booked_count']
        data[area_id] = booked_count
    
    return JsonResponse(data)


from api.models.BookingModel import Booking as ResBooking

def get_reservebooking_info(request):
    try:
        
        booking = ResBooking.objects.first()

       
        if booking:
            booking_info = {
                'reference_number': booking.referenceNo,
                'area_id': booking.area_id,
                'date': booking.date.strftime('%Y-%m-%d'),
                'start_time': booking.startTime.strftime('%H:%M'),
                'end_time': booking.endTime.strftime('%H:%M'),
            }
            return JsonResponse(booking_info)
        else:
            return JsonResponse({'error': 'No booking found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)





#need ilisdan ang venue_id into area_id or addan og area_id
def get_calendar_data(request):
    area_data = ResBooking.objects.values('date', 'venue_id', 'startTime', 'endTime')

    events = []
    for booking in area_data:
        date = booking['date']
        venue_id = booking['venue_id']
        start_time = booking['startTime']
        end_time = booking['endTime']

        
        events.append({
            'title': f'Area {venue_id}',
            'start': date,
            'start_time': start_time.strftime('%H:%M'),
            'end_time': end_time.strftime('%H:%M'),
        })

    return JsonResponse(events, safe=False)



class ActiveBookingController(LoginRequiredMixin, View):
    
    login_url = 'userlogin'
    
    def get(self, request):
        
        booking = Booking.objects.get(user_id=request.user.id)
        if(booking.status == "Pending"):
            area_id = booking.reference_number
            context = {
                'area_id': area_id[:2],
                'reference_number': booking.reference_number,
                'date': booking.date,
                }
            return render(request, "wil/activebooking.html", context)
        else:
            return render(request, "wil/location.html")


area_button_click = facility_controller.areaButtonClick
insert_into_database = facility_controller.insertIntoAssignedAreaModel
hideMessage = facility_controller.hideMessage
handleYesButtonClick = facility_controller.handleYesButtonClick