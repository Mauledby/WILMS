from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from urllib.parse import urlencode
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import VendorTransaction
from .serializers import UserSerializer, VendorTransactionSerializer,LoginUserProfileInfoSerializer, LoginUserSerializer
from django.views.generic import TemplateView
from django.contrib.auth import logout

from wallet.models import UserProfileInfo
from rest_framework.authtoken.models import Token

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.utils.decorators import method_decorator
from rest_framework.decorators import authentication_classes, permission_classes

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect

from django.shortcuts import render, redirect
from urllib.parse import urlencode  # Import urlencode to encode URL parameters


@csrf_protect
@api_view(['GET', 'POST'])
def login_view(request):
    if request.method == 'GET':
        # Serve the login form
        return render(request, 'login.html')

    elif request.method == 'POST':
        # Handle the login POST request
        email = request.POST.get('email')
        password = request.POST.get('password')

        if email and password:
            user = authenticate(request, email=email, password=password)
            if user:
                # Log the user in
                login(request, user)
                # Generate or retrieve an authentication token
                token, _ = Token.objects.get_or_create(user=user)

                # Encode the token as a query parameter
                token_param = urlencode({'token': token.key})

                # Redirect the user to the create transaction page with the token parameter
                redirect_url = f'/walletAPI/create-transaction/?{token_param}'
                return redirect(redirect_url)
        
        return JsonResponse({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)




class CreateVendorTransactionView(generics.CreateAPIView):
    queryset = VendorTransaction.objects.all()
    serializer_class = VendorTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return render(request, 'create-transaction.html')

    def perform_create(self, serializer):
        user = self.request.user
        currency = self.request.data.get('currency')
        transaction_amount = float(self.request.data.get('total_cost'))

        profile_info = UserProfileInfo.objects.get(user=user)

        if currency == 'coins':
            if profile_info.coin_balance >= transaction_amount:
                profile_info.coin_balance -= transaction_amount
                profile_info.save()
            else:
                return Response({'detail': 'Insufficient coins.'}, status=status.HTTP_400_BAD_REQUEST)
        elif currency == 'points':
            if profile_info.point_balance >= transaction_amount:
                profile_info.point_balance -= transaction_amount
                profile_info.save()
            else:
                return Response({'detail': 'Insufficient points.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(customer=user)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        receipt_data = {
            'reference_code': serializer.data['reference_code'],
            'transaction_date': serializer.data['date'],
            'description': serializer.data['purpose'],
            'transaction_amount': serializer.data['total_cost'],
            'currency': self.request.data.get('currency'),
        }

        receipt_html = render(request, 'receipt.html', receipt_data)

        response_data = {
            'message': 'VendorTransaction created successfully',
            'reference_code': serializer.data['reference_code'],
            'user_id': self.request.user.id,
            'receipt_html': receipt_html.content.decode(),
        }

        return HttpResponse(receipt_html.content)
    

class TransactionReceiptView(TemplateView):
    template_name = 'receipt.html'


def logout_view(request):
    # Use Django's logout function to log the user out and clear the session
    logout(request)
    
    # Redirect the user to the login page or any other desired destination
    return redirect('walletAPI:login')  # Replace 'login' with the name of your login 




class CustomLoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user:
            if user.is_active:
                login(request, user)

                # Retrieve user profile information
                try:
                    user_profile = UserProfileInfo.objects.get(user=user)
                except UserProfileInfo.DoesNotExist:
                    user_profile = None

                user_data = UserSerializer(user).data

                if user_profile:
                    user_profile_data = LoginUserProfileInfoSerializer(user_profile).data
                else:
                    user_profile_data = {}

                # Combine the data into a single JSON response
                response_data = {
                    'user': user_data,
                    'user_profile': user_profile_data
                }

                return Response(response_data)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

