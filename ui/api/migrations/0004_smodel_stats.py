# Generated by Django 3.0.6 on 2021-06-09 21:21

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_summary_dataset'),
    ]

    operations = [
        migrations.AddField(
            model_name='smodel',
            name='stats',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, verbose_name='Statistics Data'),
        ),
    ]
