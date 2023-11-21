# serializers.py in "walletAPI" app

from wallet.models import User, UserProfileInfo, Transaction, CoinTransaction
from .models import VendorTransaction
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileInfo
        fields = ('coin_balance', 'point_balance')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class CoinTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinTransaction
        fields = '__all__'
        
class VendorTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorTransaction
        fields = '__all__'


# FOR LOGGING

class LoginUserProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileInfo
        fields = '__all__'

class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'is_staff', 'is_active', 'is_verified']

