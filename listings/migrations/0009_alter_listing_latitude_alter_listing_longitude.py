# Generated by Django 4.0.1 on 2022-11-04 00:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0008_alter_listing_area_alter_listing_listing_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='latitude',
            field=models.FloatField(max_length=150),
        ),
        migrations.AlterField(
            model_name='listing',
            name='longitude',
            field=models.FloatField(max_length=150),
        ),
    ]
