<<<<<<< HEAD
# Generated by Django 4.1 on 2023-12-05 14:58
=======
# Generated by Django 4.2.5 on 2023-12-05 16:25
>>>>>>> c176c7d66a9f94394414c76c1abd79977da6431d

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_booking_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='area_id',
<<<<<<< HEAD
            field=models.CharField(max_length=5, null=True),
=======
            field=models.CharField(default=1, max_length=5),
            preserve_default=False,
>>>>>>> c176c7d66a9f94394414c76c1abd79977da6431d
        ),
    ]
