from django import forms
from django.contrib.auth import get_user_model
from .models import UserProfileInfo, CoinTransaction
from django.core.validators import MinValueValidator

User = get_user_model()

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('email', 'password')


class UserProfileInfoForm(forms.ModelForm):
    confirm_password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = UserProfileInfo
        fields = ('first_name', 'last_name', 'confirm_password')
        widgets = {
            'password': forms.PasswordInput(),
        }

# INCREMENT 2

class CoinTransactionForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(CoinTransactionForm, self).__init__(*args, **kwargs)

        if user:
            self.fields['requestee'].initial = user

        self.fields['requestee'].widget = forms.HiddenInput()

    class Meta:
        model = CoinTransaction
        fields = ['requestee', 'amount', 'image_receipt', 'date_in_receipt']

        widgets = {
            'amount': forms.NumberInput(attrs={'min': 1}),  # Set the minimum value for the amount field
        }

        validators = {
            'amount': [MinValueValidator(1)],  # Another way to set the minimum value for the amount field
        }



class TransactionApprovalForm(forms.ModelForm):
    ACTION_CHOICES = (
        ('approve', 'Approve'),
        ('deny', 'Deny'),
    )
    
    action = forms.ChoiceField(choices=ACTION_CHOICES, widget=forms.RadioSelect)
    reference_code = forms.CharField(widget=forms.HiddenInput())

    class Meta:
        model = CoinTransaction
        fields = []  # No fields from the model, as this form is only for the action choice


class UserProfileInfoUpdateForm(forms.ModelForm):
    class Meta:
        model = UserProfileInfo
        fields = ('first_name', 'last_name', 'profile_picture')
