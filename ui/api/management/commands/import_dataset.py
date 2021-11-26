# -*- coding: utf-8 -*-
import string
import sys
import re
import json
from argparse import FileType
from django.core.management.base import BaseCommand
from collections import defaultdict, Counter
# Call it like:
# python manage.py import_dataset -c config.json
from api.models import Dataset, Article, SModel, Summary, ModelDataset


class Command(BaseCommand):
    help = 'Import a new dataset'

    def add_arguments(self, parser):
        parser.add_argument(
            "-c",
            "--config",
            type=FileType("r"),
            help="Config file of the dataset",
        )

    def handle(self, *args, **options):
        try:
            configs = json.load(options['config'])
            # print(configs)
            # 1 - Create a new dataset record
            ds = Dataset(name=configs["dataset"]["name"], description=configs["dataset"]["description"])
            try:
                ds.save()
                self._success(f"Dataset record is created, dataset id is {ds.pk}")
            except Exception as e:
                self._error(f"Dataset record couldn't be created: {e}")
                exit(1)

            dataset_id = ds.pk
            # 2 - Import the preprocessed Articles
            self.import_articles(path_to_articles=configs["path_to_articles_file"],
                                 dataset_id= dataset_id)
            # 3 - Import Models Info:
            self.import_models(path_to_models=configs["path_to_models_details_file"],
                               dataset_id= dataset_id)
            # 4 - Import Summaries
            self.import_summaries(paths_to_summaries=configs["path_to_summaries_files"],
                               dataset_id= dataset_id)
        except Exception as e:
            self._error(f"Something went wrong: {e}")
            exit(1)

    # this function import the models information to the database
    # - Insert/ Update the models in the table 'api_smodel', Django Model: 'SModel'
    # - Insert the model Stats/Histogram bin in the table 'api_modeldataset', Django Model: 'ModelDataset'
    def import_models(self, path_to_models, dataset_id):
        try:
            with open(path_to_models, "r") as f:
                models = f.readlines()
        except Exception as e:
            self._error(f"Model details file couldn't be opened.\n{e}")
            exit(1)

        for model in models:
            model = json.loads(model)
            defaults = {'raw': model,
                        'name': model["name"],
                        'title': model["title"],
                        'abstract': model["abstract"],
                        'url': model["url"],
                        'human_evaluation': model["human evaluation"]}

            obj, created = SModel.objects.update_or_create(defaults=defaults, name=model["name"])
            if created:
                self._success(f"Model ({model['name']}) is imported")

            defaults = {'smodel_id': model["name"],
                        'dataset_id': dataset_id,
                        'stats': model["statistics"],
                        'histogram': model["histogram"]}

            obj, created = ModelDataset.objects.update_or_create(defaults=defaults,
                                                                 smodel_id=model["name"],
                                                                 dataset_id= dataset_id)
            if created:
                self._success(f"Model ({model['name']}) details are imported")

    def import_articles(self, path_to_articles, dataset_id):
        try:
            with open(path_to_articles, "r") as f:
                articles = f.readlines()
        except Exception as e:
            self._error(f"Articles File couldn't be opened.\n{e}")
            exit(1)

        created_articles = 0
        for ar in articles:
            try:
                ar = json.loads(ar)
                ar = self.update_structure(ar)
                defaults = {'raw': ar, 'article_id': int(ar["article_id"]), 'dataset_id': dataset_id}
                obj, created = Article.objects.update_or_create(defaults=defaults,
                                                                article_id=int(ar["article_id"]),
                                                                dataset_id=dataset_id)
                if created:
                    created_articles +=1
            except Exception as e:
                self._error(f"Article couldn't be inserted.\n{e}")
                exit(1)

        self._success(f"{created_articles} articles are copied to the database")

    # import Summaries
    # models_dict: a dictionary contains the model names and the path to their outputs
    # models_dict = {'reference': '../data/cnn/reference.jsonl', 't5-3B': '../data/cnn/t5-3B.jsonl',.....}

    def import_summaries(self, paths_to_summaries, dataset_id):
        for model_name, path in paths_to_summaries.items():
            self.log(f"Importing model ({model_name}) summaries:")
            with open(path, "r") as f:
                sum_list = f.readlines()

            # remove empty lines
            sum_list = [summary for summary in sum_list if summary.strip() != ""]
            saved_summaries_counter = 0
            unsaved_summaries_counter = 0

            for idx in range(len(sum_list)):
                # load the summary
                summ_json = json.loads(sum_list[idx])

                # update structure: assign ids to tokens
                summ_updated = self.update_structure(summ_json)

                # get the corresponding smodel object
                smodel = SModel.objects.get(name=model_name)

                # get the corresponding article object
                ar = Article.objects.get(article_id=summ_json["article_id"], dataset_id=dataset_id)

                summary_text = " ".join(s['text'] for s in summ_updated['sentences'])

                # get hallucinations
                temp = Counter(summ_updated["hallucinations"])
                summ_updated["novelWords"] = [{"freq":freq, "token":token} for token, freq in temp.items()]

                rouge1 = round(summ_updated['rouge_score']['rouge1']['fmeasure'] * 100.0, 2) if 'rouge_score'in summ_updated else 0
                rouge2 = round(summ_updated['rouge_score']['rouge2']['fmeasure'] * 100.0, 2) if 'rouge_score'in summ_updated else 0
                rougeL = round(summ_updated['rouge_score']['rougeL']['fmeasure'] * 100.0, 2) if 'rouge_score'in summ_updated else 0

                uni_gram_abs = summ_updated["ngram_abstractiveness"]["uni_gram_abs"]
                bi_gram_abs = summ_updated["ngram_abstractiveness"]["bi_gram_abs"]
                tri_gram_abs = summ_updated["ngram_abstractiveness"]["tri_gram_abs"]
                four_gram_abs = summ_updated["ngram_abstractiveness"]["four_gram_abs"]

                summ_length = self.compute_length(summary_text)

                novelty, compression, factual_consistency = 0, 0, 0
                if summ_length != 0:
                    compression = summ_updated['compression'] if "compression" in summ_updated else 0
                    factual_consistency = summ_updated["relation_level_factuality"] if "relation_level_factuality" in summ_updated else 0

                entity_factuality = summ_updated["entity_level_factuality"] if "entity_level_factuality" in summ_updated else 0
                entity_factuality = entity_factuality if entity_factuality is not None else 0
                defaults = {'raw': summ_updated,
                            'compression': compression,
                            'factual_consistency': factual_consistency if factual_consistency is not None else 0,
                            'entity_factuality': entity_factuality if entity_factuality is not None else 0,
                            'novelty': novelty,
                            'uni_gram_abs': uni_gram_abs,
                            'bi_gram_abs': bi_gram_abs,
                            'tri_gram_abs': tri_gram_abs,
                            'four_gram_abs': four_gram_abs,
                            'length': summ_length,
                            'rouge1': rouge1,
                            'rouge2': rouge2,
                            'rougeL': rougeL}
                # Save the summary to database
                try:
                    obj, created = Summary.objects.update_or_create(article=ar,
                                                                    smodel=smodel,
                                                                    dataset_id=dataset_id,
                                                                    defaults=defaults)
                    if created:
                        saved_summaries_counter += 1
                    else:
                        unsaved_summaries_counter += 1
                        self._error(f"The summary of article {summ_json['article_id']} couldn't be imported")
                except Exception as e:
                    self._error(f"The summary of article {summ_json['article_id']} couldn't be imported")
                    self._error(e)
                    print({'compression': compression,
                           'factual_consistency': factual_consistency,
                           'entity_factuality': entity_factuality,
                           'novelty': novelty,
                           'uni_gram_abs': uni_gram_abs,
                           'bi_gram_abs': bi_gram_abs,
                           'tri_gram_abs': tri_gram_abs,
                           'four_gram_abs': four_gram_abs,
                           'length': summ_length,
                           'rouge1': rouge1,
                           'rouge2': rouge2,
                           'rougeL': rougeL})

            self._success(f"{saved_summaries_counter} summaries are imported")
            if unsaved_summaries_counter > 0:
                self._success(f"{unsaved_summaries_counter} summaries couldn't be imported")

    def get_words(self, text):
        return re.compile('\w+').findall(text)

    def compute_length(self, text):
        return len(self.get_words(text))

    def CountFrequency(self, my_list):
        # Creating an empty dictionary
        freq = defaultdict(lambda: 0)
        for item in my_list:
            freq[item] += 1
        return freq.items()

    def clean_entity(self, txt):
        return ''.join(ch for ch in txt if ch.isalnum() or ch == ' ')

    def get_entities(self, json_obj):
        """ Takes as input a json object of the article or summary
        """
        entities = []
        for s in json_obj["sentences"]:
            for a in s['entities']:
                temp = self.clean_entity(a[0])
                entities.append((temp, a[1]))
                a.append(temp)
        unique_entities = self.CountFrequency(entities)
        return_val = []
        for idx, val in enumerate(unique_entities, start=1):
            return_val.append({'id': idx, 'text': val[0][0], 'type': val[0][1], 'frequency': val[1]})
        return return_val

    def update_structure(self, json_obj):
        """ Takes as input a json object of the article or summary
        - combine token information in one element and assign an id to each token
        - collect entities in one object
        """
        i = 1
        for s in json_obj["sentences"]:
            arr = []
            for a in zip(s["tokens"], s["pos_tags"], s["is_alpha"], s["is_stop"]):
                arr.append({"id": i, "token": a[0], "pos_tags": a[1],
                            "is_alpha": a[2], "is_stop": a[3],
                            "is_punct": a[0] in string.punctuation})
                i += 1
            s["tokens_det"] = arr

        # Extract Named Entities and assign id to each one of them
        json_obj["entities"] = self.get_entities(json_obj)
        return json_obj


    def _success(self, msg):
        self.stdout.write(self.style.SUCCESS(msg))

    def log(self, msg):
        self.stdout.write(msg)

    def _error(self, msg):
        self.stderr.write(self.style.ERROR(msg))