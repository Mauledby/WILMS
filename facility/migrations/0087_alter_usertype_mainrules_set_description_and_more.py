# Generated by Django 4.2.1 on 2023-11-10 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0086_alter_setting_usertype_user_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usertype_mainrules_set',
            name='description',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='usertype_promorules',
            name='end_date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='usertype_promorules',
            name='start_date',
            field=models.DateTimeField(),
        ),
    ]
