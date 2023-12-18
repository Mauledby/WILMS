# Generated by Django 4.2.5 on 2023-12-17 09:26

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0004_user_is_disabled'),
    ]

    operations = [
        migrations.CreateModel(
            name='User_Type',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_type', models.CharField(max_length=50, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('modified_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
