import uuid
from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from WILMS import settings
from api.models.VenueModel import Venue
from django.db import models


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    bookDate=models.DateTimeField( auto_now_add=True)
    date=models.DateField(null=True)
    startTime=models.TimeField(null=True)
    endTime=models.TimeField(null=True)
    purpose=models.CharField( max_length=50,default='Studying',)
    coins=models.FloatField(default=0)
    points=models.FloatField(default=0)
    computers=models.IntegerField(default=0)
    description=models.CharField(max_length=100,null=True)
    isUsed= models.BooleanField(default=False, null=True)
    duration=models.FloatField(default=0)
    referenceNo=models.TextField(max_length=8,blank=True,unique=True, default=uuid.uuid1)
    officeName=models.CharField(max_length=50,null=True)
    status=models.CharField(max_length=20,null=True, default='Booked')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='booker',null=True)
    venue=models.ForeignKey(Venue,related_name='venue',to_field='id',on_delete=models.CASCADE,null=True)
    venueName=models.CharField(max_length=50,null=True)
    venueId=models.IntegerField(null=True,default=0)
    
    def __str__(self) -> str:
        return f"REF NO:{self.referenceNo}"