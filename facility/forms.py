from django import forms
from django.forms import ModelForm

from .models import CalendarEvent, Facility, Facility_MainRules, Facility_MainRules_set, Facility_PromoRules, Facility_PromoRules_set, Facility_SubRules, Facility_SubRules_set, Revenue_Transaction, Sched_Type, Setting_Facility, Setting_UserType, Transaction, User, User_Type, UserType_MainRules, UserType_MainRules_set, UserType_SubRules

class FacilityForm(ModelForm):
    facilityname = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility Name'}))
    rateperhour = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Enter rate per hour'}))
    capacity = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))

    class Meta:
        model = Facility
        fields = ['facilityname', 'rateperhour', 'capacity']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def clean(self):
        cleaned_data = super().clean()
        facilityname = cleaned_data.get('facilityname')
        rateperhour = cleaned_data.get('rateperhour')
        capacity = cleaned_data.get('capacity')

        if rateperhour is not None and rateperhour < 10:
            self.add_error('rateperhour', 'Rate per hour should not be below 10.')

        if capacity is not None and capacity > 30:
            self.add_error('capacity', 'Capacity should not exceed 30.')
        
        if Facility.objects.filter(facilityname=facilityname).exclude(pk=self.instance.pk).exists():
            self.add_error('facilityname', 'Facility with this name already exists.')


        return cleaned_data

    def __str__(self):
        return self.cleaned_data['facilityname'] + " ( " + str(self.cleaned_data['rateperhour']) + ") " + " (" + str(self.cleaned_data['capacity']) + ") "

class FacilityUpdateForm(ModelForm):
    facilityname = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility Name'}))
    rateperhour = forms.FloatField(widget=forms.TextInput(attrs={'placeholder':'Enter rate per hour'}))
    capacity = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder':'Enter Capacity'}))

    class Meta:
        model = Facility
        fields = ['facilityname', 'rateperhour', 'capacity']

    def clean(self):
        cleaned_data = super().clean()
        facilityname = cleaned_data.get('facilityname')
        rateperhour = cleaned_data.get('rateperhour')
        capacity = cleaned_data.get('capacity')

        if rateperhour is not None and rateperhour < 10:
            self.add_error('rateperhour', 'Rate per hour should not be below 10.')

        if capacity is not None and capacity > 30:
            self.add_error('capacity', 'Capacity should not exceed 30.')
        
        if Facility.objects.filter(facilityname=facilityname).exclude(pk=self.instance.pk).exists():
            self.add_error('facilityname', 'Facility with this name already exists.')


        return cleaned_data

    # def __str__(self):
    #     return self.cleaned_data['facilityname'] + " ( " + str(self.cleaned_data['rateperhour']) + ") " + " (" + str(self.cleaned_data['capacity']) + ") "


    def __init__(self, *args, **kwargs):
        super(FacilityUpdateForm, self).__init__(*args, **kwargs)

        # Set placeholders for the form fields
        self.fields['facilityname'].widget.attrs['placeholder'] = 'Rate Per Hour'
        self.fields['rateperhour'].widget.attrs['placeholder'] = 'Rate Per Hour'
        self.fields['capacity'].widget.attrs['placeholder'] = 'Capacity'        


class UserTypeForm(ModelForm):
    user_type = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Input User Type'}))
    
    class Meta:
        model = User_Type
        fields = ['user_type']

class UserForm(ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Input Username'}))
    user_type = forms.ModelChoiceField(widget=forms.Select(), queryset=User_Type.objects.only('user_type'))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Input Password'}))

    class Meta:
        model = User
        fields = ['username','user_type','password']

class SettingFacilityUpdateForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility'}))
    mainrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Main Rules'}))
    promorules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Promo Rules'}))
    subrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Sub Rules'}))

    class Meta:
        model = Setting_Facility
        fields = ['facility','mainrules','promorules','subrules']

class RulesFacilityForm(ModelForm):
    facility = forms.ModelChoiceField(widget=forms.Select(), queryset=Facility.objects.only('facilityname'))

    class Meta:
        model = Setting_Facility
        fields = ['facility']
        exlude = ['mainrules','promorules','subrules']

class SettingFacilityForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility'}))
    mainrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Main Rules'}))
    promorules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Promo Rules'}))
    subrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Sub Rules'}))

    class Meta:
        model = Setting_Facility
        fields = ['facility','mainrules','promorules','subrules']

class EditFacilityForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility'}))
    mainrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Main Rules'}))
    promorules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Promo Rules'}))
    subrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Sub Rules'}))

    class Meta:
        model = Setting_Facility
        fields = ['facility','mainrules','promorules','subrules']

class FacilityForm(ModelForm):
    facilityname = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility Name'}))
    rateperhour = forms.FloatField(widget=forms.TextInput(attrs={'placeholder':'Enter rate per hour'}))
    capacity = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder':'Enter Capacity'}))

    class Meta:
        model = Facility
        fields = ['facilityname','rateperhour','capacity']

    def __str__(self):
        return self.facilityname+ " (" +self.rateperhour +") "+" (" +self.capacity +") "

class FacilityTable(ModelForm):
    facilityname = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility Name'}))
    rateperhour = forms.FloatField(widget=forms.TextInput(attrs={'placeholder':'Enter rate per hour'}))
    capacity = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder':'Enter Capacity'}))

    class Meta:
        model = Facility
        fields = ['facilityname','rateperhour','capacity']

class UpdateFacilityForm(ModelForm):
    facilityname = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Facility Name'}))
    rateperhour = forms.FloatField(widget=forms.TextInput(attrs={'placeholder':'Enter rate per hour'}))
    capacity = forms.IntegerField(widget=forms.TextInput(attrs={'placeholder':'Enter Capacity'}))

    class Meta:
        model = Facility
        fields = ['id','facilityname','rateperhour','capacity']

    def __str__(self):
        return self.id+ " (" +self.facilityname+ " (" +self.rateperhour +") "+" (" +self.capacity +") "

# Add Main Rules to the User Form
class FacilityMainRulesForm(ModelForm):
    # facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    # status = forms.BooleanField()
    class Meta:
        model = Facility_MainRules
        fields = ['title','points','num_pc','num_attendies','description','rate']
        exclude = ['status','facility']  

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

class UpdateFacilityMainRulesForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    status = forms.BooleanField()
    class Meta:
        model = Facility_MainRules
        fields = ['facility','title','points','num_pc','num_attendies','description','rate','status']

    def clean(self):
        cleaned_data = super().clean()
        facility = cleaned_data.get('facility')
        title = cleaned_data.get('title')

        # Check if a record with the same title and facility exists
        existing_record = Facility_MainRules_set.objects.filter(facility=facility, title=title).first()

        if existing_record:
            # If facility and title combination already exists, raise a validation error
            if self.instance and self.instance.pk == existing_record.pk:
                # If editing the existing record, allow the same combination
                return cleaned_data
            self.add_error('title', 'A record with this Facility and Title combination already exists.')

        return cleaned_data

    def __str__(self):
        return (
            f"{self.cleaned_data['facility']} ({self.cleaned_data['title']}) "
            f"({self.cleaned_data['rate']} per person) "
            f"({self.cleaned_data['capacity']})"
        )

class FacilityMainRulesSetForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    status = forms.BooleanField()
    class Meta:
        model = Facility_MainRules_set
        fields = ['facility','title','points','num_pc','num_attendies','description','rate','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)





class FacilitySubRulesForm(ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    
    class Meta:
        model = Facility_SubRules  # Use '=' instead of ':'
        fields = ['title', 'description']
        exclude = ['status', 'facility']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False

class FacilitySubRulesSetForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    status = forms.BooleanField()

    class Meta:
        model = Facility_SubRules_set
        fields = ['facility','title','description','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

class FacilityPromoRulesForm(ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    new_rate = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Enter new rate'}))
    start_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    end_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    capacity = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))
 
    class Meta:
        model = Facility_PromoRules  # Use '=' instead of ':'
        fields = ['title', 'description','new_rate','start_date', 'end_date', 'capacity']
        exclude = ['status', 'facility']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False


class FacilityPromoRulesSetForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    new_rate = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Enter new rate'}))
    start_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    end_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    capacity = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))
    status = forms.BooleanField()

    class Meta:
        model = Facility_PromoRules_set
        fields = ['facility','title','description','new_rate','start_date', 'end_date', 'capacity','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

class Revenue_TransactionForm(ModelForm):
    transaction_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    event_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    customer_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))
    start_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    end_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    attendie_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    time_in = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    time_out = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    charge_payment = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))

    class Meta:
        model = Revenue_Transaction
        fields = ['transaction_date', 'facility','facility_fee','payment',
                  'event_name', 'customer_name', 'num_attendies',
                  'start_date', 'end_date', 'attendie_name', 'time_in',
                  'time_out','charge_payment']

class CalendarEventForm(forms.ModelForm):
    DAY_CHOICES = CalendarEvent.DAY_CHOICES  # Use the choices from the model
    
    selected_days = forms.ChoiceField(choices=DAY_CHOICES, required=False)
    event_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Enter Event Name'}))
    start_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    end_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    type_sched = forms.ModelChoiceField(widget=forms.Select(), queryset=Sched_Type.objects.only('type_sched'))
    facility = forms.ModelChoiceField(widget=forms.Select(), queryset=Facility.objects.only('facilityname'))
    class Meta:
        model = CalendarEvent
        fields = ['event_name', 'facility','start_date', 'end_date', 'selected_days','type_sched']

class Sched_TypeForm(forms.ModelForm):
    class Meta:
        model= Sched_Type
        fields= ['type_sched']

class CalendarEventUpdateForm(forms.ModelForm):
    DAY_CHOICES = CalendarEvent.DAY_CHOICES  # Use the choices from the model

    selected_days = forms.ChoiceField(choices=DAY_CHOICES, required=False)
    event_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Enter Event Name'}))
    facility = forms.ModelChoiceField(widget=forms.Select(), queryset=Facility.objects.only('facilityname'))
    start_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    end_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    type_sched = forms.ModelChoiceField(widget=forms.Select(), queryset=Sched_Type.objects.only('type_sched'))

    class Meta:
        model = CalendarEvent
        fields = ['event_name','start_date', 'end_date', 'selected_days','type_sched','facility']

class TransactionForm(forms.ModelForm):
    transaction_datetime = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    facility = forms.ModelChoiceField(widget=forms.Select(), queryset=Facility.objects.only('facilityname'))
    customer_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Enter Customer Name'}))
    time_in = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    time_out = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    start_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    end_date = forms.DateTimeField(widget=forms.TextInput(attrs={'type': 'datetime-local'}))
    add_payment = forms.FloatField(widget=forms.TextInput(attrs={'placeholder':'add payment'}))
    
    class Meta:
        model = Transaction
        fields = 'transaction_datetime', 'facility', 'customer_name', 'start_date', 'end_date', 'time_in', 'time_out', 'add_payment'  # Specify the fields to include
        exclude = 'duration', 'duration_booking', 'charge_payment', 'total', 'facility_fee'  # Exclude facility_fee

    def __init__(self, *args, **kwargs):
        super(TransactionForm, self).__init__(*args, **kwargs)
        if self.instance.facility:
            initial_facility_fee = self.instance.facility.rateperhour
            self.fields['facility'].widget.attrs['data-rateperhour'] = initial_facility_fee

    def clean(self):
        cleaned_data = super().clean()
        facility = cleaned_data.get('facility')
        time_in = cleaned_data.get('time_in')
        time_out = cleaned_data.get('time_out')
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        add_payment = cleaned_data.get('add_payment')

        if facility:
            rateperhour = facility.rateperhour
        else:
            rateperhour = 0.00

        duration = 0.0
        duration_booking = 0.0
        charge_payment = 0.0
        total = 0.0

        if time_in and time_out:
            duration = (time_out - time_in).total_seconds() / 3600

        if start_date and end_date:
            duration_booking = (end_date - start_date).total_seconds() / 3600

        # Calculate charge_payment based on the condition
        if duration > duration_booking:
            charge_payment = rateperhour * duration_booking

        total = rateperhour * duration_booking + add_payment + charge_payment

        cleaned_data['duration'] = duration
        cleaned_data['payment'] = rateperhour * duration_booking
        cleaned_data['duration_booking'] = duration_booking
        cleaned_data['charge_payment'] = charge_payment
        cleaned_data['total'] = total

        return cleaned_data
    

class ChartTypeForm(forms.Form):
    chart_type = forms.ChoiceField(choices=[('bar', 'Bar'), ('line', 'Line')], initial='bar')


class UserTypeMainRulesForm(ModelForm):
    # facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    # status = forms.BooleanField()
    class Meta:
        model = UserType_MainRules
        fields = ['title','points','num_pc','num_attendies','description','rate']
        exclude = ['status','user_type']  

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

#Update Main Rules forms on progress 

class UpdateUserTypeMainRulesForm(ModelForm):
    user_type = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    status = forms.BooleanField()
    class Meta:
        model = Facility_MainRules
        fields = ['user_type','title','points','num_pc','num_attendies','description','rate','status']

    def clean(self):
        cleaned_data = super().clean()
        facility = cleaned_data.get('facility')
        title = cleaned_data.get('title')

        # Check if a record with the same title and facility exists
        existing_record = Facility_MainRules_set.objects.filter(facility=facility, title=title).first()

        if existing_record:
            # If facility and title combination already exists, raise a validation error
            if self.instance and self.instance.pk == existing_record.pk:
                # If editing the existing record, allow the same combination
                return cleaned_data
            self.add_error('title', 'A record with this Facility and Title combination already exists.')

        return cleaned_data

    def __str__(self):
        return (
            f"{self.cleaned_data['facility']} ({self.cleaned_data['title']}) "
            f"({self.cleaned_data['rate']} per person) "
            f"({self.cleaned_data['capacity']})"
        )
    
# Set Main rules to the user type
class UserTypeMainRulesSetForm(ModelForm):
    user_type = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    points = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Points consumption per week'}))
    num_pc = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of PC Facility can book'}))
    num_attendies = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Number of person can attend'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    rate = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Rate per person'}))
    status = forms.BooleanField()
    class Meta:
        model = UserType_MainRules_set
        fields = ['user_type','title','points','num_pc','num_attendies','description','rate','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

# Sub Rules 
class UserTypeSubRulesForm(ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    
    class Meta:
        model = UserType_SubRules  # Use '=' instead of ':'
        fields = ['title', 'description']
        exclude = ['status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False

# Set Sub Rules to the User Type
class UserTypeSubRulesSetForm(ModelForm):
    user_type = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    status = forms.BooleanField()

    class Meta:
        model = Facility_SubRules_set
        fields = ['user_type','title','description','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)
#Add Promo Rules 
class UserTypePromoRulesForm(ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    new_rate = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Enter new rate'}))
    start_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    end_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'End date'}))
    capacity = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))
 
    class Meta:
        model = Facility_PromoRules  # Use '=' instead of ':'
        fields = ['title', 'description','new_rate','start_date', 'end_date', 'capacity']
        exclude = ['status', 'facility']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False

# Set Promo rules to the User type 
class UserTypePromoRulesSetForm(ModelForm):
    user_type = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    title = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Add Title'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Description'}))
    new_rate = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder':'Enter new rate'}))
    start_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'Start date'}))
    end_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'placehodler': 'End date'}))
    capacity = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder':'Enter Capacity'}))
    status = forms.BooleanField()

    class Meta:
        model = Facility_PromoRules_set
        fields = ['user_type','title','description','new_rate','start_date', 'end_date', 'capacity','status']

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['status'].initial = False  # Set 'status' field's initial value to False (0)

class RulesUserTypeForm(ModelForm):
    user_type = forms.ModelChoiceField(widget=forms.Select(), queryset=User_Type.objects.only('user_type'))

    class Meta:
        model = Setting_UserType
        fields = ['user_type']
        exlude = ['mainrules','promorules','subrules']

class SettingUserForm(ModelForm):
    facility = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter User Type'}))
    mainrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Main Rules'}))
    promorules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Promo Rules'}))
    subrules = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Enter Sub Rules'}))

    class Meta:
        model = Setting_UserType
        fields = ['user_type','mainrules','promorules','subrules']