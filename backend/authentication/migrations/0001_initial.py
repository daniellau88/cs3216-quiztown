# Generated by Django 3.2.7 on 2021-10-04 17:41

from django.db import migrations, models
import quiztown.common.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GoogleAuthentication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.BigIntegerField(default=quiztown.common.models.get_default_current_timestamp)),
                ('updated_at', models.BigIntegerField(default=quiztown.common.models.get_default_current_timestamp)),
                ('user_id', models.IntegerField(unique=True)),
                ('email', models.CharField(max_length=100)),
                ('sub', models.CharField(max_length=255, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]