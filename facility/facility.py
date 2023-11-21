from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from django.urls import reverse
from django.shortcuts import render

from FacilityManagement.facility.models import Facility

class DeleteFacility(View):
    template = 'facilitytable.html'

    def get(self, request, id):
        facility = Facility.objects.get(pk=int(id))
        facility.delete()
        return redirect(reverse('facility:addfacility'))  