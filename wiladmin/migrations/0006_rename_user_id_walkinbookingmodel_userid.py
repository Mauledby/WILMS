# Generated by Django 4.1 on 2023-12-13 14:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wiladmin', '0005_rename_userid_walkinbookingmodel_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='walkinbookingmodel',
            old_name='user_id',
            new_name='userid',
        ),
    ]
