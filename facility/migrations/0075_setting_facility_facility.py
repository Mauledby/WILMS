# Generated by Django 4.2.1 on 2023-11-07 08:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0074_remove_setting_facility_facility'),
    ]

    operations = [
        migrations.AddField(
            model_name='setting_facility',
            name='facility',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility'),
        ),
    ]
