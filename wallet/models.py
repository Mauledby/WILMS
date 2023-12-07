from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.user_type='admin'
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    STUDENT = 'student'
    TEACHER = 'teacher'
    ADMIN = 'admin'

    USER_TYPES = [
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
        (ADMIN, 'Admin'),
    ]

    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default=STUDENT)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # Set default to True for students
    is_verified = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        swappable = 'AUTH_USER_MODEL'
        default_related_name = 'wallet_users'

    
class UserProfileInfo(models.Model):
    profile_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    coin_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    point_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    points_to_give = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    rfid_value = models.CharField(max_length=50,unique=True, blank=True, null=True)  # Add this field for storing RFID values


    def __str__(self):
        return self.user.email



class Transaction(models.Model):
    transactionID = models.AutoField(primary_key=True)
    recipient = models.ForeignKey(User,related_name='transaction_reciepient', on_delete=models.CASCADE)
    sender = models.ForeignKey(User,related_name='transaction_sender', on_delete=models.CASCADE)
    points = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.transactionID)
    
class CoinTransaction(models.Model):
    reference_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    requestee = models.ForeignKey(User, related_name='coin_transactions_requested', on_delete=models.CASCADE)
    amount = models.FloatField(default=0.0)
    image_receipt = models.ImageField(upload_to='coin_transaction_receipts/')
    date_in_receipt = models.DateField()
    is_completed = models.BooleanField(default=False)
    is_denied = models.BooleanField(default=False)

    @property
    def is_pending(self):
        return not self.is_completed and not self.is_denied

    def __str__(self):
        return str(self.reference_code)



# Bonus Content

class AdminPointAward(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_point_awards')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_received_point_awards')
    points_awarded = models.DecimalField(max_digits=10, decimal_places=2)
    date_awarded = models.DateTimeField(auto_now_add=True)
    # Add any other relevant fields