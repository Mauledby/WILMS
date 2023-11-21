from .models import UserProfileInfo,User

def user_context_processor(request):
    def get_user_context(user):
        email=None
        try:
            profile = UserProfileInfo.objects.get(user_id=user)
            user_data = User.objects.get(email=user.email)
            email = user_data.email
            coin_balance = profile.coin_balance
            point_balance = profile.point_balance
            print(user.email) 
        except UserProfileInfo.DoesNotExist:
            coin_balance = 0.0
            point_balance = 0.0
            
            
            
            

        return {
            'coin_balance': coin_balance,
            'point_balance': point_balance,
            'email': email,
        }

    if request.user.is_authenticated:
        context = get_user_context(request.user)
    else:
        context = get_user_context(User())  # Provide an empty user if not authenticated

    return context