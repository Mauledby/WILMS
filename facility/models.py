from django.db import models
from django.utils import timezone
from django.db.models import F, ExpressionWrapper, DurationField

# Create your models here.
class Facility(models.Model):
    facilityname = models.CharField(max_length=250, null=False, unique="facility_name")
    rateperhour = models.FloatField()
    capacity = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)
    isdeleted = models.BooleanField(default=0)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.facilityname
    
    
    

class Facility_MainRules(models.Model):
    facility = models.ForeignKey(Facility, null=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=100,null=False, unique="title")
    points = models.FloatField(blank=False, default=0.00)
    num_pc = models.IntegerField(blank=False, default=0)
    num_attendies = models.IntegerField(blank=False)
    description = models.CharField(max_length=255,null=False)
    rate = models.IntegerField(blank=False, default=0)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Facility_MainRules_set(models.Model):
    facility = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    points = models.FloatField(blank=False, default=0.00)
    num_pc = models.IntegerField(blank=False, default=0)
    num_attendies = models.IntegerField(blank=False, default=0)
    description = models.CharField(max_length=255,null=False, default="")
    rate = models.IntegerField(blank=False, default=0)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title    
    
class Facility_SubRules(models.Model):
    facility = models.CharField(max_length=100, null=True, default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title  

class Facility_SubRules_set(models.Model):
    facility = models.CharField(max_length=100, null=True, default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title 


class Facility_PromoRules(models.Model):
    facility = models.CharField(max_length=100, null=True, default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)
    new_rate = models.FloatField(blank=False, default=0.00)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title    

class Facility_PromoRules_set(models.Model):
    facility = models.CharField(max_length=100, null=True, default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)
    new_rate = models.FloatField(blank=False, default=0.00)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title 

class Setting_Facility(models.Model):
    facility = models.ForeignKey(Facility, null=True, on_delete=models.CASCADE)
    mainrules = models.ForeignKey(Facility_MainRules_set, null=True, on_delete=models.CASCADE)
    promorules = models.ForeignKey(Facility_PromoRules_set, null=True, on_delete=models.CASCADE)
    subrules = models.ForeignKey(Facility_SubRules_set, null=True, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.facility.facilityname 
    
class Revenue_Transaction(models.Model):
    transaction_date = models.DateTimeField(null=False)
    facility = models.ForeignKey(Facility, on_delete=models.SET_NULL, null=True, default=None)
    facility_fee = models.FloatField(default=0.00, null=True, blank=True)
    event_name = models.CharField(max_length=100,null=False)
    customer_name = models.CharField(max_length=100,null=False)
    num_attendies = models.IntegerField(default=0)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    payment = models.FloatField(default=0.00)
    attendie_name = models.CharField(max_length=100,null=False)
    time_in = models.DateTimeField(null=False)
    time_out = models.DateTimeField(null=False)
    add_payment = models.FloatField(default=0.00)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def calculate_total_hours(self):
        return ExpressionWrapper(
            F('end_date') - F('start_date'),
            output_field=DurationField()
        )

    def save(self, *args, **kwargs):
        if self.facility and self.facility_fee is None:
            self.facility_fee = self.facility.rateperhour
        super(Revenue_Transaction, self).save(*args, **kwargs)
    def __str__(self):
        return self.facility 

class Sched_Type(models.Model):
    type_sched = models.CharField(primary_key=True, max_length=100, unique="type_sched")

    def __str__(self):
        return self.type_sched

class CalendarEvent(models.Model):
    DAY_CHOICES = [
        ('1', 'Monday'),
        ('2', 'Tuesday'),
        ('3', 'Wednesday'),
        ('4', 'Thursday'),
        ('5', 'Friday'),
        ('7', 'Saturday'),
        ('8', 'Sunday'),
        ('first_week', '1st Week of Month'),
    ]

    event_name = models.CharField(max_length=100, null=False )
    facility = models.ForeignKey(Facility, null=True, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=False, default=timezone.now)
    end_date = models.DateTimeField(null=False, default=timezone.now)
    type_sched = models.ForeignKey(Sched_Type, null=True, on_delete=models.CASCADE)
    selected_days = models.CharField(max_length=10, choices=DAY_CHOICES, blank=True, null=False)


    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)



    # Add other fields to your model as needed

    def __str__(self):
        return self.selected_days+ " (" +self.facility+") "

class User_Type(models.Model):
    user_type = models.CharField(max_length=50, null=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user_type 
    


class User(models.Model):
    username = models.CharField(max_length=50, null=True)
    user_type = models.ForeignKey(User_Type, on_delete=models.SET_NULL, null=True, default=None)
    password = models.CharField(max_length=100, null=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username + " (" +self.user_type+") "
    
class Transaction(models.Model):
    transaction_datetime = models.DateTimeField()
    customer_name = models.CharField(max_length=100, null=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    facility = models.ForeignKey(Facility, on_delete=models.PROTECT, null=True)
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    add_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duration = models.FloatField(default=0.0)
    payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duration_booking = models.FloatField(default=0.0)
    charge_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    facility_fee = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.transaction_datetime = timezone.now()

        if self.facility:
            self.facility_fee = self.facility.rateperhour  # Set facility_fee directly to the rateperhour of the selected facility

        super().save(*args, **kwargs)
    
# ----------------------------------------------------------------------------------------------------------------------USER
class UserType_MainRules(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False, unique="title")
    points = models.FloatField(blank=False, default=0.00)
    num_pc = models.IntegerField(blank=False, default=0)
    num_attendies = models.IntegerField(blank=False)
    description = models.CharField(max_length=255,null=False)
    rate = models.IntegerField(blank=False, default=0)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    


class UserType_MainRules_set(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    points = models.FloatField(blank=False, default=0.00)
    num_pc = models.IntegerField(blank=False, default=0)
    num_attendies = models.IntegerField(blank=False, default=0)
    description = models.CharField(max_length=255,null=False)
    rate = models.IntegerField(blank=False, default=0)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title    
        
class UserType_SubRules(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title  

class UserType_SubRules_set(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title 

class UserType_PromoRules(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)
    new_rate = models.FloatField(blank=False, default=0.00)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title    

class UserType_PromoRules_set(models.Model):
    user_type = models.CharField(max_length=100,null=True,default=None)
    title = models.CharField(max_length=100,null=False)
    description = models.CharField(max_length=100,null=False)
    status = models.BooleanField(default=0)
    new_rate = models.FloatField(blank=False, default=0.00)
    start_date = models.DateTimeField(null=True,default=timezone.now)
    end_date = models.DateTimeField(null=True,default=timezone.now)
    capacity = models.IntegerField(default=0)

    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title  
    
class Setting_UserType(models.Model):
    user_type = models.ForeignKey(User_Type, null=True, on_delete=models.CASCADE)
    mainrules = models.ForeignKey(UserType_MainRules_set, null=True, on_delete=models.CASCADE)
    promorules = models.ForeignKey(UserType_PromoRules_set, null=True, on_delete=models.CASCADE)
    subrules = models.ForeignKey(UserType_SubRules_set, null=True, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=False)
    modified_at = models.DateTimeField(default=timezone.now, null=False)

    def save(self, *args, **kwargs):
        # Update the modified_at timestamp whenever the object is saved
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.user_type