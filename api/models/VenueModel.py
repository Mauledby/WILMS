

from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
class Venue(models.Model):
    id = models.AutoField(primary_key=True)
    name=models.CharField(max_length=20,null=True)
    computers=models.IntegerField(null=True)
    hasComputers=models.BooleanField(null=True)

    def __str__(self) -> str:
        return self.name