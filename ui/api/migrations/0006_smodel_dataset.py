# Generated by Django 3.0.6 on 2021-06-13 22:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_smodel_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='smodel',
            name='dataset',
            field=models.ManyToManyField(to='api.Dataset'),
        ),
    ]