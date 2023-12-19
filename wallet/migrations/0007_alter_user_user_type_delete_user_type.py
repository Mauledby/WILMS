# Generated by Django 4.2.5 on 2023-12-17 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0006_alter_user_user_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')], default='student', max_length=10),
        ),
        migrations.DeleteModel(
            name='User_Type',
        ),
    ]
