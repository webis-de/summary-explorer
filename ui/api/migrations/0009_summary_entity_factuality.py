# Generated by Django 3.0.6 on 2021-06-21 00:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20210613_2326'),
    ]

    operations = [
        migrations.AddField(
            model_name='summary',
            name='entity_factuality',
            field=models.FloatField(default=0),
        ),
    ]