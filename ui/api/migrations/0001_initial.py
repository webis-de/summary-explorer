# Generated by Django 3.0.6 on 2021-05-24 21:39

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('article_id', models.IntegerField()),
                ('raw', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, verbose_name='Article')),
            ],
            options={
                'verbose_name': 'Article',
                'verbose_name_plural': 'Articles',
                'ordering': ['article_id'],
            },
        ),
        migrations.CreateModel(
            name='Dataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'Summarization Datasets',
            },
        ),
        migrations.CreateModel(
            name='Evaluation_criteriums_group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'Evaluation Criteriums Group',
            },
        ),
        migrations.CreateModel(
            name='SModel',
            fields=[
                ('name', models.CharField(max_length=100, primary_key=True, serialize=False, unique=True, verbose_name='Model Name')),
                ('title', models.TextField(verbose_name='Title')),
                ('abstract', models.TextField(verbose_name='Abstract')),
                ('human_evaluation', models.TextField(verbose_name='Human Evaluation')),
                ('url', models.TextField(verbose_name='URL')),
                ('raw', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, verbose_name='Raw Data')),
            ],
            options={
                'verbose_name': 'Summerization Model',
                'verbose_name_plural': 'Summerization Models',
            },
        ),
        migrations.CreateModel(
            name='Summary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('raw', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True, verbose_name='Summary')),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Article')),
                ('smodel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.SModel')),
            ],
            options={
                'verbose_name': 'Summary',
                'verbose_name_plural': 'Summaries',
            },
        ),
        migrations.CreateModel(
            name='SModel_group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Dataset', verbose_name='Dataset')),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Summarization Model Group',
            },
        ),
        migrations.AddField(
            model_name='smodel',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.SModel_group', verbose_name='Group'),
        ),
        migrations.CreateModel(
            name='Evaluation_criteria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('order', models.IntegerField(default=0)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Evaluation_criteriums_group')),
            ],
            options={
                'verbose_name': 'Evaluation Criteria',
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='article',
            name='dataset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Dataset', verbose_name='Dataset'),
        ),
        migrations.AlterUniqueTogether(
            name='article',
            unique_together={('article_id', 'dataset_id')},
        ),
    ]
