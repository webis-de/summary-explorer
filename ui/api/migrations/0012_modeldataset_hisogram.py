# Generated by Django 3.0.6 on 2021-06-28 01:31

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_summary_four_gram_abs'),
    ]

    operations = [
        migrations.AddField(
            model_name='modeldataset',
            name='hisogram',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, verbose_name='Statistics Data'),
        ),
    ]
