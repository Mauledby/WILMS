# Generated by Django 4.1 on 2023-12-13 14:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wiladmin', '0004_alter_adminreportlogsmodel_endtime_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='walkinbookingmodel',
            old_name='userid',
            new_name='user_id',
        ),
    ]