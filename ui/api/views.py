import json
from itertools import chain

from django.db.models import Max, Min
from django.http import JsonResponse
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from .serializers import *
from .models import *
from collections import Counter


def index(request):
    article = None
    try:
        article = Article.objects.get(pk=1)
    except ObjectDoesNotExist as e:
        print(e)
    context = {
        'article': article
    }
    return render(request, 'main.html', context)


def get_article(request, id):
    article = Article.objects.get(pk=id)
    context = {
        'article': article
    }
    return render(request, 'main.html', context)


def get_articleByID(request, id, ds_id):
    article = Article.objects.get(article_id=id, dataset=ds_id)
    ret = {}
    if article is not None:
        ret = article
    context = {
        'article': ret.raw
    }
    return JsonResponse({'article_id': ret.article_id, 'raw': ret.raw})


class ArticleListCreate(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


def getRandomArticle(request, *args, **kwargs):
    random_record = Article.objects.filter(dataset_id=kwargs['ds_id']).order_by('?').first()
    return JsonResponse({'article_id': random_record.article_id, 'raw': random_record.raw})


def getHalucinationsByArticleId(request, *args, **kwargs):
    summaries = Summary.objects.filter(article_id=kwargs['id'])
    halucinations = []
    summaries_list = []
    for summ in summaries:
        if len(summ.raw['novelWords']) > 0:
            halucinations.extend([w['token'] for w in summ.raw['novelWords']])
            summaries_list.append({'id': summ.id, 'smodel_id': summ.smodel_id, 'novelWords': summ.raw['novelWords']})
    unique_halucinations = Counter(halucinations)
    unique_halucinations = unique_halucinations.most_common()
    return JsonResponse({'unique_halucinations': unique_halucinations,
                         'summaries': summaries_list})


def getSummariesByArticleIDandGroupID(request, *args, **kwargs):
    article = kwargs['article']
    group = kwargs['group']
    summaries = Summary.objects.filter(article=article, smodel__group=group)
    summaries_list = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw, 'model_info': summ.smodel.raw}
        summaries_list.append(obj)
    return JsonResponse(summaries_list, safe=False)


def getSummariesByArticleIDandModelID(request, *args, **kwargs):
    article = kwargs['article']
    smodel = kwargs['smodel']
    summaries = Summary.objects.filter(article__article_id=article, smodel=smodel)
    summaries_list = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw, 'model_info': summ.smodel.raw}
        summaries_list.append(obj)
    return JsonResponse(summaries_list, safe=False)


def getSModelInfo_2(request, *args, **kwargs):
    name = kwargs['name']
    ds_id = kwargs['id']
    model = SModel.objects.get(name=name)
    summaries = Summary.objects.filter(smodel=name, dataset_id=int(ds_id))[:500]
    compression = []
    length = []
    novelity = []
    rouge1 = []
    rouge2 = []
    rougel = []
    entities = []
    relations = []
    uni_gram_abs = []
    bi_gram_abs = []
    tri_gram_abs = []
    four_gram_abs = []
    for summ in summaries:
        compression.append(summ.compression)
        length.append(summ.length)
        novelity.append(summ.novelty)
        rouge1.append(summ.rouge1)
        rouge2.append(summ.rouge2)
        rougel.append(summ.rougeL)
        if summ.uni_gram_abs > -1:
            uni_gram_abs.append(summ.uni_gram_abs)
        if summ.bi_gram_abs > -1:
            bi_gram_abs.append(summ.bi_gram_abs)
        if summ.tri_gram_abs > -1:
            tri_gram_abs.append(summ.tri_gram_abs)
        if summ.four_gram_abs > -1:
            four_gram_abs.append(summ.four_gram_abs)
        if summ.entity_factuality > -1:
            entities.append(summ.entity_factuality)
        if summ.factual_consistency > -1:
            relations.append(summ.factual_consistency)
    return JsonResponse(
        {"name": model.raw["name"], "raw": model.raw, "stats": model.stats, "rouge1": rouge1, "rouge2": rouge2,
         "rougel": rougel, "novelity": novelity, "compression": compression, "entities": entities,
         "relations": relations, 'uni_gram_abs': uni_gram_abs, 'bi_gram_abs': bi_gram_abs, 'tri_gram_abs': tri_gram_abs,
         'four_gram_abs': four_gram_abs, "length_": length}, safe=False)


def getSModelInfo(request, *args, **kwargs):
    name = kwargs['name']
    ds_id = kwargs['id']
    model = SModel.objects.get(name=name)
    mdl = model.modeldataset_set.get(dataset=ds_id)

    return JsonResponse({"name": model.raw["name"], "raw": model.raw, "stats": model.stats,
                         "histogram_data": mdl.histogram}, safe=False)


def articleModelGroup(request, *args, **kwarg):
    article_id = request.GET.get("id", -1)
    dataset_id = request.GET.get("ds_id", -1)
    selected_models = request.GET.get('models', "")
    art = Article.objects.filter(article_id=article_id, dataset=dataset_id)[0]
    summaries = Summary.objects.filter(article=art, smodel__in=selected_models.split(","))
    summaries_list = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw, 'model_info': summ.smodel.raw}
        summaries_list.append(obj)
    return JsonResponse(summaries_list, safe=False)

def getDatasetBoundaries(request, *args, **kwarg):
    dataset_id = kwarg['id']
    try:
        boundaries = Article.objects.filter(dataset__id=dataset_id).aggregate(Max('article_id'),Min('article_id'))
        return boundaries
    except Exception as e:
        return {'article_id__max': 0, 'article_id__min': 0}

def getDatasetModelsStat(request, *args, **kwarg):
    selected_models = []
    dataset_id = kwarg['id']
    # summarization_models = SModel.objects.filter(dataset__id=dataset_id)
    summarization_models = SModel.objects.filter(dataset__id=dataset_id, modeldataset__stats__isnull=False).order_by(
        'name')
    boundaries = {'article_id__max': 0, 'article_id__min': 0}
    try:
        boundaries = Article.objects.filter(dataset__id=dataset_id).aggregate(Max('article_id'), Min('article_id'))
    except Exception as e:
        pass

    metrics = ["compression", "length", "rouge1", "rouge2", "rougeL", "entities", "relations",
               "uni_gram_abs", "bi_gram_abs", "tri_gram_abs", "four_gram_abs"]
    for sm in summarization_models:
        # obj = {"model": sm.name, "name": sm.name}
        # selected_models.append(obj)

        if sm.modeldataset_set.count() > 0 and sm.name.upper() not in ["BETTER-REWARDS-BERT", "BETTER-REWARDS-ROUGE"]:
            obj = {"model": sm.name, "name": sm.name}
            stats = sm.modeldataset_set.get(dataset=dataset_id).stats  # json.loads()
            for metric in metrics:
                obj[metric] = "{:.2f}".format(stats[metric])
            selected_models.append(obj)
    return JsonResponse({"metrics": metrics, "models": selected_models, "boundaries": boundaries}, safe=False)


def getEntitiesByArticleID(request, *args, **kwargs):
    allowed_entities_types = ['PERSON', 'ORG', 'LOC', 'GPE']
    article_id = request.GET.get("id", -1)
    dataset_id = request.GET.get("ds_id", -1)
    selected_models = request.GET.get('models', "")

    if article_id == 0:
        article = Article.objects.filter(dataset_id=dataset_id).order_by('?').first()
    else:
        article = Article.objects.get(article_id=article_id, dataset_id=dataset_id)
    summaries = Summary.objects.filter(article_id=article.pk,
                                       smodel__in=selected_models.split(",")).order_by('smodel_id')
    entities = []
    smodels = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw,
               'model_info': summ.smodel.raw}
        smodels.append(obj)
        # Entities
        for ent in summ.raw['entities']:
            # if ent['type'] in allowed_entities_types:
            for i in range(ent['frequency']):
                entities.append((ent['text'].lower(), ent['type']))

    unique_entities = Counter(entities).most_common()
    # missing_entities = [([ent['text'], ent['type']], ent['frequency']) for ent in article.raw['entities']
    #                     if (ent['text'].lower(), ent['type']) not in entities and ent['type'] in allowed_entities_types]
    missing_entities = [ent['text'].lower() for ent in article.raw['entities']
                        if (ent['text'].lower(), ent['type']) not in entities and ent['type'] in allowed_entities_types]
    article_entities=[ ent['text'].lower() for ent in article.raw['entities']]
    return JsonResponse({'entities': unique_entities,
                         'smodels': smodels,
                         'article': article.raw,
                         'article_entities': article_entities,
                         'missing_entities': missing_entities})


def getArticleHMByArticleID(request, *args, **kwargs):
    article_id = request.GET.get("id", -1)
    dataset_id = request.GET.get("ds_id", -1)
    selected_models = request.GET.get('models', "")

    if article_id == 0:
        article = Article.objects.filter(dataset_id=dataset_id).order_by('?').first()
    else:
        article = Article.objects.get(article_id=article_id, dataset_id=dataset_id)
    summaries = Summary.objects.filter(article_id=article.pk,
                                       smodel__in=selected_models.split(",")).order_by('smodel_id')
    spacy_article_map = []
    bert_article_map = []
    lexical_article_map = []
    smodels = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw,
               'model_info': summ.smodel.raw}
        smodels.append(obj)

        # spacy_article_map.extend(list(set([candidate["article_sent_id"] for sentence in summ.raw['sentences']
        #                                    for candidate in sentence["semantic_similarity_candidates_spacy"][:2]])))

        bert_article_map.extend(list(set([candidate["article_sent_id"] for sentence in summ.raw['sentences']
                                          for candidate in sentence["semantic_similarity_candidates_bert_score"][:2]])))

        lexical_article_map.extend(list(set([candidate["article_sent_id"] for sentence in summ.raw['sentences']
                                             for candidate in
                                             sentence["lexical_alignment_candidates_mean_rouge"][:2]])))

    # spacy_article_map = Counter(spacy_article_map).most_common()
    # max_spacy = max([s[1] for s in spacy_article_map])
    # spacy_article_map = {a: round(b / len(summaries), 2) for a, b in spacy_article_map}

    bert_article_map = Counter(bert_article_map).most_common()
    max_bert = max([s[1] for s in bert_article_map])
    bert_article_map = {a: round(b / len(summaries), 2) for a, b in bert_article_map}

    lexical_article_map = Counter(lexical_article_map).most_common()
    max_lexical = max([s[1] for s in lexical_article_map])
    lexical_article_map = {a: round(b / len(summaries), 2) for a, b in lexical_article_map}
    # a: {"score":round(b / max_spacy, 2), "label": f"{b}/{len(summaries)}"}
    return JsonResponse({'spacy_article_map': spacy_article_map,
                         'bert_article_map': bert_article_map,
                         'lexical_article_map': lexical_article_map,
                         'smodels': smodels,
                         'article': article.raw})


def getHallucinationByArticleID(request, *args, **kwargs):
    article_id = request.GET.get("id", -1)
    dataset_id = request.GET.get("ds_id", -1)
    selected_models = request.GET.get('models', "")

    if article_id == 0:
        article = Article.objects.filter(dataset_id=dataset_id).order_by('?').first()
    else:
        article = Article.objects.get(article_id=article_id, dataset_id=dataset_id)

    summaries = Summary.objects.filter(article_id=article.pk,
                                       smodel__in=selected_models.split(",")).order_by('smodel_id')

    hallucinations = []
    summaries_list = []
    smodels = []
    for summ in summaries:
        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw,
               'model_info': summ.smodel.raw}
        smodels.append(obj)
        # Hallucinations
        if len(summ.raw['novelWords']) > 0:
            # if summ.smodel_id not in ["references", "reference"]:
            hallucinations.extend([w['token'] for w in summ.raw['novelWords']])
            summaries_list.append(
                {'id': summ.id, 'smodel_id': summ.smodel_id, 'novelWords': summ.raw['novelWords']})

    unique_hallucinations = Counter(hallucinations).most_common()
    return JsonResponse({'unique_hallucinations': unique_hallucinations,
                         'summaries': summaries_list,
                         'smodels': smodels,
                         'article': article.raw})


def get_relations(record):
    all_relations = [s['filtered_relations'] for s in record['sentences'] if len(s['filtered_relations'])]
    return list(chain.from_iterable(all_relations))


def get_compute_relation(sample_article_record, sample_summary_record):
    art_relations = get_relations(sample_article_record)
    summary_relations = get_relations(sample_summary_record)
    common_relations = []
    if len(summary_relations) and len(art_relations):
        art_relations_text = [r['text'].lower() for r in art_relations]
        summary_relations_text = [r['text'].lower() for r in summary_relations]
        common_relations = list(set(art_relations_text).intersection(set(summary_relations_text)))
    return common_relations


def getRelationByArticleID(request, *args, **kwargs):
    article_id = request.GET.get("id", -1)
    dataset_id = request.GET.get("ds_id", -1)
    selected_models = request.GET.get('models', "")
    if article_id == 0:
        article = Article.objects.filter(dataset_id=dataset_id).order_by('?').first()
    else:
        article = Article.objects.get(article_id=article_id, dataset_id=dataset_id)
    summaries = Summary.objects.filter(article_id=article.id,
                                       smodel__in=selected_models.split(",")).order_by('smodel_id')

    summaries_list = []
    smodels = []
    for summ in summaries:
        # Relations
        common_relations = get_compute_relation(article.raw, summ.raw)
        for sent in summ.raw['sentences']:
            for relation in sent['filtered_relations']:
                relation['sent_id'] = sent['sent_id']
                relation['context'] = sent['text']
                relation['aligned'] = False
                if relation['text'] in common_relations:
                    relation['aligned'] = True

        obj = {'article': summ.article_id, 'smodel': summ.smodel_id, 'raw': summ.raw,
               'model_info': summ.smodel.raw, 'common_relations': common_relations}
        smodels.append(obj)

    article_copy = article.raw
    relations_list = []
    for sent in article_copy['sentences']:
        for relation in sent['filtered_relations']:
            relation['context'] = sent['text']
            relations_list.append(relation)

    return JsonResponse({'summaries': summaries_list,
                         'smodels': smodels,
                         'relations_list': relations_list,
                         'article': article_copy})


def getAllModels(request):
    github_urls = {'banditsum': 'https://github.com/yuedongP/BanditSum', 'bart': 'https://github.com/pytorch/fairseq/tree/master/examples/bart', 'bert-lstm-pn-rl': 'https://github.com/fastnlp/fastNLP', 'bertsum-abs': 'https://github.com/nlpyang/PreSumm', 'bertsum-ext-abs': 'https://github.com/nlpyang/PreSumm', 'bert-tf-pn': 'https://github.com/fastnlp/fastNLP', 'bottom-up': 'https://github.com/sebastianGehrmann/bottom-up-summary', 'closed-book-cov': '', 'closed-book-non-cov': '', 'ctrl-dec-copy': 'https://github.com/LeenaShekhar/copy-controlled-decoding', 'get-to-point': 'https://github.com/abisee/pointer-generator', 'gpt2-rl': 'https://github.com/openai/lm-human-preferences', 'gpt2-rl-supervised': 'https://github.com/openai/lm-human-preferences', 'gpt2-zero-shot': 'https://github.com/openai/lm-human-preferences', 'improve-abs-baseline': '', 'improve-abs-novelty': '', 'improve-abs-novelty-lm': '', 'jointly-learning': 'https://github.com/magic282/NeuSum', 'lstm-pn-rl': 'https://github.com/fastnlp/fastNLP', 'mass': 'https://github.com/microsoft/MASS', 'matchsum-bert': 'https://github.com/maszhongming/MatchSum', 'matchsum-roberta': 'https://github.com/maszhongming/MatchSum', 'multi-reward-rl': '', 'multi-task-sum': '', 'pegasus': 'https://github.com/google-research/pegasus', 'ptgen': 'https://github.com/EdinburghNLP/XSum', 'reinforced': '', 'rnes-rouge': '', 'rnes-rouge-coh': '', 'seneca': '', 'seneca-coh-ref-app': '', 'seneca-sent-selection': '', 'sent-rewriting': 'https://github.com/ChenRocks/fast_abs_rl', 'strass': '', 'syn-compress': 'https://github.com/jiacheng-xu/neu-compression-sum', 't5-11B': 'https://github.com/google-research/text-to-text-transfer-transformer', 't5-3B': 'https://github.com/google-research/text-to-text-transfer-transformer', 't5-base': 'https://github.com/google-research/text-to-text-transfer-transformer', 't5-large': 'https://github.com/google-research/text-to-text-transfer-transformer', 't5-small': 'https://github.com/google-research/text-to-text-transfer-transformer', 'tf-pn': 'https://github.com/fastnlp/fastNLP', 'topic-convs2s': 'https://github.com/EdinburghNLP/XSum', 'transformer-abs': 'https://github.com/nlpyang/PreSumm', 'trans-seq2seq': '', 'unified-inc-loss': '', 'unified-lm': 'https://github.com/microsoft/unilm', 'unified-pgn': ''}
    models_list = ModelDataset.objects.all().order_by("smodel_id")
    models_arr = []
    for model in models_list:
        if model.smodel_id.upper() not in ["BETTER-REWARDS-BERT", "BETTER-REWARDS-ROUGE", "REFERENCES"]:
            raw = model.smodel.raw
            if raw["name"].upper() == "LEAD3":
                raw['human evaluation'] = "Acceptability"
                raw['url'] = "https://aclanthology.org/P98-2222/"
            raw['github'] = github_urls.get(raw["name"], '')
            models_arr.append({"name": model.smodel_id, "dataset_id":model.dataset_id, "title": raw['title'], "url": raw['url'],
                               "rouge1": model.stats["rouge1"], "rouge2": model.stats["rouge2"], "rougel": model.stats["rougeL"],
                               "abstract": raw['abstract'], "human_evaluation": raw['human evaluation'], 'github': raw['github']})
    return JsonResponse({'smodels': models_arr})


def getArticleMaps(request, smodel_id, ds_id):
    articles = Article.objects.filter(dataset_id=ds_id).order_by('?')[:50]
    articles_list = []
    max_length = 0
    for article in articles:
        summary = Summary.objects.get(article_id=article.pk, dataset_id=ds_id, smodel_id=smodel_id)
        lexical_article_map = [candidate["article_sent_id"] for sentence in summary.raw['sentences']
                               for candidate in sentence["lexical_alignment_candidates_mean_rouge"]]
        lexical_article_map = Counter(lexical_article_map).most_common()
        max_val = max([s[1] for s in lexical_article_map])
        lexical_article_map_normalized = {a: b / max_val for a, b in lexical_article_map}

        bert_article_map = [candidate["article_sent_id"] for sentence in summary.raw['sentences']
                            for candidate in sentence["semantic_similarity_candidates_bert_score"]]
        bert_article_map = Counter(bert_article_map).most_common()
        max_val = max([s[1] for s in bert_article_map])
        bert_article_map_normalized = {a: b / max_val for a, b in bert_article_map}

        # spacy_article_map = [candidate["article_sent_id"] for sentence in summary.raw['sentences']
        #                      for candidate in sentence["semantic_similarity_candidates_spacy"]]
        # spacy_article_map = Counter(spacy_article_map).most_common()
        # max_val = max([s[1] for s in spacy_article_map])
        # spacy_article_map_normalized = {a: b / max_val for a, b in spacy_article_map}

        sentences_list = []
        for sent in article.raw['sentences']:
            sentences_list.append({'len': len(sent['tokens']),
                                   'lexical': lexical_article_map_normalized.get(sent["sent_id"], 0),
                                   'bert': bert_article_map_normalized.get(sent["sent_id"], 0), # 'spacy': spacy_article_map_normalized.get(sent["sent_id"], 0)
                                   })
        sentence_length = sum([s['len'] for s in sentences_list])
        if sentence_length > max_length:
            max_length = sentence_length
        articles_list.append({'id': article.article_id, 'sentences': sentences_list})
    return JsonResponse({'articles': articles_list, 'max_length': max_length})


def getScoresByArticleID(request, *args, **kwargs):
    allowed_entities_types = ['PERSON', 'ORG', 'LOC', 'GPE']
    if kwargs['id'] == 0:
        article = Article.objects.filter(dataset_id=kwargs['ds_id']).order_by('?').first()
    else:
        article = Article.objects.get(article_id=kwargs['id'], dataset_id=kwargs['ds_id'])
    summaries = Summary.objects.filter(article_id=article.article_id).order_by('smodel_id')
    scores = []
    hallucinations = []
    summaries_list = []
    entities = []
    spacy_article_map = []
    bert_article_map = []
    lexical_article_map = []

    for summ in summaries:
        if 'bert_score' in summ.raw:
            bert = summ.raw['bert_score']['fmeasure']
            rouge1 = summ.raw['rouge_score']['rouge1']['fmeasure']
            rouge2 = summ.raw['rouge_score']['rouge2']['fmeasure']
            rougeL = summ.raw['rouge_score']['rougeL']['fmeasure']
            scores.append(
                {'smodel': summ.smodel_id, 'bert': bert, 'rouge1': rouge1, 'rouge2': rouge2, 'rougeL': rougeL})
        # Halucinations
        if len(summ.raw['novelWords']) > 0:
            #if summ.smodel_id not in ["references", "reference"]:
            hallucinations.extend([w['token'] for w in summ.raw['novelWords']])
            summaries_list.append(
                {'id': summ.id, 'smodel_id': summ.smodel_id, 'novelWords': summ.raw['novelWords']})
        # Entities
        for ent in summ.raw['entities']:
            if ent['type'] in allowed_entities_types:
                for i in range(ent['frequency']):
                    entities.append((ent['text'].lower(), ent['type']))

        spacy_article_map.extend(list(set([candidate["article_sent_id"] for sentence in summ.raw['sentences']
                                           for candidate in sentence["semantic_similarity_candidates_spacy"][:2]])))

        bert_article_map.extend([candidate["article_sent_id"] for sentence in summ.raw['sentences']
                                 for candidate in sentence["semantic_similarity_candidates_bert_score"]])

        lexical_article_map.extend([candidate["article_sent_id"] for sentence in summ.raw['sentences']
                                    for candidate in sentence["lexical_alignment_candidates_mean_rouge"]])

    unique_entities = Counter(entities).most_common()
    unique_hallucinations = Counter(hallucinations).most_common()
    spacy_article_map = Counter(spacy_article_map).most_common()
    max_spacy = max([s[1] for s in spacy_article_map])
    spacy_article_map = {a: b / max_spacy for a, b in spacy_article_map}
    missing_entities = [([ent['text'], ent['type']], ent['frequency']) for ent in article.raw['entities']
                        if (ent['text'].lower(), ent['type']) not in entities and ent['type'] in allowed_entities_types]
    return JsonResponse({'scores': scores,
                         'unique_hallucinations': unique_hallucinations,
                         'summaries': summaries_list,
                         'entities': unique_entities,
                         'spacy_article_map': spacy_article_map,
                         'article': article.raw,
                         'missing_entities': missing_entities})


class ArticleIDSListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleIDSSerializer


class SModelRetriveView(generics.RetrieveAPIView):
    queryset = SModel.objects.all()
    serializer_class = SModelSerializer


class SModelListView(generics.ListAPIView):
    queryset = SModel.objects.all()
    serializer_class = SModelSerializer


class DatasetModelsView(generics.ListAPIView):
    def get_queryset(self):
        dataset_id = self.kwargs['id']
        return SModel.objects.filter(dataset__id=dataset_id)

    serializer_class = SModelSerializer


class DatasetGroupsView(generics.ListAPIView):
    def get_queryset(self):
        dataset_id = self.kwargs['id']
        return SModel_group.objects.filter(dataset_id=dataset_id)

    serializer_class = SModelGroupSerializer


class SummaryListView(generics.ListAPIView):
    def get_queryset(self):
        article = self.kwargs['article']
        smodel = self.kwargs['smodel']
        return Summary.objects.filter(article=article, smodel=smodel)

    serializer_class = SummarySerializer


class AllSummaryListView(generics.ListAPIView):
    def get_queryset(self):
        smodel = self.kwargs['smodel']
        return Summary.objects.filter(smodel=smodel)

    serializer_class = SummaryAlignmentSerializer


class ArticleSummaries(generics.ListAPIView):
    def get_queryset(self):
        article = self.kwargs['article']
        group = self.kwargs['group']
        return Summary.objects.filter(article=article, smodel__group=group)

    serializer_class = SummarySerializer


class SModelsGroupListView(generics.RetrieveAPIView):
    queryset = SModel_group.objects.all()
    serializer_class = SModelGroupSerializer