# Generated by Django 3.2.7 on 2021-10-27 19:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_usersettings'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usersettings',
            unique_together={('user_id', 'settings_key')},
        ),
    ]
