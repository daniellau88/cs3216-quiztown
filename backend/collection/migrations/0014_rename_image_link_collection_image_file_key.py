# Generated by Django 3.2.7 on 2021-10-27 02:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0013_alter_collection_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='collection',
            old_name='image_link',
            new_name='image_file_key',
        ),
    ]