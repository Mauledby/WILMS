import datetime
from rest_framework import serializers
from api.models import *
from wallet.models import User as UserObject
from facility.models import CalendarEvent
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Booking
        fields=('__all__')

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model=Venue
        fields=('__all__')
class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attendee
        fields=('__all__')
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserObject
        fields=('email','id')
        
class AttendanceResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attendance
        fields=('name','id','date','signInTime','signOutTime','isOverstaying','isSignedIn','venueName','name','venueId', 'booking')
class BookingRequestSerializer(serializers.ModelSerializer):
    attendees=AttendeeSerializer(many=True)
    class Meta:
        model=Booking
        fields=('purpose','description','venue','date','startTime','endTime','computers','coins','points','user','attendees','officeName',)
    def create(self, validated_data):
        attendees=validated_data.pop('attendees')
        booking=Booking(**validated_data)        
        booking.save()
        serializer= AttendeeSerializer(data=attendees,many=True)
        if serializer.is_valid(raise_exception=True):
            attendees=serializer.save(booking=booking)
        return booking

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model=CalendarEvent
        fields=('__all__')
    