from rest_framework import serializers
from .models import *


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        fields = self.context['request'].query_params.get('fields')
        if fields:
            fields = fields.split(',')
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('article_id', 'raw')


class ArticleIDSSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['article_id', 'brief_text']


class SModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SModel
        fields = ('name', 'title', 'raw')


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ('article', 'smodel', 'raw')


class SummaryAlignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ('smodel', 'alignment')


class SModelGroupSerializer(serializers.ModelSerializer):
    smodels = SModelSerializer(source="smodel_set", many=True)

    class Meta:
        model = SModel_group
        fields = ('id', 'name', 'description', 'smodels')
        depth = 2
