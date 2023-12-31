# Generated by Django 4.2.1 on 2023-11-10 13:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0088_alter_calendarevent_facility_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='facility_fee',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='calendarevent',
            name='facility',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='facility',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='facility.facility'),
        ),
    ]
