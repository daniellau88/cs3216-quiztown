# Generated by Django 3.2.7 on 2021-10-14 06:17

import card.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0007_card_box_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='answer',
            field=models.CharField(blank=True, default='', max_length=1024),
        ),
        migrations.AddField(
            model_name='card',
            name='card_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'image'), (1, 'text')], default=0),
        ),
        migrations.AddField(
            model_name='card',
            name='question',
            field=models.CharField(blank=True, default='', max_length=1024),
        ),
        migrations.AlterField(
            model_name='card',
            name='answer_details',
            field=models.JSONField(blank=True, default=dict, encoder=card.models.JSONEncoder),
        ),
        migrations.AlterField(
            model_name='card',
            name='image_metadata',
            field=models.JSONField(blank=True, default=dict, encoder=card.models.JSONEncoder),
        ),
    ]