# Generated by Django 4.2.5 on 2023-12-17 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0101_facility_type_facility_person_rateperhour_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='facility',
            name='area_id',
            field=models.CharField(default=None, max_length=250, unique='area_id'),
        ),
    ]