import csv
import random
from django.db import connection
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from .models import WalkinBookingModel, AdminReportLogsModel
from polls.models import Timer, AssignedArea, Booking
from api.models.BookingModel import Booking as ResBooking
from django.views import View
from datetime import datetime
from django.utils import timezone
from .forms import BookGuest

class AdminLoginController(View):
    
    def handleLogin(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admindashboard')
        else:
            messages.error(request, 'Invalid Username or Password')
            return redirect('adminlogin')
        
    def get(self, request):
        return render(request, "wiladmin/login.html", {})
    
    def post(self, request):
        return self.handleLogin(request)

class AdminDashboardController(LoginRequiredMixin, View):
    
    login_url = 'adminlogin'
    
    def update_dashboard(request):
        today = timezone.now().date()
        totalwalkins = WalkinBookingModel.objects.filter(start_time__date=today).count()
        reserves = ResBooking.objects.filter(date__exact=today).count()
        guests = WalkinBookingModel.objects.filter(referenceid__contains="GUEST", start_time__date=today).count()
        available = 68 - totalwalkins - reserves
        walkins = totalwalkins - guests
        
        dashboard_count = {
            'walkins':walkins,
            'reserves':reserves, 
            'guests':guests, 
            'available':available
            }
        
        print(today)
        print(' totalwalkins:'+str(totalwalkins)+
              ' reserves: '+str(reserves)+
              ' guests:'+str(guests))
        
        return JsonResponse({'dashboard_count': dashboard_count})
    
    def get(self, request):
        today = timezone.now().date()
        totalwalkins = WalkinBookingModel.objects.filter(start_time__date=today).count()
        reserves = ResBooking.objects.filter(date=today).count()
        guests = WalkinBookingModel.objects.filter(referenceid__contains="GUEST", start_time__date=today).count()
        available = 68 - totalwalkins - reserves
        walkins = totalwalkins - guests
        
        print(today)
        print(' totalwalkins:'+str(totalwalkins)+
              ' reserves: '+str(reserves)+
              ' guests:'+str(guests))
        
        return render(request, "wiladmin/admindashboard.html", {'walkins': walkins, 'reserves': reserves, 'guests': guests, 'available': available})

class AdminWalkinDashboardController(LoginRequiredMixin, View):
    
    login_url = 'adminlogin'
    
    def updateBookingStatus(self, bookingid):
        booking = WalkinBookingModel.objects.get(pk=int(bookingid))
        try:
            if booking.status == "Pending":
                booking.status = 'Booked'
                booking.save()
                timer = Timer(user_id=booking.userid, minutes=30, seconds=20)
                timer.save()
                
                log = AdminReportLogsModel(referenceid=booking.referenceid, userid=booking.user_id, starttime=booking.start_time, endtime="", status='Booked')
                log.save()
            
            else:
                booking.delete()
                
                usertimer = Timer.objects.get(pk=str(booking.user_id))
                usertimer.delete()
                
                assignedarea = AssignedArea.objects.filter(reference_number=booking.referenceid)
                assignedarea.delete()
                
                log = AdminReportLogsModel(referenceid=booking.referenceid, userid=booking.user_id, starttime=booking.start_time,endtime=str(datetime.now().strftime("%d/%m/%Y, %H:%M")), status='Logged Out')
                log.save()
                
        except Timer.DoesNotExist:
            assignedarea = AssignedArea.objects.filter(reference_number=booking.referenceid)
            assignedarea.delete()
            log = AdminReportLogsModel(referenceid=booking.referenceid, userid=booking.user_id, starttime=booking.start_time,endtime=str(datetime.now().strftime("%d/%m/%Y, %H:%M")), status='Logged Out')
            log.save()
            return redirect('walkindashboard')
    
    def getAllWalkin(request):
        bookings = WalkinBookingModel.objects.all()
        return JsonResponse({'bookings':bookings})
        
    def get(self, request):
        bookings = WalkinBookingModel.objects.all().order_by('-status', '-bookingid')
        return render(request, "wiladmin/walkindashboard.html", {'bookings': bookings})
    
    def post(self, request, bookingid):
        self.updateBookingStatus(bookingid)
        return redirect('walkindashboard')
    

class AdminReservedDashboardController(LoginRequiredMixin, View):
    
    login_url = 'adminlogin'
    
    def updateBookingStatus(self, id):
        booking = ResBooking.objects.get(pk=int(id))
        
        if booking.status == "Pending":
            booking.status = 'Booked'
            booking.save()
            
            timer = Timer(user_id=booking.user, minutes=60, seconds=0)
            timer.save()
            
            log = AdminReportLogsModel(referenceid=booking.referenceNo, userid=booking.user, starttime=booking.startTime, endtime="", status='Booked')
            log.save()
        
        else:
            booking.delete()
            
            usertimer = Timer.objects.get(pk=str(booking.user))
            usertimer.delete()
            
            assignedarea = AssignedArea.objects.all().filter(reference_number=booking.referenceNo)
            assignedarea.delete()
            
            log = AdminReportLogsModel(referenceid=booking.referenceNo, userid=booking.user, starttime=booking.startTime, endtime=str(datetime.now().strftime("%d/%m/%Y, %H:%M")), status='Logged Out')
            log.save()
    
    def get(self, request):
        bookings = ResBooking.objects.all().order_by('-status')
        return render(request, "wiladmin/reserveddashboard.html", {'bookings': bookings})
    
    def post(self, request, id):
        self.updateBookingStatus(id)
        return redirect('reserveddashboard')
    
        
class AdminReportLogsController(LoginRequiredMixin,View):
    
    login_url = 'adminlogin'

    def exportlogs(self, request):
        
        logs = AdminReportLogsModel.objects.all()
        
        if logs.count() == 0:
            
            messages.error(request, "No Logs Found")
            return render(request, "wiladmin/logs.html", {'logs': logs})
            
        else:
            response = HttpResponse(content_type="text/csv")
            response['Content-Disposition'] = 'attachment; filename=WILReportLogs '+str(datetime.now().strftime("%d/%m/%Y"))+'.csv'

            writer = csv.writer(response)
            writer.writerow(['Log Number','Reference ID','User ID','Date and Time','Status'])

            for log in logs:
                writer.writerow([log.logid, log.referenceid, log.userid, log.starttime, log.status])
  
            return response
    
    def getAllReportLogs(self):
        logs = AdminReportLogsModel.objects.all().order_by('-logid')
        return logs
    
    def getTodayReportLogs(self, request):
        logs = AdminReportLogsModel.objects.all().order_by('-logid')[:30]
        return render(request, "wiladmin/logs.html", {'logs': logs})
    
    def get(self, request):
        logs = self.getAllReportLogs
        return render(request, "wiladmin/logs.html", {'logs': logs})
    
    def post(self, request):
        
        if 'export_button' in request.POST:
            messages.success(request, "Report Logs has been exported successfully")
            return self.exportlogs(request)
        
class BookGuestController(LoginRequiredMixin, View):
    
    login_url = 'adminlogin'

    def get(self, request):
        form = BookGuest()
        context = {}
        context['form'] = form    
        return render(request, 'wiladmin/bookguest.html',context)
    
    def post(self, request):
        countA1 = AssignedArea.objects.filter(area_id='A1').count()
        countA2 = AssignedArea.objects.filter(area_id='A2').count()
        countA3 = AssignedArea.objects.filter(area_id='A3').count()
        countA4 = AssignedArea.objects.filter(area_id='A4').count()
        countA5 = AssignedArea.objects.filter(area_id='A5').count()
        countA6 = AssignedArea.objects.filter(area_id='A6').count()
        countA7 = AssignedArea.objects.filter(area_id='A7').count()
        countA8 = AssignedArea.objects.filter(area_id='A8').count()
        countA9 = AssignedArea.objects.filter(area_id='A9').count()
        form = BookGuest(request.POST)
        
        if form.is_valid():
            userid = request.POST.get('userid')
            areaid = form.data.get('area')
            referenceid = str(areaid)+'GUEST'.upper()+str(random.randint(1, 68))
            start_time = timezone.now()
            end_time = None
            status = 'Booked'
            log_start_time = str(start_time.strftime("%d/%m/%Y, %I:%M %p"))
            
            if areaid=='A1' and countA1 >= 1:
                messages.error(request, "Area A1 is Full")
            elif areaid=='A2' and countA2 >= 1:
                messages.error(request, "Area A2 is Full")
            elif areaid=='A3' and countA3 >= 6:
                messages.error(request, "Area A3 is Full")
            elif areaid=='A4' and countA4 >= 6:
                messages.error(request, "Area A4 is Full")
            elif areaid=='A5' and countA5 >= 6:
                messages.error(request, "Area A5 is Full")
            elif areaid=='A6' and countA6 >= 6:
                messages.error(request, "Area A6 is Full")
            elif areaid=='A7' and countA7 >= 24:
                messages.error(request, "Area A7 is Full")
            elif areaid=='A8' and countA8 >= 6:
                messages.error(request, "Area A8 is Full")
            elif areaid=='A9' and countA9 >= 6:
                messages.error(request, "Area A9 is Full")
            else:
                
                booking = WalkinBookingModel(referenceid = referenceid, user_id = userid, start_time = start_time, end_time = end_time, status = status)
                booking.save()
                messages.success(request, "GUEST "+userid+" has been booked to "+referenceid[:2]) 
                
                reference = AssignedArea(reference_number=referenceid, area_id=referenceid[:2])
                reference.save()
                
                log = AdminReportLogsModel(referenceid=booking.referenceid, userid=booking.user_id, starttime=log_start_time, endtime="", status='Booked')
                log.save()
            
        else:
            messages.error(request, "You have an invalid input")

        return redirect('bookguest')
    
class ViewWorkspacesController(LoginRequiredMixin, View):
    
    login_url = 'adminlogin'
    
    #Thsi will GET current count
    def GetAreaCount(self):
        countA1 = AssignedArea.objects.filter(area_id='A1').count()
        countA2 = AssignedArea.objects.filter(area_id='A2').count()
        countA3 = AssignedArea.objects.filter(area_id='A3').count()
        countA4 = AssignedArea.objects.filter(area_id='A4').count()
        countA5 = AssignedArea.objects.filter(area_id='A5').count()
        countA6 = AssignedArea.objects.filter(area_id='A6').count()
        countA7 = AssignedArea.objects.filter(area_id='A7').count()
        countA8 = AssignedArea.objects.filter(area_id='A8').count()
        countA9 = AssignedArea.objects.filter(area_id='A9').count()
        
        area_count = [{
            'countA1':countA1, 
            'countA2':countA2, 
            'countA3':countA3, 
            'countA4':countA4, 
            'countA5':countA5,
            'countA6':countA6,
            'countA7':countA7,
            'countA8':countA8,
            'countA9':countA9,
            }]
        
        return area_count
    
    #This will JSON response the area count
    #This function will be called in urls.py (url: wiladmin/updateworkspaces)
    #Using the refresh.js this will be called in interval of 2 seconds
    #The refresh.js ajax will then replace the value with the new value
    #P.S. made it not nested array for easy access in ajax
    def update_workspaces(request):
        countA1 = AssignedArea.objects.filter(area_id='A1').count()
        countA2 = AssignedArea.objects.filter(area_id='A2').count()
        countA3 = AssignedArea.objects.filter(area_id='A3').count()
        countA4 = AssignedArea.objects.filter(area_id='A4').count()
        countA5 = AssignedArea.objects.filter(area_id='A5').count()
        countA6 = AssignedArea.objects.filter(area_id='A6').count()
        countA7 = AssignedArea.objects.filter(area_id='A7').count()
        countA8 = AssignedArea.objects.filter(area_id='A8').count()
        countA9 = AssignedArea.objects.filter(area_id='A9').count()
            
        area_count = {
            'countA1':countA1,
            'countA2':countA2, 
            'countA3':countA3, 
            'countA4':countA4, 
            'countA5':countA5,
            'countA6':countA6,
            'countA7':countA7,
            'countA8':countA8,
            'countA9':countA9,
            }
        return JsonResponse({'area_count':area_count})
     
    def get(self, request):
        
        area_count = self.GetAreaCount
        walkin_users_A1 = WalkinBookingModel.objects.filter(referenceid__contains="A1")
        walkin_users_A2 = WalkinBookingModel.objects.filter(referenceid__contains="A2")
        walkin_users_A3 = WalkinBookingModel.objects.filter(referenceid__contains="A3")
        walkin_users_A4 = WalkinBookingModel.objects.filter(referenceid__contains="A4")
        walkin_users_A5 = WalkinBookingModel.objects.filter(referenceid__contains="A5")
        walkin_users_A6 = WalkinBookingModel.objects.filter(referenceid__contains="A6")
        walkin_users_A7 = WalkinBookingModel.objects.filter(referenceid__contains="A7")
        walkin_users_A8 = WalkinBookingModel.objects.filter(referenceid__contains="A8")
        walkin_users_A9 = WalkinBookingModel.objects.filter(referenceid__contains="A9")
        
        reserve_users_A1 = ResBooking.objects.filter(referenceNo="A1")
        reserve_users_A2 = ResBooking.objects.filter(referenceNo="A2")
        reserve_users_A3 = ResBooking.objects.filter(referenceNo="A3")
        reserve_users_A4 = ResBooking.objects.filter(referenceNo="A4")
        reserve_users_A5 = ResBooking.objects.filter(referenceNo="A5")
        reserve_users_A6 = ResBooking.objects.filter(referenceNo="A6")
        reserve_users_A7 = ResBooking.objects.filter(referenceNo="A7")
        reserve_users_A8 = ResBooking.objects.filter(referenceNo="A8")
        reserve_users_A9 = ResBooking.objects.filter(referenceNo="A9")
        
        
        walkin_users = {
            'walkin_users_A1': walkin_users_A1,
            'walkin_users_A2': walkin_users_A2,
            'walkin_users_A3': walkin_users_A3,
            'walkin_users_A4': walkin_users_A4,
            'walkin_users_A5': walkin_users_A5,
            'walkin_users_A6': walkin_users_A6,
            'walkin_users_A7': walkin_users_A7,
            'walkin_users_A8': walkin_users_A8,
            'walkin_users_A9': walkin_users_A9
        }
        
        reserve_users = {
            'reserve_users_A1': reserve_users_A1,
            'reserve_users_A2': reserve_users_A2,
            'reserve_users_A3': reserve_users_A3,
            'reserve_users_A4': reserve_users_A4,
            'reserve_users_A5': reserve_users_A5,
            'reserve_users_A6': reserve_users_A6,
            'reserve_users_A7': reserve_users_A7,
            'reserve_users_A8': reserve_users_A8,
            'reserve_users_A9': reserve_users_A9,
        }

        return render(request, 'wiladmin/workspaces.html', {'area_count': area_count, 'walkin_users':walkin_users, 'reserve_users': reserve_users})
    
    def post(self, request, areaid):
        area_count = self.GetAreaCount
        area = WalkinBookingModel.objects.filter(referenceid__contains=areaid) #and Booking.objects.filter(reference_number__contains=areaid)
        return render(request, 'wiladmin/workspaces.html', {'area':area, 'area_count':area_count, 'area_id':areaid})

class TestController(View):
    
    
    def get(self, request):
        return render(request, 'wiladmin/test.html')
    
def handleLogout(request):
        logout(request)
        return redirect('adminlogin')
