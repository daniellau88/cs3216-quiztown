# Generated by Django 3.2.7 on 2021-10-20 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0008_delete_collectiontextimport'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='origin',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='collection',
            name='private',
            field=models.IntegerField(default=0),
        ),
    ]
