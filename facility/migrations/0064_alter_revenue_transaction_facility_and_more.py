# Generated by Django 4.2.1 on 2023-10-24 21:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0063_alter_calendarevent_facility'),
    ]

    operations = [
        migrations.AlterField(
            model_name='revenue_transaction',
            name='facility',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facility.facility'),
        ),
        migrations.AlterField(
            model_name='revenue_transaction',
            name='facility_fee',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
    ]
