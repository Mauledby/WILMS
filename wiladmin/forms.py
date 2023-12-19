from django import forms

areas =( 
    ("A1", "A1"), 
    ("A2", "A2"), 
    ("A3", "A3"), 
    ("A4", "A4"), 
    ("A5", "A5"),
    ("A6", "A6"), 
    ("A7", "A7"), 
    ("A8", "A8"), 
    ("A9", "A9"), 
) 
  

class BookGuest(forms.Form):
    userid = forms.CharField(label="userid", max_length=100)
    area = forms.ChoiceField(choices = areas, widget=forms.Select)
    