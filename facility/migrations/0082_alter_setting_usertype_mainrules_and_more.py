# Generated by Django 4.2.1 on 2023-11-08 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0081_setting_usertype_usertype_mainrules_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='setting_usertype',
            name='mainrules',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='setting_usertype',
            name='promorules',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='setting_usertype',
            name='subrules',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='setting_usertype',
            name='user_type',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
