# Generated by Django 3.2.7 on 2021-10-05 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0003_collection_image_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='image_link',
            field=models.CharField(blank=True, default='', max_length=1024),
        ),
        migrations.AlterField(
            model_name='collection',
            name='private',
            field=models.IntegerField(blank=True, default=1),
        ),
    ]
