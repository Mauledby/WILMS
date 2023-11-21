from django.utils.translation import gettext_lazy as _
# from api.models import Venue
from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.auth.models import AbstractUser

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=200, null=True)
    role= models.CharField(max_length=20, null=True)
    def __str__(self):
        return self.username