# Generated by Django 4.2.1 on 2023-11-10 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0090_alter_transaction_facility'),
    ]

    operations = [
        migrations.AddField(
            model_name='facility',
            name='isdeleted',
            field=models.BooleanField(default=0),
        ),
    ]
