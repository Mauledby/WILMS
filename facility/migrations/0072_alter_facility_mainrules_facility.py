# Generated by Django 4.2.1 on 2023-11-07 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0071_alter_facility_mainrules_facility'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facility_mainrules',
            name='facility',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
    ]
