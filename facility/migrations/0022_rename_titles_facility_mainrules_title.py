# Generated by Django 4.2.1 on 2023-10-07 20:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0021_facility_mainrules'),
    ]

    operations = [
        migrations.RenameField(
            model_name='facility_mainrules',
            old_name='titles',
            new_name='title',
        ),
    ]
