from django.utils.translation import gettext_lazy as _

from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.auth.models import AbstractUser 
from api.models.BookingModel import Booking
class Attendee(models.Model):
    id = models.AutoField(primary_key=True)
    name=models.CharField(max_length=50,null=True)
    user_id=models.IntegerField(null=True)
    booking=models.ForeignKey(Booking,related_name='attendees',on_delete=models.CASCADE,null=True)   
    rfid=models.CharField(max_length=30,null=True)
    def __str__(self) -> str:
        return f"{self.name}"    