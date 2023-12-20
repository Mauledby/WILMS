from django.shortcuts import get_object_or_404, render
from polls.models import AssignedArea
from wiladmin.models import WalkinBookingModel


class AssignedAreaController:
    def getAssignedArea(self, request):
        
        walkin_booking = get_object_or_404(WalkinBookingModel, user_id=request.user.id)
        area_id = walkin_booking.referenceid

        context = {
            'area_id': area_id[:2],
        }

        return render(request, "wil/location.html", context)
