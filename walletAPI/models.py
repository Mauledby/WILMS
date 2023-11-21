from django.db import models
from wallet.models import User  # Import the User model from the "wallet" app
import uuid

class VendorTransaction(models.Model):

    # Choices for currency selection
    CURRENCY_CHOICES = (
        ('points', 'Points'),
        ('coins', 'Coins'),
    )

    # Custom UUID field with the "WILMS" prefix
    reference_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    venueName=models.CharField(max_length=50,null=True)
    date=models.DateTimeField( auto_now_add=True)
    BookDate=models.DateField(null=True)
    startTime=models.TimeField(null=True)
    endTime=models.TimeField(null=True)
    purpose=models.CharField( max_length=50,default='Studying',)
    computers=models.IntegerField(default=0)
    total_cost = models.FloatField(default=0.0)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='coins')

    # Foreign keys to User model from the "wallet" app
    customer = models.ForeignKey(User, on_delete=models.CASCADE)  # Assuming User is the customer

    
   

    def __str__(self):
        return str(self.reference_code)
