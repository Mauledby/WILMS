# Generated by Django 4.2.1 on 2023-11-08 16:20

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0079_delete_setting_facility'),
    ]

    operations = [
        migrations.CreateModel(
            name='Setting_Facility',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('facility', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility')),
                ('mainrules', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility_mainrules_set')),
                ('promorules', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility_promorules_set')),
                ('subrules', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='facility.facility_subrules_set')),
            ],
        ),
    ]
