# Generated by Django 3.0.6 on 2021-06-24 08:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20210624_0807'),
    ]

    operations = [
        migrations.AddField(
            model_name='summary',
            name='four_gram_abs',
            field=models.FloatField(default=0),
        ),
    ]