# Generated by Django 4.2.1 on 2023-10-24 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0061_alter_calendarevent_end_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarevent',
            name='facility',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
