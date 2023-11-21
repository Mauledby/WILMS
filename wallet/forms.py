from django import forms
from django.contrib.auth import get_user_model
from .models import UserProfileInfo, CoinTransaction

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
        user = kwargs.pop('user', None)  # Get the user from the keyword arguments
        super(CoinTransactionForm, self).__init__(*args, **kwargs)
        
        # Set the initial value of the requestee field to the current user
        if user:
            self.fields['requestee'].initial = user
        

        self.fields['requestee'].widget = forms.HiddenInput()

        

    class Meta:
        model = CoinTransaction
        fields = ['requestee', 'amount', 'image_receipt', 'date_in_receipt']



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
