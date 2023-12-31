# Generated by Django 4.2.1 on 2023-10-24 17:24

import datetime
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0059_sched_type_calendarevent_type_sched'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calendarevent',
            name='date_repeat',
        ),
        migrations.AddField(
            model_name='calendarevent',
            name='selected_days',
            field=models.CharField(blank=True, choices=[('monday', 'Monday'), ('tuesday', 'Tuesday'), ('wednesday', 'Wednesday'), ('thursday', 'Thursday'), ('friday', 'Friday'), ('saturday', 'Saturday'), ('sunday', 'Sunday'), ('first_week', '1st Week of Month')], max_length=10),
        ),
        migrations.AlterField(
            model_name='calendarevent',
            name='end_date',
            field=models.DateTimeField(default=datetime.datetime),
        ),
        migrations.AlterField(
            model_name='calendarevent',
            name='start_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
