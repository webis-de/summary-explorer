import json

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


class Dataset(models.Model):
    name = models.TextField()
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Summarization Datasets')


class SModel_group(models.Model):
    name = models.TextField()
    description = models.TextField()
    users = models.ManyToManyField(User)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, verbose_name="Dataset", null=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Summarization Model Group')


class SModel(models.Model):
    name = models.CharField(max_length=100,
                            verbose_name="Model Name", unique=True, primary_key=True)
    title = models.TextField(verbose_name="Title")
    abstract = models.TextField(verbose_name="Abstract")
    human_evaluation = models.TextField(verbose_name="Human Evaluation")
    url = models.TextField(verbose_name="URL")
    raw = JSONField(blank=True, null=True,
                    verbose_name=_('Raw Data'))
    stats = JSONField(blank=True, null=True,
                      verbose_name=_('Statistics Data'))

    # group = models.ForeignKey(SModel_group, on_delete=models.CASCADE, verbose_name="Group", null=True)
    dataset = models.ManyToManyField(Dataset, through='ModelDataset')

    class Meta:
        verbose_name = _('Summerization Model')
        verbose_name_plural = _('Summerization Models')


class ModelDataset(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    smodel = models.ForeignKey(SModel, on_delete=models.CASCADE)
    stats = JSONField(blank=True, null=True,
                      verbose_name=_('Statistics Data'))
    histogram = JSONField(blank=True, null=True,
                          verbose_name=_('Statistics Data'))


class Article(models.Model):
    article_id = models.IntegerField()
    raw = JSONField(blank=True, null=True,
                    verbose_name=_('Article'))
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE,
                                verbose_name="Dataset", null=False)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    def brief_text(self):
        return self.raw['sentences'][0]['text']

    class Meta:
        unique_together = (('article_id', 'dataset_id'),)
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['article_id']


class Summary(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE,
                                verbose_name="Dataset", null=False)
    smodel = models.ForeignKey(SModel, on_delete=models.CASCADE)
    raw = JSONField(blank=True, null=True,
                    verbose_name=_('Summary'))
    bert = models.FloatField(default=0)
    rouge1 = models.FloatField(default=0)
    rouge2 = models.FloatField(default=0)
    rougeL = models.FloatField(default=0)
    novelty = models.FloatField(default=0)
    length = models.IntegerField(default=0)
    compression = models.FloatField(default=0)
    factual_consistency = models.FloatField(default=0)
    entity_factuality = models.FloatField(default=0)
    uni_gram_abs = models.FloatField(default=0)
    bi_gram_abs = models.FloatField(default=0)
    tri_gram_abs = models.FloatField(default=0)
    four_gram_abs = models.FloatField(default=0)

    def alignment(self):
        return self.raw["alignment"]

    class Meta:
        verbose_name = _('Summary')
        verbose_name_plural = _('Summaries')


class Evaluation_criteriums_group(models.Model):
    title = models.TextField()
    description = models.TextField()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Evaluation Criteriums Group')


class Evaluation_criteria(models.Model):
    title = models.TextField()
    description = models.TextField()
    group = models.ForeignKey(Evaluation_criteriums_group, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
        verbose_name = _('Evaluation Criteria')

# class Summary_Evaluation(models.Model):
