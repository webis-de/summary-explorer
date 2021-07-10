# Generated by Django 3.0.6 on 2021-06-02 23:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210531_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='summary',
            name='dataset',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, to='api.Dataset', verbose_name='Dataset'),
            preserve_default=False,
        ),
    ]