import uuid
from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from api.models.BookingModel import Booking
from django.db import models


class Attendance(models.Model):
    id = models.AutoField(primary_key=True)  
    rfid=models.CharField(max_length=30,null=True)  
    date=models.DateField(auto_now_add=True)
    signInTime=models.TimeField(null=True)
    signOutTime=models.TimeField(null=True,default=None)   
    isOverstaying= models.BooleanField(default=False, null=True)
    isSignedIn=models.BooleanField(default=False, null=True)
    venueName=models.CharField(max_length=50,null=True)
    venueId=models.IntegerField(null=True,default=0)    
    name=models.CharField(max_length=50,null=True)
    booking=models.ForeignKey(Booking,related_name='booking',to_field='id',on_delete=models.CASCADE)
    user_id=models.IntegerField(default=0,null=True)
    def __str__(self) -> str:
        return f"REF NO:{self.id}"