import datetime
from django.utils import timezone
import io
import time
from django.db.models.functions import ExtractMonth, ExtractYear
from django.db.models import F, Value, CharField
from django.shortcuts import render
from django.db.models import Sum
from datetime import datetime
from django.shortcuts import render
import plotly.express as px
from plotly.offline import plot
import plotly.graph_objs as go
from .forms import ChartTypeForm, RulesUserTypeForm, UserTypeForm, UserForm
import json
from matplotlib import pyplot as plt
from reportlab.pdfgen import canvas
from django.template import loader
from decimal import Decimal
from io import BytesIO
from django.http import FileResponse, Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from .forms import CalendarEventForm, FacilityForm, FacilityMainRulesForm, FacilityPromoRulesForm, FacilitySubRulesForm, FacilityUpdateForm, Revenue_TransactionForm, RulesFacilityForm, Sched_TypeForm, TransactionForm
from .models import CalendarEvent, Facility, Facility_MainRules, Facility_MainRules_set, Facility_PromoRules, Facility_PromoRules_set, Facility_SubRules, Facility_SubRules_set, Revenue_Transaction, Setting_Facility, Setting_UserType, Transaction, User
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.views import View
from django.db import connection
from django.urls import reverse
from django.shortcuts import render
from django.contrib import messages
from django.views.decorators.csrf import csrf_protect
from django.views.generic.base import View
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.db.models import Count, Sum
from django.http import HttpResponse, HttpResponseRedirect
from .forms import FacilityForm, FacilityMainRulesForm, FacilityMainRulesSetForm, FacilityPromoRulesForm, FacilitySubRulesForm, FacilityUpdateForm, UserTypeMainRulesForm, UserTypePromoRulesForm, UserTypeSubRulesForm
from .models import Facility, Facility_MainRules, Facility_MainRules_set, Facility_PromoRules, Facility_PromoRules_set, Facility_SubRules, Facility_SubRules_set, Setting_Facility, Setting_UserType, UserType_MainRules, UserType_MainRules_set, UserType_PromoRules, UserType_PromoRules_set, UserType_SubRules, UserType_SubRules_set, Sched_Type
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, PageBreak
from reportlab.pdfgen import canvas
import io
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test
from django.http import JsonResponse
from django.core import serializers
from .models import Setting_Facility, User_Type, User
from api.models import Booking, Attendance


def is_superuser(user):
    return user.is_superuser  # Check if the user is a superuser


# @csrf_protect
# @login_required
# @user_passes_test(is_superuser)
def get_facility(request):
    setting_facilities = Setting_Facility.objects.all()

    facility_data = []
    for facility in setting_facilities:
        mainrules = Facility_MainRules_set.objects.all()
        subrules = Facility_SubRules_set.objects.all()
        promorules = Facility_PromoRules_set.objects.all()

        facility_dict = {
            'setting_facility_id': facility.id,
            'facility': {
                'facility_id': facility.facility.id if facility.facility else None,
                'facility_name': facility.facility.facilityname if facility.facility else None,
                'rate_per_hour': facility.facility.rateperhour if facility.facility else None,
                'capacity': facility.facility.capacity if facility.facility else None,
                'created_at': facility.facility.created_at if facility.facility else None,
                'modified_at': facility.facility.modified_at if facility.facility else None,
                # Add other fields from Facility model
            },
            'main_rules': {
                'mainrules': facility.mainrules.id if facility.mainrules else None,
                'facility': facility.mainrules.facility if facility.mainrules else None,
                'title': facility.mainrules.title if facility.mainrules else None, 
                'points': facility.mainrules.points if facility.mainrules else None, 
                'num_pc': facility.mainrules.num_pc if facility.mainrules else None, 
                'num_attendies': facility.mainrules.num_attendies if facility.mainrules else None, 
                'description': facility.mainrules.description if facility.mainrules else None, 
                'rate': facility.mainrules.rate if facility.mainrules else None, 
                'status': facility.mainrules.status if facility.mainrules else None, 
                'created_at': facility.mainrules.created_at if facility.mainrules else None, 
                'modified_at': facility.mainrules.modified_at if facility.mainrules else None, 
                # Add other fields from Facility_MainRules_set model
            },
            'promo_rules': {
                'promrules': facility.promorules.id if facility.promorules else None,
                'facility': facility.promorules.facility if facility.promorules else None,
                'title': facility.promorules.title if facility.promorules else None,
                'new_rate': facility.promorules.new_rate if facility.promorules else None,
                'start_date': facility.promorules.start_date if facility.promorules else None,
                'end_date': facility.promorules.end_date if facility.promorules else None,
                'capacity': facility.promorules.capacity if facility.promorules else None,
                'description': facility.promorules.description if facility.promorules else None,
                'status': facility.promorules.status if facility.promorules else None,
                'created_at': facility.promorules.created_at if facility.promorules else None,
                'modified_at': facility.promorules.modified_at if facility.promorules else None,
                # Add other fields from Facility_PromoRules_set model
            },
            'sub_rules': {
                'subrules': facility.subrules.id if facility.subrules else None, 
                'facility': facility.subrules.facility if facility.subrules else None, 
                'title': facility.subrules.title if facility.subrules else None,
                'description': facility.subrules.description if facility.subrules else None,
                'status': facility.subrules.status if facility.subrules else None,
                'created_at': facility.subrules.created_at if facility.subrules else None,
                'modified_at': facility.subrules.modified_at if facility.subrules else None,
                # Add other fields from Facility_SubRules_set model
            },
            'created_at': facility.created_at,
            'modified_at': facility.modified_at,
            # Add other fields from Setting_Facility model if needed
        }
        facility_data.append(facility_dict)

    return JsonResponse(facility_data, safe=False)



def generate_pdf_content(facility_stats, revenue_trans):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))

    # Create the Facility Statistics Table
    facility_data = [
        ["Facility Name", "Facility Rate", "Number of Reservations", "Total Hours", "Facility Revenue"]
    ]
    for facility_name, stats in facility_stats.items():
        facility_data.append([
            facility_name,
            str(stats['facility'].rateperhour),
            str(stats['num_reservations']),
            str(stats['total_hours']),
            str(stats['facility_revenue'])
        ])

    facility_table = Table(facility_data, colWidths=[100, 100, 150, 100, 100])
    facility_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 2), (-1, 0), 20),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Create the Transaction History Table
    transaction_data = [
        ["TRANSACTION NUMBER", "TRANSACTION DATE", "FACILITY", "CUSTOMER", "TOTAL USAGE HOURS", "PAYMENT CHARGE", "ADDITIONAL PAYMENTS", "PAYMENT", "BOOKED DURATION", "TOTAL"]
    ]
    for r in revenue_trans:
        transaction_data.append([
            str(r.id),
            str(r.transaction_datetime),
            r.facility,
            r.customer_name,
            f"{r.duration:.2f} hours",
            str(r.charge_payment),
            str(r.add_payment),
            str(r.payment),
            f"{r.duration_booking:.2f} hours",
            str(r.total)
        ])

    transaction_table = Table(transaction_data, colWidths=[70, 150, 70, 70, 70, 70, 70, 70, 70, 70])
    transaction_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 2), (-1, 0), 20),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Build the PDF content
    elements = [facility_table, PageBreak(), transaction_table]

    doc.build(elements)
    buffer.seek(0)
    return buffer

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def generate_pdf(request):
    # Retrieve filter parameters from the request
    facility_filter = request.GET.get('facility')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    # Retrieve the necessary data from your database or any other source
    facility_stats = get_facility_stats(facility_filter, start_date, end_date)
    revenue_trans = get_revenue_trans(facility_filter, start_date, end_date)

    # Generate the PDF using the provided filtered data
    pdf_content = generate_pdf_content(facility_stats, revenue_trans)

    # Serve the PDF as a response
    response = FileResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="filtered_report.pdf"'
    return response

# ...

def get_facility_stats(facility_filter, start_date, end_date):
    facility_stats = {}

    # Get all facilities
    facilities = Facility.objects.filter(isdeleted=0)

    for facility in facilities:
        # Get transactions for the specific facility and date range
        transactions = Transaction.objects.filter(facility=facility)

        if facility_filter:
            transactions = transactions.filter(facility=facility_filter)

        if start_date and end_date:
            transactions = transactions.filter(transaction_datetime__date__range=[start_date, end_date])

        # Calculate facility statistics for each facility
        num_reservations = transactions.count()
        total_hours = transactions.aggregate(Sum('duration_booking'))['duration_booking__sum'] or 0.0
        facility_revenue = transactions.aggregate(Sum('total'))['total__sum'] or 0.0

        facility_stats[facility.facilityname] = {
            'facility': facility,
            'num_reservations': num_reservations,
            'total_hours': total_hours,
            'facility_revenue': facility_revenue,
        }

    return facility_stats

def get_revenue_trans(facility_filter, start_date, end_date):
    revenue_trans = Transaction.objects.all()

    if facility_filter:
        revenue_trans = revenue_trans.filter(facility=facility_filter)

    if start_date and end_date:
        revenue_trans = revenue_trans.filter(transaction_datetime__date__range=[start_date, end_date])

    return revenue_trans

# @csrf_protect
# @login_required
# @user_passes_test(is_superuser)
# def get_events(request):
#     events = CalendarEvent.objects.all().order_by('id')
#     event_data = []

#     for event in events:
#         event_data.append({
#             'title': event.event_name,
#             'start': event.date.isoformat(),
#             'end': event.date.isoformat(),
#             # Add other fields you want to display on the calendar
#             # 'facility': event.facility.facilityname,
#             # 'type_sched': event.type_sched.type_sched,
#         })



#     return JsonResponse(event_data, safe=False)


from django.views.decorators.http import require_GET
@require_GET
def get_events(request):
    requested_date = request.GET.get('date')

    # Parse requested date to a datetime object
    requested_datetime = datetime.strptime(requested_date, '%Y-%m-%d')

    # Set start and end times for the requested date (assuming a full day event)
    start_time = time(0, 0)  # Start time of the day
    end_time = time(23, 59, 59)  # End time of the day

    # Create datetime objects by combining the requested date with start and end times
    start_datetime = datetime.combine(requested_datetime, start_time)
    end_datetime = datetime.combine(requested_datetime, end_time)

    # Query events within the date and time range
    events = CalendarEvent.objects.filter(date=requested_datetime, start__gte=start_time, end__lte=end_time)
    # Create a list of events in the format required by FullCalendar
    event_data = []
    for event in events:
        event_data.append({
            'title': event.event_name,
            'start': event.start.strftime('%Y-%m-%dT%H:%M:%S'),  # Adjust format as needed
            'end': event.end.strftime('%Y-%m-%dT%H:%M:%S'),  # Adjust format as needed
            # Add other event details if needed
        })

    print(f"Event: {event.event_name}, Start: {event.start}, End: {event.end}")

    return JsonResponse(event_data, safe=False)


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def event_click(request, event_id):
    event = CalendarEvent.objects.get(pk=event_id)
    message = f"Event Name: {event.event_name}, Start Date: {event.start_date}, End Date: {event.end_date}"
    messages.info(request, message)
    return redirect('facility:calendarview') 

# def set_session(request):
#     request.session['username'] = 'myuser'
#     return HttpResponse('Session variable set.')

# def get_session(request):
#     username = request.session.get('username')
#     if username:
#         return HttpResponse(f'Logged in as: {username}')
#     else:
#         return HttpResponse('Session variable not found.')
    
# def set_session_fmrules(request):
#     request.session['facility'] = 'facility'
#     return HttpResponse('Session variable set.')


# from django import forms
# from .models import Facility
# from .forms import FacilityForm, FacilityUpdateForm


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_facility(request):
    # message = "try"
    # messages.info(request, message)
    if request.method == 'POST':
        # Handling POST requests
        
        # Retrieving form data from POST request
        set_fac = Setting_Facility.objects.all()
        upform = FacilityUpdateForm(request.POST)
        facilityform = FacilityForm(request.POST)        
        f_id = request.POST.get('id')
        nfacility = request.POST.get('facilityname')
        narea_id = request.POST.get('area_id')
        nrateperhour = request.POST.get('rateperhour')
        nperson_rateperhour = request.POST.get('person_rateperhour')
        ncapacity = request.POST.get('capacity')
        firstname = request.session.get('firstname') 
        count = Facility.objects.filter(isdeleted=0).count()
        limit_facility = 8 # Retrieving 'firstname' from session
        lim_rateperhour = 20
        lim_capacity = 300
        
        if f_id is None:
            try:
                # Checking if a facility with the same name already exists
                if Facility.objects.filter(facilityname=nfacility, isdeleted=0).exists():
                    message = f"{nfacility} already exists"
                    messages.error(request, message)
                    return redirect('facility:facility')
                else:
                    # Saving a new facility
                    # set_fac.facility=nfacility.id
                    # set_fac.save()
                    if count == limit_facility:
                        message = "Only 8 facility available for WILMS"
                        messages.warning(request, message)
                        return redirect('facility:facility')
                    else:
                        new_facility = facilityform.save()
                        Setting_Facility.objects.create(facility=new_facility)
                        facilityform.save()
                        message = "Facility added successfully"
                        messages.success(request, message)
                        return redirect('facility:facility')
            except Exception as e:
                    message = str(e)
                    messages.error(request, message)
        else:
            try:
                # Updating an existing facility
                facility = get_object_or_404(Facility, id=f_id)
                facility.facilityname = nfacility
                facility.area_id = narea_id
                facility.rateperhour = nrateperhour
                facility.person_rateperhour = nperson_rateperhour
                facility.capacity = ncapacity
                facility.save()
                message = "Facility updated successfully"
                messages.success(request, message)
            except Http404:
                return JsonResponse({"error": "Facility not found"})
            except Exception as e:
                message = f"{nfacility} already exists"
                messages.error(request, message)
        
        return redirect('facility:facility')
    else:
        # Handling GET requests
        
        # Retrieving all facilities that are not deleted and ordering them by ID
        facility = Facility.objects.filter(isdeleted=0).order_by('id')
        upform = FacilityUpdateForm()
        facilityform = FacilityForm()
        firstname = request.session.get('firstname')  # Retrieving 'firstname' from session

    # Rendering the 'facility.html' template with the retrieved data
    return render(request, 'facility.html', {'facility': facility, 'upform': upform, 'facilityform': facilityform, 'firstname': firstname})



def calculate_transaction_values(transaction):
    # Get the rate per hour from the selected facility
    rateperhour = Decimal(transaction.facility.rateperhour) if transaction.facility else Decimal('0.0')

    if transaction.time_in and transaction.time_out:
        duration = (transaction.time_out - transaction.time_in).total_seconds() / 3600
    else:
        duration = 0.0

    if transaction.start_date and transaction.end_date:
        duration_booking = (transaction.end_date - transaction.start_date).total_seconds() / 3600
    else:
        duration_booking = 0.0

    payment = rateperhour * Decimal(duration_booking)
    add_payment = Decimal(transaction.add_payment)

    if duration > duration_booking:
        charge_payment = rateperhour * (Decimal(duration) - Decimal(duration_booking))
    else:
        charge_payment = Decimal('0.0')

    total = payment + add_payment + charge_payment

    # Update the transaction model with the calculated values
    transaction.duration = float(duration)
    transaction.payment = float(payment)
    transaction.duration_booking = float(duration_booking)
    transaction.charge_payment = float(charge_payment)
    transaction.total = float(total)


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def process_transaction(request):
    if request.method == 'POST':
        transaction_datetime = request.POST.get('transaction_datetime')
        time_in = request.POST.get('time_in')
        time_out = request.POST.get('time_out')
        # Fetch other necessary data from the POST request
        
        # Perform necessary conversions and calculations
        if time_in and time_out:
            duration = (time_out - time_in).total_seconds() / 3600
        else:
            duration = 0.0
        
        # Perform similar calculations for other fields...

        # Calculate values for payment, charge_payment, total, etc.
        # You might also fetch rateperhour from the facility object associated with this transaction
        
        # Create a new Transaction object with the calculated values
        new_transaction = Transaction(
            transaction_datetime=transaction_datetime,
            # Assign other calculated values to their respective fields in the Transaction model
        )
        
        # Save the new transaction to the database
        new_transaction.save()
        
        return HttpResponse("Transaction processed and saved!")

    else:
        # Handle GET requests if needed
        return HttpResponse("This view only handles POST requests for processing transactions.")

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def rules_facility(request):
    
    if request.method == 'POST':
        forms = TransactionForm(request.POST)
        if forms.is_valid():
            # Create a Transaction object but don't save it yet
            transaction = forms.save(commit=False)
            
            # Calculate transaction values
            calculate_transaction_values(transaction)
            
            # Save the transaction to the database
            transaction.save()
            
            return redirect('facility:revenuereport')  # Redirect to a success page or another view

    else:
        # Set the initial value of the 'facility' field in the form
        forms = TransactionForm() 

    return render(request, 'add_facility.html', {'forms': forms})

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_facility(request, id):

    faci = Facility.objects.get(pk=id)
    try:
        facility = Facility.objects.filter(id=id)
        set_fac = Setting_Facility.objects.filter(facility=id)
        facility.update(isdeleted=1)
        set_fac.update(isdeleted=1)
        message = f"{faci.facilityname} is deleted and move to recycle bin"
        messages.info(request, message)
        
    except Facility.DoesNotExist:
        # Handle the case where the Facility does not exist
        pass

    return redirect(reverse('facility:facility'))



@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_setting_facility(request):
    f_id = request.POST.get('id')
    firstname = request.session.get('firstname')
    facility = Facility.objects.filter(isdeleted=0).order_by('id')
    del_facility = Facility.objects.filter(isdeleted=1).order_by('id')
    del_setting_facility = Setting_Facility.objects.filter(isdeleted=1).order_by('id')
    setting_facility = Setting_Facility.objects.filter(isdeleted=0).order_by('id')
    setting_usertype = Setting_UserType.objects.filter(isdeleted=0).order_by('id')
    event = CalendarEvent.objects.all().order_by('id')
    # facility = Setting_Facility.objects.all().filter(facility=setting_facility)
    # fmainrules = Facility_MainRules_set.objects.all().filter(facility=facility).order_by('-modified_at')
    return render(request, 'setting.html', {'setting_facility': setting_facility,
           'facility':facility,
           'setting_usertype':setting_usertype,
           'event':event,
            'firstname':firstname,
            'del_facility':del_facility,
            'del_setting_facility':del_setting_facility

        })
def restoreFacility(request, id):
    facility = get_object_or_404(Facility, pk=id)
    set_fac = Setting_Facility.objects.filter(facility=id)
    count = Facility.objects.filter(isdeleted=0).count()
    limit_facility = 8 
    if facility.isdeleted:
        if count == limit_facility:
            message = "Restricted, only 8 facility available for WILMS"
            messages.warning(request, message)
            return redirect('facility:rulessummary')
        else:          
            facility.isdeleted = False  # Set isdeleted to False for restoration
            facility.save()  # Save the changes to the database
            set_fac.update(isdeleted=0)
            # Display success message
            messages.success(request, f"Facility '{facility.facilityname}' restored successfully.")
    else:
        messages.error(request, f"Facility '{facility.facilityname}' is not deleted.")        
    return redirect(reverse('facility:rulessummary'))
    # return HttpResponseRedirect(reverse('facility:facilityRules', args=[id]))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def displayall_setting_facility(request):
    firstname = request.session.get('firstname')
    setting_facility = Setting_Facility.objects.filter(isdeleted=0).order_by('id')
    nfacility = request.POST.get('facility')
    

    if request.method == 'POST':
        forms = RulesFacilityForm(request.POST)
        if forms.is_valid():
            facility = forms.cleaned_data['facility']
            if not Setting_Facility.objects.filter(facility=facility).exists():
                forms.save()
            else:
                message = f" This facility already exist."
                messages.warning(request, message)
                

    else:
        # Set the initial value of the 'facility' field in the form
        forms = RulesFacilityForm() 
    return render(request, 'facility_table.html', {'setting_facility': setting_facility, 'forms': forms, 'firstname':firstname})


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def set_facility_session(request, facility_id):
    # Set the 'facility_id' session variable to the clicked facility's ID
    request.session['facility_id'] = facility_id
    return redirect('facility:listFacilities') 


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def update_facility(request, id):
    facility = get_object_or_404(Facility, pk=id)
    request.session['faci_id'] = facility.pk
    
    if request.method == 'POST':
        # upform = FacilityUpdateForm(request.POST, instance=facility)
        # upform = FacilityUpdateForm(request.POST,initial={'facilityname': facility.facilityname, 'rateperhour':facility.rateperhour, 'capacity':facility.capacity})
        upform = FacilityUpdateForm(request.POST, instance=facility)
        new_facility = request.POST.get('facilityname') 
        if upform.is_valid():
            # upform = FacilityUpdateForm(request.POST)
            upform.save()

            with connection.cursor() as cursor:
            # Define the SQL UPDATE statement with placeholders
                sql = """
                UPDATE `facility_setting_facility` 
                SET `facility` = %s 
                WHERE `facility_setting_facility`.`id` = %s
                """

            # Execute the SQL statement with the new values
                cursor.execute(sql, [new_facility, id])
            return redirect('facility:facility')

    else:
        facility = get_object_or_404(Facility, pk=id)
        upform = FacilityUpdateForm(instance=facility)
    
    return render(request, 'update_facility.html',{'upform': upform, 'facility':facility})
    # return HttpResponseRedirect(reverse(request,'facility:updatefacility',{'upform': upform, 'facility': facility}))
    # return render(request, 'facility.html',)
# changed

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def update_setting_facility(request, id):
    s_facility = get_object_or_404(Setting_Facility, pk=id)
    
    if request.method == 'POST':
        sform = FacilityUpdateForm(request.POST, instance=s_facility)
        if sform.is_valid():
            sform.save()
            return redirect('facility:facility')

    else:
        form = FacilityUpdateForm(instance=s_facility)

    return render(request, 'update_facility.html',{'form': form, 'facility': s_facility})

def is_capacity_within_limit(capacity):
    return int(capacity) <= 20




#   if request.method == 'POST':
#         forms = TransactionForm(request.POST)
#         if forms.is_valid():
#             # Create a Transaction object but don't save it yet
#             transaction = forms.save(commit=False)
            
#             # Calculate transaction values
#             calculate_transaction_values(transaction)
            
#             # Save the transaction to the database
#             transaction.save()
            
#             return redirect('facility:revenuereport')  # Redirect to a success page or another view

#     else:
#         # Set the initial value of the 'facility' field in the form
#         forms = TransactionForm()  

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def user_create(request):
    template = 'user.html'
    firstname = request.session.get('firstname')
    user_list = User.objects.all().order_by('-id')

    if request.method == 'POST':
        user_type = UserTypeForm(request.POST)
        user = UserForm(request.POST)
        if user_type.is_valid():
            user_type.save()
        if user.is_valid():
            user.save()
    else:
        user_type = UserTypeForm()
        user = UserForm()

    return render(request, template,{'user':user,'user_type':user_type, 'user_list':user_list, 'firstname':firstname})

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_fmrules(request, id):
    facility = get_object_or_404(Setting_Facility, pk=id)
    firstname = request.session.get('firstname')
    if request.method == 'POST':
        upform = FacilityUpdateForm(request.POST, instance=facility)
        new_facility = request.POST.get('facilityname') 
        if upform.is_valid():
            upform.save()

            with connection.cursor() as cursor:
            # Define the SQL UPDATE statement with placeholders
                sql = """
                UPDATE `facility_setting_facility` 
                SET `facility` = %s 
                WHERE `facility_setting_facility`.`id` = %s
                """

            # Execute the SQL statement with the new values
                cursor.execute(sql, [new_facility, id])
            return redirect('facility:facility')

    else:
        facility = get_object_or_404(Facility, pk=id)
        upform = FacilityUpdateForm(instance=facility)

    return render(request, 'update_facility.html',{'upform': upform, 'facility': facility, 'firstname':firstname})


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_facility_mainrules(request, id):
    firstname = request.session.get('firstname')
    sfacility = get_object_or_404(Setting_Facility, pk=id)
    request.session['faci_id'] = sfacility.pk
    request.session['facility'] = sfacility.facility_id
    template = 'facility_mainrules.html'
    addedmainrules = Facility_MainRules.objects.all().order_by('-created_at')
    fmainrules = Facility_MainRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fsubrules = Facility_SubRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fpromorules = Facility_PromoRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    if request.method == 'POST':
        mform = FacilityMainRulesForm(request.POST)
        if mform.is_valid():
            mform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        mform = FacilityMainRulesForm(initial={'facility': sfacility.facility}) 

    return render(request, template, {'sfacility': sfacility,
    'addedmainrules': addedmainrules,
    'mform': mform,
    'fmainrules': fmainrules, 
    'fsubrules':fsubrules,
    'fpromorules':fpromorules,
    'firstname':firstname
    })
# from django.http import HttpResponseRedirect
# from django.urls import reverse
# usertypemainrules_back

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def usertypemainrules_back(request):
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    

    if UserType_MainRules_set.objects.filter(user_type=user_type).exists():
        if UserType_MainRules_set.objects.filter(status=0):
            message = f"You have to set a main rule for a UserType"
            messages.info(request, message)
    
        elif UserType_MainRules_set.objects.filter(user_type=user_type).exists():
            if UserType_MainRules_set.objects.filter(status=1):
                if UserType_SubRules_set.objects.filter(user_type=user_type).exists():
                    
                    if UserType_SubRules_set.objects.filter(status=0):
                        message = f"You have to set a sub rule for a UserType"
                        messages.info(request, message)

                    elif UserType_SubRules_set.objects.filter(user_type=user_type).exists():
                        if UserType_SubRules_set.objects.filter(status=1):
                            if UserType_PromoRules_set.objects.filter(user_type=user_type).exists():
                                if UserType_PromoRules_set.objects.filter(status=0):
                                    message = f"You have to set a promo rule for a UserType"
                                    messages.info(request, message)

                                elif UserType_PromoRules_set.objects.filter(user_type=user_type).exists():
                                    if UserType_PromoRules_set.objects.filter(status=1):
                                        return HttpResponseRedirect(reverse('facility:usertable'))
    
    elif not UserType_SubRules_set.objects.filter(user_type=user_type).exists():
        return HttpResponseRedirect(reverse('facility:usertable'))

    elif not UserType_PromoRules_set.objects.filter(user_type=user_type).exists():
        return HttpResponseRedirect(reverse('facility:usertable'))
        
    elif not UserType_MainRules_set.objects.filter(user_type=user_type).exists():
        return HttpResponseRedirect(reverse('facility:usertable'))                                   


    else:
        return HttpResponseRedirect(reverse('facility:usertable'))

    if user_id is not None:
        
        return HttpResponseRedirect(reverse('facility:userRules', args=[user_id]))
    else:

        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))




@csrf_protect
@login_required
@user_passes_test(is_superuser)
def facilitymainrules_back(request):
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility') 

    if faci_id is None:
        message = "Facility ID is missing."
        messages.error(request, message)
        return HttpResponseRedirect(reverse('settingfacility'))

    main_rules_exist = Facility_MainRules_set.objects.filter(facility=facility).exists()
    sub_rules_exist = Facility_SubRules_set.objects.filter(facility=facility).exists()
    promo_rules_exist = Facility_PromoRules_set.objects.filter(facility=facility).exists()

    if not main_rules_exist or Facility_MainRules_set.objects.filter(status=0).exists():
        if Facility_MainRules_set.objects.filter(status=0):
            message = "You have to set a main rule for this facility."
            messages.warning(request, message)
            return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
        if not main_rules_exist:
            return HttpResponseRedirect(reverse('facility:facilitytable'))

    elif not sub_rules_exist or Facility_SubRules_set.objects.filter(status=0).exists():
        if Facility_SubRules_set.objects.filter(status=0):
            message = "You have to set a sub rule for this facility."
            messages.warning(request, message)
            return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
        if not sub_rules_exist:
            return HttpResponseRedirect(reverse('facility:facilitytable'))

    elif not promo_rules_exist or Facility_PromoRules_set.objects.filter(status=0).exists():
        if Facility_PromoRules_set.objects.filter(status=0):
            message = "You have to set a promo rule for this facility."
            messages.warning(request, message)
            return HttpResponseRedirect(reverse('facility:facilitypromorules', args=[faci_id]))
        if not promo_rules_exist:
            return HttpResponseRedirect(reverse('facility:facilitytable'))

    return HttpResponseRedirect(reverse('facility:facilitytable'))


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def facilitysubrules_back(request):
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')

    if Facility_SubRules_set.objects.filter(facility=facility).exists():
        if Facility_SubRules_set.objects.filter(status=0):
            message = f"You have to set a sub rule for a facility"
            messages.warning(request, message)

        elif Facility_SubRules_set.objects.filter(facility=facility).exists():
            if Facility_SubRules_set.objects.filter(status=1):
                return HttpResponseRedirect(reverse('facility:facilitytable'))
                    
    else:
         return HttpResponseRedirect(reverse('facility:facilitytable'))

    if faci_id is not None:
        
        return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
    else:

        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_subrules.html'))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def facilitymainrules_set(request, id):
    mainrules = get_object_or_404(Facility_MainRules, pk=id)
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
    newfacility = request.POST.get('facility', facility)
    title = request.POST.get('title',mainrules.title)
    points = request.POST.get('points',mainrules.points)
    num_pc = request.POST.get('num_pc',mainrules.num_pc)
    num_attendies = request.POST.get('num_attendies',mainrules.num_attendies)
    description = request.POST.get('description', mainrules.description)
    rate = request.POST.get('rate', mainrules.rate)
    person_rate = request.POST.get('person_rate', mainrules.person_rate)
    status = 0
    
    # new_Facility = Facility_MainRules_set(facility=newfacility, title=title, description=description, rate=rate, status=status)
    if Facility_MainRules_set.objects.filter(facility=facility).exists():
        rules_count = Facility_MainRules_set.objects.filter(facility=facility, status=0).count()
        
        # Facility exists, check if title is different
 

        if Facility_MainRules_set.objects.filter(status=1):
            message = f"You have to remove the existing set rule first to add new rule"
            messages.warning(request, message)

        elif Facility_MainRules_set.objects.filter(title=title).exists():  
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)

        elif not Facility_MainRules_set.objects.filter(title=title).exists():
            if Facility_MainRules_set.objects.filter(status=0):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            elif not rules_count > 1:
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:
                new_Facility = Facility_MainRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, person_rate=person_rate, status=status)
                new_Facility.save()



    # elif Facility_MainRules_set.objects.filter(facility=facility).exists():
    #     if Facility_MainRules_set.objects.filter(status=0).exists():
    #         if not Facility_MainRules_set.objects.filter(title=title).exists():
    #             new_Facility = Facility_MainRules_set(facility=facility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, person_rate=person_rate, status=status)
    #             new_Facility.save()
    else:
        # Facility doesn't exist, check if title exists
        if Facility_MainRules_set.objects.filter(title=title).exists():
            # f" already exists"
            new_Facility = Facility_MainRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, person_rate=person_rate, status=status)
            new_Facility.save()

        elif Facility_MainRules_set.objects.filter(status=0).exists():
            new_Facility = Facility_MainRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, person_rate=person_rate, status=status)
            new_Facility.save()
        else:
            # Neither facility nor title exist
            new_Facility = Facility_MainRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, person_rate=person_rate, status=status)
            new_Facility.save()

    if faci_id is not None:
    
        return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
    else:

        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))

# @csrf_protect
# @login_required
# @user_passes_test(is_superuser)
# def is_setfacilitymainrules_status(request):
#     faci_id = request.session.get('faci_id')
#     facility = request.session.get('facility')
#     current_date = datetime.now().date()
#     facility_promo_rules_set = Facility_PromoRules_set.objects.filter(facility=facility).first()

#     facility_list = Facility_MainRules_set.objects.filter(facility=facility)
#     # Retrieve all rule sets
#     mainrule_list = Facility_MainRules_set.objects.filter(facility=facility)
#     subrule_list = Facility_SubRules_set.objects.filter(facility=facility)
#     promorule_list = Facility_PromoRules_set.objects.filter(facility=facility)

#     # Filter rule sets by facility
#     mainrules_list = Facility_MainRules_set.objects.filter(facility=facility)
#     subrules_list = Facility_SubRules_set.objects.filter(facility=facility)
#     promorules_list = Facility_PromoRules_set.objects.filter(facility=facility)

#     setting_list = Setting_Facility.objects.filter(facility=facility)



#     # Check if subrule_list is not empty
#     if mainrule_list.exists():
#             mainrule = request.POST.get('mainrule', mainrule_list.first().id)
#     else:
#         mainrule = None 

#     if subrule_list.exists():
#         subrule = request.POST.get('subrule', subrule_list.first().id)
#     else:
#         subrule = None 

#     if promorule_list.exists():
#         promorule = request.POST.get('promorule', promorule_list.first().id)
#     else:
#         promorule = None  # or set to an appropriate default value

#     # Update the status for all matching instances
    
#     mainrules_list.update(status=1)
#     subrules_list.update(status=1)
#     promorules_list.update(status=1)

#     # Update the settings in a single call
#     setting_list.update(mainrules=mainrule, subrules=subrule, promorules=promorule)

#     # mainrules.save()
#     message = f"Rules successfully set."
#     messages.success(request, message)
    
#     if facility_promo_rules_set and current_date > facility_promo_rules_set.end_date:
#         # Your code logic here if the current date is past the end date
#         # This block will execute if there are promo rules for the facility
#         # and the current date is greater than the end date of those rules
#         message = f"Current date is past the end date of Facility Promo Rules."
#         messages.success(request, message)
#         print("Current date is past the end date of Facility Promo Rules.")
#     else:
#         # Your code logic here if the current date is not past the end date
#         # or if there are no promo rules for the facility
#         message = f"Current date is on or before the end date of Facility Promo Rules, or no rules found."
#         messages.success(request, message)
#         print("Current date is on or before the end date of Facility Promo Rules, or no rules found.")

#     if faci_id is not None:
#         return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
#     else:
#         # Handle the case when faci_id is None, e.g., by redirecting to a default URL
#         return HttpResponseRedirect(reverse('facility_mainrules.html'))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def is_setfacilitymainrules_status(request):
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
    current_date = timezone.now()
    # facilities = get_object_or_404(Facility, facilityname=facility)
    main_rules = Facility_MainRules_set.objects.filter(facility=facility).first()
    promo_rules = Facility_PromoRules_set.objects.filter(facility=facility).first()
    # Retrieve all rule sets
    facility_list = Facility.objects.get(id=facility)
    mainrule_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrule_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorule_list = Facility_PromoRules_set.objects.filter(facility=facility)

    # Filter rule sets by facility
    mainrules_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrules_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorules_list = Facility_PromoRules_set.objects.filter(facility=facility)

    setting_list = Setting_Facility.objects.filter(facility=facility)

    

    facility_promo_rules_set = Facility_PromoRules_set.objects.filter(facility=facility).first()

    if facility_promo_rules_set and current_date > facility_promo_rules_set.end_date:
        message = "Current date is past the end date of Facility Promo Rules."
        messages.success(request, message)
        # print("Current date is on or before the end date of Facility Promo Rules, or no rules found.")

    # Check if subrule_list is not empty
    if mainrule_list.exists():
            mainrule = request.POST.get('mainrule', mainrule_list.first().id)
            new_rate = main_rules.rate
            person_rate = main_rules.person_rate
            facility_list.rateperhour = new_rate
            facility_list.person_rateperhour = person_rate
            facility_list.save()
    else:
        mainrule = None 

    if subrule_list.exists():
        subrule = request.POST.get('subrule', subrule_list.first().id)
    else:
        subrule = None 

    if promorule_list.exists():
        promorule = request.POST.get('promorule', promorule_list.first().id)
        
        end_date = promo_rules.end_date

        if current_date < end_date:
            facility_list.rateperhour = main_rules.rate
            facility_list.person_rateperhour = main_rules.person_rate
            facility_list.save()
            message = "Current date is past the end date of Facility Promo Rules**********************."
            messages.success(request, message)
        else:
            new_rate = promo_rules.new_rate
            person_new_rate = promo_rules.person_new_rate
            facility_list.rateperhour = new_rate
            facility_list.person_rateperhour = person_new_rate
            facility_list.save()
    else:
        promorule = None  # or set to an appropriate default value

    # Update the status for all matching instances

    mainrules_list.update(status=1)
    subrules_list.update(status=1)
    promorules_list.update(status=1)

    # Update the settings in a single call
    setting_list.update(mainrules=mainrule, subrules=subrule, promorules=promorule)

    # mainrules.save()
    message = f"Rules successfully set."

    messages.success(request, message)

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_setfacilitymainrules_status(request, id):
    mainrules = get_object_or_404(Facility_MainRules_set, pk=id)
    faci_id = request.session.get('faci_id')
    main = Setting_Facility.objects.filter(mainrules=id)
    main.update(mainrules="")
    mainrules.delete()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_facilitymainrules(request, id):
    facility = Facility_MainRules.objects.get(pk=int(id))
    faci_id = request.session.get('faci_id')

    facility.delete()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_facilitysubrules(request, id):
    facility = Facility_SubRules.objects.get(pk=int(id))
    faci_id = request.session.get('faci_id')

    facility.delete()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_facilitypromorules(request, id):
    facility = Facility_PromoRules.objects.get(pk=int(id))
    faci_id = request.session.get('faci_id')

    facility.delete()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitypromorules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))


# -----------------------------------------SUB RULES-----------------------------------------
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_facility_subrules(request, id):
    firstname = request.session.get('firstname')
    sfacility = get_object_or_404(Setting_Facility, pk=id)
    request.session['faci_id'] = sfacility.pk
    request.session['facility'] = sfacility.facility_id
    template = 'facility_subrules.html'
    addedsubrules = Facility_SubRules.objects.all().order_by('-created_at')
    fmainrules = Facility_MainRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fsubrules = Facility_SubRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fpromorules = Facility_PromoRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    
    if request.method == 'POST':
        sform = FacilitySubRulesForm(request.POST)
        if sform.is_valid():
            sfacility
            sform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        sform = FacilitySubRulesForm(initial={'facility': sfacility.facility}) 

    return render(request, template, {'sfacility': sfacility, 
        'addedsubrules': addedsubrules,
        'sform': sform,
        'fmainrules': fmainrules, 
        'fsubrules':fsubrules,
        'fpromorules':fpromorules,
        'firstname':firstname
    })

# is_setfacilitysubrules_status
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def is_setfacilitysubrules_status(request):
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')

    # facilities = get_object_or_404(Facility, facilityname=facility)
    main_rules = Facility_MainRules_set.objects.filter(facility=facility).first()
    promo_rules = Facility_PromoRules_set.objects.filter(facility=facility).first()
    # Retrieve all rule sets
    facility_list = Facility.objects.get(id=facility)
    mainrule_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrule_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorule_list = Facility_PromoRules_set.objects.filter(facility=facility)

    # Filter rule sets by facility
    mainrules_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrules_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorules_list = Facility_PromoRules_set.objects.filter(facility=facility)

    setting_list = Setting_Facility.objects.filter(facility=facility)

    

    
    # Check if subrule_list is not empty
    if mainrule_list.exists():
            mainrule = request.POST.get('mainrule', mainrule_list.first().id)
            new_rate = main_rules.rate
            facility_list.rateperhour = new_rate
            facility_list.save()
    else:
        mainrule = None 

    if subrule_list.exists():
        subrule = request.POST.get('subrule', subrule_list.first().id)
    else:
        subrule = None 

    if promorule_list.exists():
        promorule = request.POST.get('promorule', promorule_list.first().id)
        new_rate = promo_rules.new_rate
        facility_list.rateperhour = new_rate
        facility_list.save()
    else:
        promorule = None  # or set to an appropriate default value

    # Update the status for all matching instances

    mainrules_list.update(status=1)
    subrules_list.update(status=1)
    promorules_list.update(status=1)

    # Update the settings in a single call
    setting_list.update(mainrules=mainrule, subrules=subrule, promorules=promorule)

    # mainrules.save()
    message = f"Rules successfully set."

    messages.success(request, message)

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_subrules.html'))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def facilitysubrules_set(request, id):
    subrules = get_object_or_404(Facility_SubRules, pk=id)
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
        
    newfacility = request.POST.get('facility', facility)
    title = request.POST.get('title',subrules.title)
    description = request.POST.get('description', subrules.description)
    status = 0
    # new_Facility = Facility_SubRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description, rate=rate, status=status)
    if Facility_SubRules_set.objects.filter(facility=newfacility).exists():
        rules_count = Facility_SubRules_set.objects.filter(facility=facility, status=0).count()
        
        # Facility exists, check if title is different
 

        if Facility_SubRules_set.objects.filter(status=1):
            message = f"You have to remove the existing set rule first to add new rule"
            messages.warning(request, message)

        elif Facility_SubRules_set.objects.filter(title=title).exists():  
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)

        elif not Facility_SubRules_set.objects.filter(title=title).exists():
            if Facility_SubRules_set.objects.filter(status=0):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            elif not rules_count > 1:
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:
                new_Facility = Facility_SubRules_set(facility=newfacility, title=title, description=description, status=status)
                new_Facility.save()
   
    
    else:
        # Facility doesn't exist, check if title exists
        if Facility_SubRules_set.objects.filter(title=title).exists():
            new_Facility = Facility_SubRules_set(facility=newfacility, title=title, description=description, status=status)
            new_Facility.save()

        elif Facility_SubRules_set.objects.filter(status=0).exists():
            new_Facility = Facility_SubRules_set(facility=newfacility, title=title, description=description, status=status)
            new_Facility.save() 

        else:
            # Neither facility nor title exist
            new_Facility = Facility_SubRules_set(facility=newfacility, title=title, description=description, status=status)
            new_Facility.save()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_subrules.html'))
    

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_setfacilitysubrules_status(request, id):
    subrules = get_object_or_404(Facility_SubRules_set, pk=id)
    faci_id = request.session.get('faci_id')
    sub = Setting_Facility.objects.filter(subrules=id)
    sub.update(subrules="")
    subrules.delete()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitysubrules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_subrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

# -------------------------------promo rules----------------------------------------------------
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_facility_promorules(request, id):
    firstname = request.session.get('firstname')
    sfacility = get_object_or_404(Setting_Facility, pk=id)
    request.session['faci_id'] = sfacility.pk
    request.session['facility'] = sfacility.facility_id
    template = 'facility_promorules.html'
    addedpromorules = Facility_PromoRules.objects.all().order_by('-created_at')
    fmainrules = Facility_MainRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fsubrules = Facility_SubRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    fpromorules = Facility_PromoRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    
    if request.method == 'POST':
        pform = FacilityPromoRulesForm(request.POST)
        if pform.is_valid():
            sfacility
            pform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        pform = FacilityPromoRulesForm(initial={'facility': sfacility.facility}) 

    return render(request, template, {'sfacility': sfacility, 
        'addedpromorules': addedpromorules,
        'pform': pform,
        'fmainrules': fmainrules, 
        'fsubrules':fsubrules,
        'fpromorules':fpromorules,
        'firstname':firstname
    })

# is_setfacilitysubrules_status
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def is_setfacilitypromorules_status(request):
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
    
    # facilities = get_object_or_404(Facility, facilityname=facility)
    main_rules = Facility_MainRules_set.objects.filter(facility=facility).first()
    promo_rules = Facility_PromoRules_set.objects.filter(facility=facility).first()
    # Retrieve all rule sets
    facility_list = Facility.objects.get(id=facility)
    mainrule_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrule_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorule_list = Facility_PromoRules_set.objects.filter(facility=facility)

    # Filter rule sets by facility
    mainrules_list = Facility_MainRules_set.objects.filter(facility=facility)
    subrules_list = Facility_SubRules_set.objects.filter(facility=facility)
    promorules_list = Facility_PromoRules_set.objects.filter(facility=facility)

    setting_list = Setting_Facility.objects.filter(facility=facility)

    

    
    # # Check if subrule_list is not empty
    # facility_promo_rules_set = Facility_PromoRules_set.objects.filter(facility=facility).first()

    # if facility_promo_rules_set and current_date > facility_promo_rules_set.end_date:
    #     message = "Current date is past the end date of Facility Promo Rules."
    #     messages.success(request, message)
        # print("Current date is on or before the end date of Facility Promo Rules, or no rules found.")

    # Check if subrule_list is not empty
    if mainrule_list.exists():
            mainrule = request.POST.get('mainrule', mainrule_list.first().id)
            new_rate = main_rules.rate
            person_rate = main_rules.person_rate
            facility_list.rateperhour = new_rate
            facility_list.person_rateperhour = person_rate
            facility_list.save()
    else:
        mainrule = None 

    if subrule_list.exists():
        subrule = request.POST.get('subrule', subrule_list.first().id)
    else:
        subrule = None 

    if promorule_list.exists():
        promorule = request.POST.get('promorule', promorule_list.first().id)
        
        end_date = promo_rules.end_date
        current_date = datetime.now()

        current_date_aware = timezone.make_aware(current_date, timezone=timezone.utc)

        if current_date_aware < end_date:
            facility_list.rateperhour = main_rules.rate
            facility_list.person_rateperhour = main_rules.person_rate
            facility_list.save()
            message = "Current date is past the end date of Facility Promo Rules**********************."
            messages.success(request, message)
        else:
            new_rate = promo_rules.new_rate
            person_new_rate = promo_rules.person_new_rate
            facility_list.rateperhour = new_rate
            facility_list.person_rateperhour = person_new_rate
            facility_list.save()
    else:
        promorule = None  # or set to an appropriate default value# or set to an appropriate default value

    # Update the status for all matching instances

    mainrules_list.update(status=1)
    subrules_list.update(status=1)
    promorules_list.update(status=1)

    # Update the settings in a single call
    setting_list.update(mainrules=mainrule, subrules=subrule, promorules=promorule)

    # mainrules.save()
    message = f"Rules successfully set."

    messages.success(request, message)

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitypromorules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_promorules.html'))

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def facilitypromorules_set(request, id):
    promorules = get_object_or_404(Facility_PromoRules, pk=id)
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
        
    newfacility = request.POST.get('facility', facility)
    title = request.POST.get('title',promorules.title)
    description = request.POST.get('description', promorules.description)
    new_rate = request.POST.get('new_rate',promorules.new_rate)
    person_new_rate = request.POST.get('person_new_rate',promorules.person_new_rate)
    start_date = request.POST.get('start_date',promorules.start_date)
    end_date = request.POST.get('end_date',promorules.end_date)
    num_attendies = request.POST.get('num_attendies',promorules.num_attendies)
    num_pc = request.POST.get('num_pc',promorules.num_pc)
    status = 0
    promo_rules = Facility_PromoRules_set.objects.all()


    # for promo_rule in promo_rules:
    #     promo_rule.delete_if_expired()

    # new_Facility = Facility_SubRules_set(facility=newfacility, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description, rate=rate, status=status)
    if Facility_PromoRules_set.objects.filter(facility=newfacility).exists():
        rules_count = Facility_PromoRules_set.objects.filter(facility=facility, status=0).count()
        
        # Facility exists, check if title is different
 

        if Facility_PromoRules_set.objects.filter(status=1):
            message = f"You have to remove the existing set rule first to add new rule"
            messages.warning(request, message)

        elif Facility_PromoRules_set.objects.filter(title=title).exists():  
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)

        elif not Facility_PromoRules_set.objects.filter(title=title).exists():
            if Facility_PromoRules_set.objects.filter(status=0):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            elif not rules_count > 1:
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:              
                new_Facility = Facility_PromoRules_set(facility=newfacility, title=title, description=description, new_rate=new_rate, person_new_rate=person_new_rate, start_date=start_date, end_date=end_date, num_attendies=num_attendies, status=status, num_pc=num_pc)
                new_Facility.save()


    
    else:
        # Facility doesn't exist, check if title exists
        if Facility_PromoRules_set.objects.filter(title=title).exists():
            new_Facility = Facility_PromoRules_set(facility=newfacility, title=title, description=description, new_rate=new_rate, person_new_rate=person_new_rate, start_date=start_date, end_date=end_date, num_attendies=num_attendies, status=status, num_pc=num_pc)
            new_Facility.save()

        elif Facility_PromoRules_set.objects.filter(status=0).exists():
            new_Facility = Facility_PromoRules_set(facility=newfacility, title=title, description=description, new_rate=new_rate, person_new_rate=person_new_rate, start_date=start_date, end_date=end_date, num_attendies=num_attendies, status=status, num_pc=num_pc)
            new_Facility.save() 
            
        else:
            # Neither facility nor title exist
            new_Facility = Facility_PromoRules_set(facility=newfacility, title=title, description=description, new_rate=new_rate, person_new_rate=person_new_rate, start_date=start_date, end_date=end_date, num_attendies=num_attendies, status=status, num_pc=num_pc)
            new_Facility.save()

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitypromorules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_promorules.html'))
    

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_setfacilitypromorules_status(request, id):
    promorules = get_object_or_404(Facility_PromoRules_set, pk=id)
    faci_id = request.session.get('faci_id')
    promo = Setting_Facility.objects.filter(promorules=id)
    promo.update(promorules="")
    promorules.delete()

    

    if faci_id is not None:
        return HttpResponseRedirect(reverse('facility:facilitypromorules', args=[faci_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('facility_promorules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_facility_promo(request, id):
    sfacility = get_object_or_404(Setting_Facility, pk=id)
    firstname = request.session.get('firstname')
    faci_id = request.session.get('faci_id')
    facility = request.session.get('facility')
    template = 'facility_promorules.html'
    addedpromorules = Facility_PromoRules.objects.all().order_by('-created_at')
    fpromorules = Facility_PromoRules_set.objects.all().filter(facility=sfacility.facility_id).order_by('-modified_at')
    
    if request.method == 'POST':
        pform = FacilityPromoRulesForm(request.POST)
        if pform.is_valid():
            pform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        pform = FacilitySubRulesForm(initial={'facility': sfacility.facility}) 

    return render(request, template, {'sfacility': sfacility, 'fpromorules': fpromorules, 'addedpromorules': addedpromorules,'pform': pform, 'firstname':firstname})

# @csrf_protect
# @login_required
# @user_passes_test(is_superuser)
# def revenue_dashboard(request):
#     firstname = request.session.get('firstname')
#     chart_type_form = ChartTypeForm(request.GET or None)
#     revenue_trans = Booking.objects.all().order_by('-id')
#     start_date = request.GET.get('start_date')
#     end_date = request.GET.get('end_date')
#     facility_id = request.GET.get('facility')
#     facilityt = Facility.objects.filter(isdeleted=0).order_by('id')
#     bookings = Booking.objects.all()
#     facilities = Facility.objects.filter(isdeleted=False)
#     months = bookings.dates('bookDate', 'month') 
#     labelsmonth = [month.strftime('%B %Y') for month in months]
#     facility_stats = {}

#     if start_date and end_date:
#         start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
#         end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
#         bookings = bookings.filter(date__range=(start_date, end_date))

#     if facility_id:
#         bookings = bookings.filter(venue__id=facility_id)
#         facilities = facilities.filter(id=facility_id)

#     for facility in facilities:
#         # Count number of reservations for each facility
#         num_reservations = Booking.objects.filter(venue_id=facility.id).count()
#         facility.num_reservations = num_reservations

#         total_hours = Booking.objects.filter(venue_id=facility.id).aggregate(total_duration=Sum('duration'))['total_duration'] or 0
#         facility.total_hours = total_hours

#         facility_revenue_points = Booking.objects.filter(venue_id=facility.id).aggregate(total_points=Sum('points'))['total_points'] or 0
#         facility.facility_revenue_points = facility_revenue_points

#         facility_revenue_coins = Booking.objects.filter(venue_id=facility.id).aggregate(total_coins=Sum('coins'))['total_coins'] or 0
#         facility.facility_revenue_coins = facility_revenue_coins
#         total_reservation = revenue_trans.all().count()
#         number_facility = facilityt.all().count()
#     for facility in facilityt: 
#         context = {
#             'bookings': bookings,
#             'facilities': facilities,
#             'firstname':firstname
#         }


#         facility_stats[facility.facilityname] = {
#             'facility': facility_id,
#             'num_reservations': num_reservations,
#             'total_hours': total_hours,
#             'facility_revenue_points': facility_revenue_points,
#             'facility_revenue_coins': facility_revenue_coins,
#         }    
       
#         labels = [facility_name for facility_name, stats in facility_stats.items()]
#         # label = [facility_name for facility_name, stats in facility_stats.items()]
#         data_values = [float(stats['facility_revenue_points']) for facility_name, stats in facility_stats.items()]
#         background_colors = [
#             'rgba(255, 0, 0, 0.2)',  # Red with 20% transparency
#             'rgba(0, 0, 255, 0.2)',  # Blue with 20% transparency
#             'rgba(255, 255, 0, 0.2)',  # Yellow with 20% transparency
#         ]
#         border_colors = [
#             'rgba(255, 0, 0, 1)',  # Solid red
#             'rgba(0, 0, 255, 1)',  # Solid blue
#             'rgba(255, 255, 0, 1)',  # Solid yellow
#         ]


#         labelsmonth_json = json.dumps(labelsmonth)
#         labels_json = json.dumps(labels)
#         background_colors_json = json.dumps(background_colors)
#         border_colors_json = json.dumps(border_colors)
#         data_values_json = json.dumps(data_values)
        

#         chart_type = 'bar'  # Default chart type

#         if chart_type_form.is_valid():
#             chart_type = chart_type_form.cleaned_data.get('chart_type')

#         return render(request, 'revenue_dashboard.html', {'revenue_trans': revenue_trans, 'facility_stats': facility_stats, 'facilityt': facilityt,
#                 'labels': labels_json,
#                 'labelsmonth': labelsmonth_json,
#                 'data_values': data_values_json,
#                 'background_colors': background_colors_json,
#                 'border_colors': border_colors_json,
#                 'chart_type': chart_type,
#                 'chart_type_form': chart_type_form,
#                 'total_revenue': facility_revenue_points,
#                 'facility_revenue_coins': facility_revenue_coins,
#                 'total_hours_all':total_hours,
#                 'total_reservation':total_reservation,
#                 'number_facility':number_facility,
#                 # 'total_charge_payments':total_charge_payments,
#                 'labels': labels,
#                 'firstname':firstname

#             })

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def revenue_dashboard(request):
    firstname = request.session.get('firstname')
    transactions = Booking.objects.all()
    chart_type_form = ChartTypeForm(request.GET or None)
    facilityt = Facility.objects.filter(isdeleted=0).order_by('id')
    facility_filter = request.GET.get('facility')
    revenue_trans = Booking.objects.all().order_by('-id')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    facilities = Facility.objects.filter(isdeleted=False)
    # months = transactions.bookedDate('transaction_datetime', 'month')  # Assuming 'transaction_datetime' is the correct field name
    # Convert the months to a list of strings

# Extracting months and years from bookDate field
    months_years = transactions.annotate(
        month=ExtractMonth('bookDate'),
        year=ExtractYear('bookDate')
    ).values('month', 'year').distinct().order_by('year', 'month')

    # Convert the months and years to a list of strings
    labelsmonth = [f"{month['month']} {month['year']}" for month in months_years]

    if start_date and end_date:
        bookings = bookings.filter(date__range=(start_date, end_date))

    if facility_filter:
        revenue_trans = revenue_trans.filter(venue__id=facility_filter)

    for facility in facilities:
    # total_revenue = revenue_trans.aggregate(Sum('total'))['total__sum'] or 0.0
        total_revenue_points = Booking.objects.aggregate(total_points=Sum('points'))['total_points'] or 0.0
        facility.facility_revenue_points = total_revenue_points

        total_revenue_coins = Booking.objects.aggregate(total_coins=Sum('coins'))['total_coins'] or 0.0
        facility.facility_revenue_coins = total_revenue_coins

        total_revenue = total_revenue_points+total_revenue_coins

        # total_hours_all = revenue_trans.all().aggregate(Sum('duration_booking'))['duration_booking__sum'] or 0.0
        total_hours_all = revenue_trans.aggregate(total_duration=Sum('duration'))['total_duration'] or 0.0
        facility.total_hours = total_hours_all

        # total_reservation = revenue_trans.all().count()
        total_reservation = revenue_trans.all().count()
        facility.num_reservations = total_reservation

        number_facility = facilityt.all().count()

        # total_charge_payments = revenue_trans.aggregate(Sum('charge_payment'))['charge_payment__sum'] or 0.0


            # facility_revenue_points = Booking.objects.filter(venue_id=facility.id).aggregate(total_points=Sum('points'))['total_points'] or 0
            # facility.facility_revenue_points = facility_revenue_points

        # total_revenue_coins = Booking.objects.filter(venue_id=facility.id).aggregate(total_coins=Sum('coins'))['total_coins'] or 0.0
        # facility.facility_revenue_coins = total_revenue_coins
        # Initialize dictionaries to store calculated values
        facility_stats = {}


    if facility_filter:
        selected_facility = Facility.objects.filter(id=facility_filter,isdeleted=0).first()
        if selected_facility:
            # Count the number of reservations for the selected facility
            num_reservations = revenue_trans.filter(venue_id=selected_facility).count()

            # Calculate the total hours for the selected facility
            total_hours = revenue_trans.filter(venue_id=selected_facility).aggregate(total_duration=Sum('duration'))['total_duration'] or 0.0

            # Calculate the facility revenue for the selected facility
            facility_revenue_points = revenue_trans.filter(venue_id=selected_facility).aggregate(total_points=Sum('points'))['total_points'] or 0.0
            facility_revenue_coins = revenue_trans.filter(venue_id=selected_facility).aggregate(total_coins=Sum('coins'))['total_coins'] or 0.0

            facility_revenue = facility_revenue_points+facility_revenue_coins
            facility_stats[selected_facility.facilityname] = {
                'facility': selected_facility,
                'num_reservations': num_reservations,
                'total_hours': total_hours,
                'facility_revenue': facility_revenue,
                'facility_revenue_points':facility_revenue_points,
            }
    else:
        # If no facility is selected, calculate statistics for all facilities
        for facility in facilityt:
            num_reservations = revenue_trans.filter(venue_id=facility).count()
            total_hours = revenue_trans.filter(venue_id=facility).aggregate(total_duration=Sum('duration'))['total_duration'] or 0.0
            facility_revenue_points = revenue_trans.filter(venue_id=facility).aggregate(total_points=Sum('points'))['total_points'] or 0
            facility_revenue_coins = revenue_trans.filter(venue_id=facility).aggregate(total_coins=Sum('coins'))['total_coins'] or 0
            facility_revenue = facility_revenue_points+facility_revenue_coins
            facility_stats[facility.facilityname] = {
                'facility': facility,
                'num_reservations': num_reservations,
                'total_hours': total_hours,
                'facility_revenue': facility_revenue,
                'facility_revenue_coins':facility_revenue_coins,
                'facility_revenue_points':facility_revenue_points,
            }
    # Convert Decimal values to floats before serializing
    labels = [facility_name for facility_name, stats in facility_stats.items()]
    # label = [facility_name for facility_name, stats in facility_stats.items()]
    data_values = [float(stats['facility_revenue']) for facility_name, stats in facility_stats.items()]
    data_values_coins = [float(stats['facility_revenue_points']) for facility_name, stats in facility_stats.items()]
    data_values_points = [float(stats['facility_revenue_coins']) for facility_name, stats in facility_stats.items()]

    background_colors = [
        'rgba(255, 0, 0, 0.2)',  # Red with 20% transparency
        'rgba(0, 0, 255, 0.2)',  # Blue with 20% transparency
        'rgba(255, 255, 0, 0.2)',  # Yellow with 20% transparency
    ]
    border_colors = [
        'rgba(255, 0, 0, 1)',  # Solid red
        'rgba(0, 0, 255, 1)',  # Solid blue
        'rgba(255, 255, 0, 1)',  # Solid yellow
    ]


    labelsmonth_json = json.dumps(labelsmonth)
    labels_json = json.dumps(labels)
    background_colors_json = json.dumps(background_colors)
    border_colors_json = json.dumps(border_colors)
    data_values_json = json.dumps(data_values)
    data_values_coins_json = json.dumps(data_values_coins)
    data_values_points_json = json.dumps(data_values_points)
    

    chart_type = 'bar'  # Default chart type

    if chart_type_form.is_valid():
        chart_type = chart_type_form.cleaned_data.get('chart_type')

    return render(request, 'revenue_dashboard.html', {'revenue_trans': revenue_trans, 'facility_stats': facility_stats, 'facilityt': facilityt,
            'labels': labels_json,
            'labelsmonth': labelsmonth_json,
            'data_values': data_values_json,
            'data_values_points': data_values_points_json,
            'data_values_coins': data_values_coins_json,
            'background_colors': background_colors_json,
            'border_colors': border_colors_json,
            'chart_type': chart_type,
            'chart_type_form': chart_type_form,
            'total_revenue': total_revenue,
            'total_hours_all':total_hours_all,
            'total_reservation':total_reservation,
            'number_facility':number_facility,
            # 'total_charge_payments':total_charge_payments,
            'labels': labels,
            'firstname':firstname,
            'total_revenue_points': total_revenue_points,
            'total_revenue_coins': total_revenue_coins,


        })

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def revenue_report(request):
    firstname = request.session.get('firstname')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    facility_id = request.GET.get('facility')

    bookings = Booking.objects.all()
    facilities = Facility.objects.filter(isdeleted=False)


    if start_date and end_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        bookings = bookings.filter(date__range=(start_date, end_date))

    if facility_id:
        bookings = bookings.filter(venue__id=facility_id)
        facilities = facilities.filter(id=facility_id)

    for facility in facilities:
        # Count number of reservations for each facility
        num_reservations = Booking.objects.filter(venue_id=facility.id).count()
        facility.num_reservations = num_reservations

        total_hours = Booking.objects.filter(venue_id=facility.id).aggregate(total_duration=Sum('duration'))['total_duration'] or 0
        facility.total_hours = total_hours

        facility_revenue_points = Booking.objects.filter(venue_id=facility.id).aggregate(total_points=Sum('points'))['total_points'] or 0
        facility.facility_revenue_points = facility_revenue_points

        facility_revenue_coins = Booking.objects.filter(venue_id=facility.id).aggregate(total_coins=Sum('coins'))['total_coins'] or 0
        facility.facility_revenue_coins = facility_revenue_coins

    context = {
        'bookings': bookings,
        'facilities': facilities,
        'firstname':firstname
    }

    return render(request, 'revenue_report.html', context)
# def revenue_report(request):
#     firstname = request.session.get('firstname')
#     facilityt = Facility.objects.all().order_by('isdeleted')
#     facility_filter = request.GET.get('facility')
#     if facility_filter and facility_filter.strip():
#         facility_filter = int(facility_filter)
#     revenue_trans = Booking.objects.all().order_by('-id')
#     attendance = Attendance.objects.all().order_by('-id')
#     # date = request.GET.get('date')
#     start_date = request.GET.get('start_date')
#     end_date = request.GET.get('end_date')
#     total_coins =Sum('points')

#     for facility in facilityt:
#         if revenue_trans.filter(venueId=facility.id).exists():
#             facility_fee = facility.rateperhour

#         if start_date and end_date:
#             revenue_trans = revenue_trans.filter(date__range=[start_date, end_date])

#         if facility_filter:
#             revenue_trans = revenue_trans.filter(venueId=facility_filter)

#         # Initialize dictionaries to store calculated values
#         facility_stats = {}

#         if facility_filter:
#             selected_facility = Facility.objects.filter(id=facility_filter).first()
#             if selected_facility:
#                 # Count the number of reservations for the selected facility
#                 num_reservations = revenue_trans.filter(venueId=selected_facility.id).count()

#                 # Calculate the total hours for the selected facility
#                 total_hours = revenue_trans.filter(venueId=selected_facility.id).aggregate(Sum('duration'))['duration__sum'] or 0.0

#                 # Calculate the facility revenue for the selected facility
#                 facility_revenue = revenue_trans.filter(venueId=selected_facility.id).aggregate(total_coins)or 0.0

#                 facility_stats[selected_facility.facilityname] = {
#                     'facility': selected_facility,
#                     'num_reservations': num_reservations,
#                     'total_hours': total_hours,
#                     'facility_revenue': facility_revenue,
#                 }
#         else:
#             # If no facility is selected, calculate statistics for all facilities
#             for facility in facilityt:
#                 num_reservations = revenue_trans.filter(venueId=facility.id).count()
#                 total_hours = revenue_trans.filter(venueId=facility.id).aggregate(Sum('duration'))['duration__sum'] or 0.0
#                 facility_revenue = revenue_trans.filter(venueId=facility.id).aggregate()or 0.0
#                 # facility_revenue = revenue_trans.filter(venueId=facility).aggregate(Sum('total'))['total__sum'] or 0.0
#                 facility_stats[facility.facilityname] = {
#                     'facility': facility,
#                     'num_reservations': num_reservations,
#                     'total_hours': total_hours,
#                     'facility_revenue': facility_revenue,
#                 }

#         return render(request, 'revenue_report.html', {'revenue_trans': revenue_trans, 'facility_stats': facility_stats, 'facilityt': facilityt,'firstname':firstname})




# def revenue_dashboard(request):
    
#     chart_type_form = ChartTypeForm(request.GET or None)
#     facility_filter = request.GET.get('facility')
#     start_date = request.GET.get('start_date')
#     end_date = request.GET.get('end_date')

#     facilityt = Facility.objects.all().order_by('id')
#     revenue_trans = Transaction.objects.all().order_by('-id')

#     facility_stats = []

#     if facility_filter:
#         selected_facility = Facility.objects.filter(id=facility_filter).first()
#         if selected_facility:
#             # Count the number of reservations for the selected facility
#             num_reservations = revenue_trans.filter(facility=selected_facility).count()

#             # Calculate the total hours for the selected facility
#             total_hours = revenue_trans.filter(facility=selected_facility).aggregate(Sum('duration_booking'))['duration_booking__sum'] or 0.0

#             # Calculate the facility revenue for the selected facility
#             facility_revenue = revenue_trans.filter(facility=selected_facility).aggregate(Sum('total'))['total__sum'] or 0.0

#             facility_stats.append({
#                 'facility': selected_facility,
#                 'num_reservations': num_reservations,
#                 'total_hours': total_hours,
#                 'facility_revenue': facility_revenue,
#             })
#     else:
#         for facility in facilityt:
#             num_reservations = revenue_trans.filter(facility=facility).count()
#             total_hours = revenue_trans.filter(facility=facility).aggregate(Sum('duration_booking'))['duration_booking__sum'] or 0.0
#             facility_revenue = revenue_trans.filter(facility=facility).aggregate(Sum('total'))['total__sum'] or 0.0

#             facility_stats.append({
#                 'facility': facility,
#                 'num_reservations': num_reservations,
#                 'total_hours': total_hours,
#                 'facility_revenue': facility_revenue,
#             })

# # Convert Decimal values to floats before serializing
#     labels = [facility['facility'].facilityname for facility in facility_stats]
#     data_values = [float(facility['facility_revenue']) for facility in facility_stats]
#     background_colors = [
#         'rgba(255, 0, 0, 0.2)',  # Red with 20% transparency
#         'rgba(0, 0, 255, 0.2)',  # Blue with 20% transparency
#         'rgba(255, 255, 0, 0.2)',  # Yellow with 20% transparency
#     ]
#     border_colors = [
#         'rgba(255, 0, 0, 1)',  # Solid red
#         'rgba(0, 0, 255, 1)',  # Solid blue
#         'rgba(255, 255, 0, 1)',  # Solid yellow
#     ]

#     labels_json = json.dumps(labels)
#     background_colors_json = json.dumps(background_colors)
#     border_colors_json = json.dumps(border_colors)
#     data_values_json = json.dumps(data_values)
    

#     chart_type = 'bar'  # Default chart type

#     if chart_type_form.is_valid():
#         chart_type = chart_type_form.cleaned_data.get('chart_type')

#     return render(request, 'revenue_dashboard.html', {
#         'labels': labels_json,
#         'data_values': data_values_json,
#         'background_colors': background_colors_json,
#         'border_colors': border_colors_json,
#         'chart_type': chart_type,
#         'chart_type_form': chart_type_form,
#         'facilityt':facilityt,
#         'facility_stats': facility_stats,   
#     })

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_calendar(request):
    stypes_ched = Sched_Type.objects.all()
    firstname = request.session.get('firstname')
    event = CalendarEvent.objects.all().order_by('-created_at')
    facility_filter = request.GET.get('facility')
    request.session['facility'] = facility_filter
    facevent = CalendarEvent.objects.all().order_by('facility_id')
    facility = Facility.objects.filter(isdeleted=0).order_by('id')
    typesched = CalendarEvent.objects.values('type_sched').distinct().order_by('type_sched')
    type_filter = request.GET.get('type')
    type = Sched_TypeForm(request.POST)
    calform = CalendarEventForm(request.POST)
    template = 'calendar.html'

    if facility_filter:
        event = CalendarEvent.objects.filter(facility=facility_filter)
    if type_filter:
        event = CalendarEvent.objects.filter(type_sched=type_filter)

    if request.method == 'POST':
        if type.is_valid():
            type.save()

        if calform.is_valid():
            calform.save()        # Process your POST data here

    return render(request, template, {'calform': calform, 'event': event, 'facility': facility, 'typesched': typesched, 'firstname':firstname, 'stypes_ched':stypes_ched})


@csrf_protect
@login_required
@user_passes_test(is_superuser)
def delete_event(request, id):
    event = get_object_or_404(CalendarEvent, pk=id)
    event.delete()
    message = f"{event.event_name} successfully deleted."
    messages.success(request, message)
    return redirect('facility:calendar') 

@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_calendarview(request):
    firstname = request.session.get('firstname')
    if request.method == 'POST':
        # Handle the form submission here
        pass  # Replace with your form handling logic

    facilities = Facility.objects.filter(isdeleted=0).order_by('id')
    events = CalendarEvent.objects.all().order_by('id')
    
    event_data = []
    for event in events:
        event_data.append({
            'title': event.event_name,
            'date': event.date,
            'start': event.start,
            'end': event.end,
            # 'facility': event.facility.facilityname,  # Assuming 'facility' has a 'name' field
            # 'type_sched': event.type_sched.type_sched,
        })

    context = {
        'facility': facilities,
        'event_data': event_data,
        'calform': CalendarEventForm(),
        'firstname':firstname
    }

    
    return render(request, 'calendarview.html', context)



def get_events(request):
    events = CalendarEvent.objects.all().order_by('id')
    event_data = []

    for event in events:
        start_datetime = datetime.combine(event.date, event.start)
        end_datetime = datetime.combine(event.date, event.end)

        facility_name = event.facility.facilityname if event.facility else ''

        # Access 'typesched' through the appropriate related field name
        typesched_type = event.typesched_field.type_sched if hasattr(event, 'typesched_field') else ''

        description_text = f"Facility: {facility_name}, Type: {typesched_type}"

        event_data.append({
            'title': event.event_name,
            'start': start_datetime.isoformat(),
            'end': end_datetime.isoformat(),
            # 'description': description_text,
        })

    return JsonResponse(event_data, safe=False)

@login_required
@user_passes_test(is_superuser)
def transaction(request):
    firstname = request.session.get('firstname')
    if request.method == 'POST':
        transform = TransactionForm(request.POST)
        if transform.is_valid():
            transform.save()
            return redirect('revenue_report.html')  # Redirect to a success page or transaction list page
    else:
        transform = TransactionForm()

    trans = Transaction.objects.all().order_by('id')


    context = {
        'transactions': trans,
        'transaction_form': transform,
    }

    return render(request, 'revenue_report.html', context,{'firstname':firstname})

# ---------------------------------------------------------------------------------------------------------------------
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def display_usertype_mainrules(request, id):
    firstname = request.session.get('firstname')
    suser = get_object_or_404(Setting_UserType, pk=id)
    request.session['user_type_id'] = suser.pk
    request.session['user_type'] = suser.user_type_id
    template = 'usertype_mainrules.html'
    addedmainrules = UserType_MainRules.objects.all().order_by('-created_at')
    umainrules = UserType_MainRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    usubrules = UserType_SubRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    upromorules = UserType_PromoRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    
    if request.method == 'POST':
        mform = UserTypeMainRulesForm(request.POST)
        if mform.is_valid():
            mform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        mform = UserTypeMainRulesForm(initial={'user_type': suser.user_type}) 

    return render(request, template, {'suser': suser,  
        'addedmainrules':  addedmainrules,
        'mform': mform,
        'umainrules': umainrules,
        'usubrules': usubrules,
        'upromorules': upromorules,
        'firstname': firstname

        })
# from django.http import HttpResponseRedirect
# from django.urls import reverse

@login_required
@user_passes_test(is_superuser)
def usertypemainrules_set(request, id):
    mainrules = get_object_or_404(UserType_MainRules, pk=id)
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    newuser = request.POST.get('user_type', user_type)
    title = request.POST.get('title',mainrules.title)
    points = request.POST.get('points',mainrules.points)
    num_pc = request.POST.get('num_pc',mainrules.num_pc)
    num_attendies = request.POST.get('num_attendies',mainrules.num_attendies)
    description = request.POST.get('description', mainrules.description)
    rate = request.POST.get('rate', mainrules.rate)
    status = 0
    # new_Facility = Facility_MainRules_set(facility=newfacility, title=title, description=description, rate=rate, status=status)
    if UserType_MainRules_set.objects.filter(user_type=newuser).exists():
        # Facility exists, check if title is different
        if UserType_MainRules_set.objects.filter(status=1):
            message = f"You have to remove the existing rule first to add new rule"
            messages.warning(request, message)

        elif not UserType_MainRules_set.objects.filter(title=title).exists():
            if UserType_MainRules_set.objects.filter(status=1):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:
                new_Facility = UserType_MainRules_set(user_type=newuser, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, status=status)
                new_Facility.save()


    else:
        # Facility doesn't exist, check if title exists
        if UserType_MainRules_set.objects.filter(title=title).exists():
            new_user = UserType_MainRules_set(user_type=newuser, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, status=status)
            new_user.save()

        elif UserType_MainRules_set.objects.filter(status=0).exists():
            new_user = UserType_MainRules_set(user_type=newuser, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, status=status)
            new_user.save()
        else:
            # Neither facility nor title exist
            new_user = UserType_MainRules_set(user_type=newuser, title=title, points=points, num_pc=num_pc, num_attendies=num_attendies, description=description,  rate=rate, status=status)
            new_user.save()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_mainrules.html'))

@login_required
@user_passes_test(is_superuser)
def is_setusermainrules_status(request):
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    # setting_facility = Setting_Facility.objects.filter(facility=facility)

    mainrule_list = UserType_MainRules_set.objects.filter(user_type=user_type)
    subrule_list = UserType_SubRules_set.objects.filter(user_type=user_type)
    promorule_list = UserType_PromoRules_set.objects.filter(user_type=user_type)

    mainrules_list = UserType_MainRules_set.objects.filter(user_type=user_type)
    subrules_list = UserType_SubRules_set.objects.filter(user_type=user_type)
    promorules_list = UserType_PromoRules_set.objects.filter(user_type=user_type)
    
    setting_list = Setting_UserType.objects.filter(user_type=user_type)

    if mainrule_list.exists():
        mainrule = request.POST.get('mainrule', mainrule_list.first().id)
    else:
        mainrule = None 

    if subrule_list.exists():
        subrule = request.POST.get('subrule', subrule_list.first().id)
    else:
        subrule = None 

    if promorule_list.exists():
        promorule = request.POST.get('promorule', promorule_list.first().id)
    else:
        promorule = None  # or set to an appropriate default value

    # Update the status for all matching instances
    # setting_facility.save()
    mainrules_list.update(status=1)
    subrules_list.update(status=1)
    promorules_list.update(status=1)

    # Update the settings in a single call
    setting_list.update(mainrules=mainrule, subrules=subrule, promorules=promorule)

    # mainrules.save()
    message = f"Rules successfully set."

    messages.success(request, message)

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_mainrules.html'))

@login_required
@user_passes_test(is_superuser)
def delete_setusermainrules_status(request, id):
    mainrules = get_object_or_404(UserType_MainRules_set, pk=id)
    user_id = request.session.get('user_type_id')
    main = Setting_UserType.objects.filter(mainrules=id)
    main.update(mainrules="")
    mainrules.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

@login_required
@user_passes_test(is_superuser)
def delete_usermainrules(request, id):
    user_type = UserType_MainRules.objects.get(pk=int(id))
    user_id = request.session.get('user_type_id')

    user_type.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_mainrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

# ---------------------------------------------------Sub Rules--------------------------------

@login_required
@user_passes_test(is_superuser)
def display_usertype_subrules(request, id):
    firstname = request.session.get('firstname')
    suser = get_object_or_404(Setting_UserType, pk=id)
    request.session['user_type_id'] = suser.pk
    request.session['user_type'] = suser.user_type_id
    template = 'usertype_subrules.html'
    addedsubrules = UserType_SubRules.objects.all().order_by('-created_at')
    umainrules = UserType_MainRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    usubrules = UserType_SubRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    upromorules = UserType_PromoRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    
    if request.method == 'POST':
        mform = UserTypeSubRulesForm(request.POST)
        if mform.is_valid():
            mform.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        mform = UserTypeSubRulesForm(initial={'user_type': suser.user_type}) 

    return render(request, template, {'suser': suser, 
        'addedsubrules':  addedsubrules,
        'mform': mform,
        'umainrules': umainrules,
        'usubrules': usubrules,
        'upromorules': upromorules,
        'firstname': firstname
        
        })

@login_required
@user_passes_test(is_superuser)
def usertypesubrules_set(request, id):
    subrules = get_object_or_404(UserType_SubRules, pk=id)
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    newuser = request.POST.get('user_type', user_type)
    title = request.POST.get('title',subrules.title)
    description = request.POST.get('description', subrules.description)
    status = 0
    # new_Facility = Facility_MainRules_set(facility=newfacility, title=title, description=description, rate=rate, status=status)
    if UserType_SubRules_set.objects.filter(user_type=newuser).exists():
        # Facility exists, check if title is different
        if UserType_SubRules_set.objects.filter(status=1):
            message = f"You have to remove the existing rule first to add new rule"
            messages.warning(request, message)

        elif not UserType_SubRules_set.objects.filter(title=title).exists():
            if UserType_SubRules_set.objects.filter(status=1):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:
                new_Facility = UserType_SubRules_set(user_type=newuser, title=title,description=description, status=status)
                new_Facility.save()
    else:
        # Facility doesn't exist, check if title exists
        if UserType_SubRules_set.objects.filter(title=title).exists():
            new_user = UserType_SubRules_set(user_type=newuser, title=title,description=description, status=status)
            new_user.save()

        elif UserType_SubRules_set.objects.filter(status=0).exists():
            new_user = UserType_SubRules_set(user_type=newuser, title=title,description=description, status=status)
            new_user.save()
        else:
            # Neither facility nor title exist
            new_user = UserType_SubRules_set(user_type=newuser, title=title,description=description, status=status)
            new_user.save()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userSubRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_subrules.html'))

@login_required
@user_passes_test(is_superuser)
def is_setusersubrules_status(request):
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    subrules_list = UserType_SubRules_set.objects.filter(user_type=user_type)
    
    # Update the status for all matching instances
    subrules_list.update(status=1)
    message = f"The status for {subrules_list.count()} User with the name {user_type} has been updated to 1."

    messages.success(request, message)

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userSubRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_subrules.html'))

@login_required
@user_passes_test(is_superuser)
def delete_setusersubrules_status(request, id):
    subrules = get_object_or_404(UserType_SubRules_set, pk=id)
    user_id = request.session.get('user_type_id')
    sub = Setting_UserType.objects.filter(subrules=id)
    sub.update(subrules="")
    subrules.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userSubRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_subrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

@login_required
@user_passes_test(is_superuser)
def delete_usersubrules(request, id):
    user_type = get_object_or_404(UserType_SubRules, pk=id)
    user_id = request.session.get('user_type_id')

    user_type.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userSubRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_subrules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

# ---------------------------------------User PROMO RULES ---------------------------------

@login_required
@user_passes_test(is_superuser)
def display_usertype_promorules(request, id):
    firstname = request.session.get('firstname')
    suser = get_object_or_404(Setting_UserType, pk=id)
    request.session['user_type_id'] = suser.pk
    request.session['user_type'] = suser.user_type_id
    template = 'usertype_promorules.html'
    addedpromorules = UserType_PromoRules.objects.all().order_by('-created_at')
    umainrules = UserType_MainRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    usubrules = UserType_SubRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    upromorules = UserType_PromoRules_set.objects.filter(user_type=suser.user_type_id).order_by('-modified_at')
    
    if request.method == 'POST':
        title = request.POST['title']
        description = request.POST['description']
        new_rate = request.POST['new_rate']
        start_date = request.POST['start_date']
        end_date = request.POST['end_date']
        capacity = request.POST['capacity']

        new_promorules = UserType_PromoRules(title=title,description=description,new_rate=new_rate,start_date=start_date,end_date=end_date,capacity=capacity)
        new_promorules.save()
            
    else:
        # Set the initial value of the 'facility' field in the form
        mform = UserTypePromoRulesForm(initial={'user_type': suser.user_type}) 

    return render(request, template, {'suser': suser,  
        'addedpromorules':  addedpromorules,
        'umainrules': umainrules,
        'usubrules': usubrules,
        'upromorules': upromorules,
        'firstname':firstname
    })

@login_required
@user_passes_test(is_superuser)
def usertypepromorules_set(request, id):
    promorules = get_object_or_404(UserType_PromoRules, pk=id)
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')

    newuser = request.POST.get('user_type', user_type)
    title = request.POST.get('title',promorules.title)
    description = request.POST.get('description', promorules.description)
    new_rate = request.POST.get('new_rate', promorules.new_rate)
    start_date = request.POST.get('start_date', promorules.start_date)
    end_date = request.POST.get('end_date', promorules.end_date)
    capacity = request.POST.get('capacity', promorules.capacity)
    status = 0
    
    # new_Facility = Facility_MainRules_set(facility=newfacility, title=title, description=description, rate=rate, status=status)
    if UserType_PromoRules_set.objects.filter(user_type=newuser).exists():
        # Facility exists, check if title is different
        if UserType_PromoRules_set.objects.filter(status=1):
            message = f"You have to remove the existing rule first to add new rule"
            messages.warning(request, message)

        elif not UserType_PromoRules_set.objects.filter(title=title).exists():
            if UserType_PromoRules_set.objects.filter(status=1):
                message = f"You have to remove the existing rule first to add new rule"
                messages.warning(request, message)
            else:
                new_Facility = UserType_PromoRules_set(user_type=newuser, title=title, description=description, new_rate=new_rate, start_date=start_date, end_date=end_date, capacity=capacity, status=status)
                new_Facility.save()
    else:
        # Facility doesn't exist, check if title exists
        if UserType_PromoRules_set.objects.filter(title=title).exists():
            new_user = UserType_PromoRules_set(user_type=newuser, title=title, description=description, new_rate=new_rate, start_date=start_date, end_date=end_date, capacity=capacity, status=status)
            new_user.save()

        elif UserType_PromoRules_set.objects.filter(status=0).exists():
            new_user = UserType_PromoRules_set(user_type=newuser, title=title, description=description, new_rate=new_rate, start_date=start_date, end_date=end_date, capacity=capacity, status=status)
            new_user.save()
        else:
            # Neither facility nor title exist
            new_user = UserType_PromoRules_set(user_type=newuser, title=title, description=description, new_rate=new_rate, start_date=start_date, end_date=end_date, capacity=capacity, status=status)
            new_user.save()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userPromoRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_promorules.html'))

@login_required
@user_passes_test(is_superuser)
def is_setuserpromorules_status(request):
    user_id = request.session.get('user_type_id')
    user_type = request.session.get('user_type')
    promorules_list = UserType_PromoRules_set.objects.filter(user_type=user_type)
    
    # Update the status for all matching instances
    promorules_list.update(status=1)
    message = f"The status for {promorules_list.count()} User with the name {user_type} has been updated to 1."

    messages.success(request, message)

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userPromoRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_promorules.html'))

@login_required
@user_passes_test(is_superuser)
def delete_setuserpromorules_status(request, id):
    promorules = get_object_or_404(UserType_PromoRules_set, pk=id)
    user_id = request.session.get('user_type_id')
    promo = Setting_UserType.objects.filter(promorules=id)
    promo.update(promorules="")
    promorules.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userPromoRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_promorules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

@login_required
@user_passes_test(is_superuser)
def delete_userpromorules(request, id):
    user_type = UserType_PromoRules.objects.get(pk=int(id))
    user_id = request.session.get('user_type_id')

    user_type.delete()

    if user_id is not None:
        return HttpResponseRedirect(reverse('facility:userPromoRules', args=[user_id]))
    else:
        # Handle the case when faci_id is None, e.g., by redirecting to a default URL
        return HttpResponseRedirect(reverse('usertype_promorules.html'))
        # return HttpResponseRedirect(reverse('facility:facilityRules', args=[faci_id]))

#--------------------------------update Main Rules------------------------------------------------
@login_required
@user_passes_test(is_superuser)
def update_userMainRules(request, id):
    firstname = request.session.get('firstname')
    mainrules = get_object_or_404(UserType_MainRules, pk=id)
    request.session['user_type_id'] = mainrules.pk
    
    if request.method == 'POST':
        # upform = FacilityUpdateForm(request.POST, instance=facility)
        # upform = FacilityUpdateForm(request.POST,initial={'facilityname': facility.facilityname, 'rateperhour':facility.rateperhour, 'capacity':facility.capacity})
        upform = UserTypeMainRulesForm(request.POST, instance=mainrules)
        new_mainrules = request.POST.get('title') 
        if upform.is_valid():
            # upform = FacilityUpdateForm(request.POST)
            upform.save()

            with connection.cursor() as cursor:
            # Define the SQL UPDATE statement with placeholders
                sql = """
                UPDATE `facility_facility_mainrules` 
                SET `facility` = %s 
                WHERE `facility_facility_mainrules`.`id` = %s
                """

            # Execute the SQL statement with the new values
                cursor.execute(sql, [new_mainrules, id])
            return redirect('facility:usertable')

    else:
        mainrules = get_object_or_404(UserType_MainRules, pk=id) 
        upform = UserTypeMainRulesForm(instance=mainrules)
    
    return render(request, 'update_usermainrules.html',{'upform': upform, 'mainrules':mainrules, 'firstname':firstname})
    # return HttpResponseRedirect(reverse(request,'facility:updatefacility',{'upform': upform, 'facility': facility}))
    # return render(request, 'facility.html',)
# changed

#---------------------------------------------Update Sub Rules------------------------------------------
@login_required
@user_passes_test(is_superuser)
def update_userSubRules(request, id):
    firstname = request.session.get('firstname')
    subrules = get_object_or_404(UserType_SubRules, pk=id)
    request.session['user_type_id'] = subrules.pk
    
    if request.method == 'POST':
        # upform = FacilityUpdateForm(request.POST, instance=facility)
        # upform = FacilityUpdateForm(request.POST,initial={'facilityname': facility.facilityname, 'rateperhour':facility.rateperhour, 'capacity':facility.capacity})
        upform = UserTypeSubRulesForm(request.POST, instance=subrules)
        new_subrules = request.POST.get('title') 
        if upform.is_valid():
            # upform = FacilityUpdateForm(request.POST)
            upform.save()

            with connection.cursor() as cursor:
            # Define the SQL UPDATE statement with placeholders
                sql = """
                UPDATE `facility_facility_subrules` 
                SET `facility` = %s 
                WHERE `facility_facility_subrules`.`id` = %s
                """

            # Execute the SQL statement with the new values
                cursor.execute(sql, [new_subrules, id])
            return redirect('facility:usertable')

    else:
        subrules = get_object_or_404(UserType_SubRules, pk=id) 
        upform = UserTypeSubRulesForm(instance=subrules)
    
    return render(request, 'update_usersubrules.html',{'upform': upform, 'subrules':subrules,'firstname':firstname})
    # return HttpResponseRedirect(reverse(request,'facility:updatefacility',{'upform': upform, 'facility': facility}))
    # return render(request, 'facility.html',)
# changed

#---------------------------------------------Update Promo Rules------------------------------------------
@login_required
@user_passes_test(is_superuser)
def update_userPromoRules(request, id):
    firstname = request.session.get('firstname')
    promorules = get_object_or_404(UserType_PromoRules, pk=id)
    request.session['user_type_id'] = promorules.pk
    
    if request.method == 'POST':
        # upform = FacilityUpdateForm(request.POST, instance=facility)
        # upform = FacilityUpdateForm(request.POST,initial={'facilityname': facility.facilityname, 'rateperhour':facility.rateperhour, 'capacity':facility.capacity})
        upform = UserTypePromoRulesForm(request.POST, instance=promorules)
        new_promorules = request.POST.get('title') 
        if upform.is_valid():
            # upform = FacilityUpdateForm(request.POST)
            upform.save()

            with connection.cursor() as cursor:
            # Define the SQL UPDATE statement with placeholders
                sql = """
                UPDATE `facility_facility_promorules` 
                SET `facility` = %s 
                WHERE `facility_facility_promorules`.`id` = %s
                """

            # Execute the SQL statement with the new values
                cursor.execute(sql, [new_promorules, id])
            return redirect('facility:usertable')

    else:
        promorules = get_object_or_404(UserType_PromoRules, pk=id) 
        upform = UserTypePromoRulesForm(instance=promorules)
    
    return render(request, 'update_userpromorules.html',{'upform': upform, 'promorules':promorules,'firstname':firstname})
    # return HttpResponseRedirect(reverse(request,'facility:updatefacility',{'upform': upform, 'facility': facility}))
    # return render(request, 'facility.html',)
# changed
@csrf_protect
@login_required
@user_passes_test(is_superuser)
def displayall_setting_usertype(request):
    # usertype = User.objects.all
    setting_usertype = Setting_UserType.objects.all().order_by('id')   
    firstname = request.session.get('firstname') 
    usertype = User_Type.objects.all()
    if request.method == 'POST':
        forms = RulesUserTypeForm(request.POST)
        if forms.is_valid():
            # Check if a record with the same facility already exists
            user_type = forms.cleaned_data['user_type']
            if not Setting_UserType.objects.filter(user_type=user_type).exists():
                # If no record with the same facility exists, save the new record
                forms.save()
            else:
                # Handle the case where a record with the same facility already exists
                # You can display an error message or perform another action here
                # For example, you can add an error message to the form
                message = f"This usertype already exist"
                messages.warning(request, message)
                

    else:
        # Set the initial value of the 'facility' field in the form
        forms = RulesUserTypeForm() 

    return render(request, 'usertype_table.html', {'setting_usertype': setting_usertype, 'forms':forms, 'firstname':firstname, 'usertype':usertype})

@login_required
@user_passes_test(is_superuser)
def set_user_session(request, user_id):
    # Set the 'facility_id' session variable to the clicked facility's ID
    request.session['user_id'] = user_id
    return redirect('facility:listofuser') 