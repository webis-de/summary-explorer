import click
import pathlib
import re
import json
from glob import glob
from tqdm import tqdm
from nltk import ngrams
from itertools import chain
from nltk.corpus import stopwords


STOP_WORDS = set(stopwords.words('english'))

def get_words(text):
    return re.compile('\w+').findall(text)

def compute_length(text):
    return len(get_words(text))

def get_entities(record):
    all_entities =  [s['entities'] for s in record['sentences'] if len(s['entities'])]
    flat_list = list(chain.from_iterable(all_entities))
    entity_texts = [item[0] for item in flat_list]
    return list(set(entity_texts))

def get_relations(record):
    all_relations = [s['filtered_relations'] for s in record['sentences'] if len(s['filtered_relations'])]
    return list(chain.from_iterable(all_relations))


def get_common_entities(art_ents, summ_ents):
    _art_ents = [e.lower() for e in art_ents]
    _summ_ents = [e.lower() for e in summ_ents]
    common_entities = []
    complete_matches = list(set(_art_ents).intersection(set(_summ_ents)))
    common_entities.append(complete_matches)
    # remove matched summary entities
    unmatched_summary_entities = list(filter(lambda e: e not in complete_matches, _summ_ents))

    # Partial matches
    for summary_entity in unmatched_summary_entities:
        summary_entity_tokens = summary_entity.split('-') if '-' in summary_entity else summary_entity.split()
        # remove stop words from tokens
        summary_entity_tokens = [t for t in summary_entity_tokens if t not in STOP_WORDS]
        for article_entity in _art_ents:
            article_entity_tokens = article_entity.split('-') if '-' in article_entity else article_entity.split()
            
            #remove stop words
            article_entity_tokens = [t for t in article_entity_tokens if t not in STOP_WORDS]
            
            if len(summary_entity_tokens) == 1 and len(article_entity_tokens) > 1:
                if summary_entity in article_entity_tokens:
                    common_entities.append([summary_entity])
                    
            if len(summary_entity_tokens) > 1 and len(article_entity_tokens) > 1:
                if len(set(summary_entity_tokens).intersection(set(article_entity_tokens))):
                    common_entities.append([summary_entity])
    return list(chain.from_iterable(common_entities))

# n-gram abstractiveness from unigram to four-gram
def get_ngram_abstractiveness(article_text, summary_text, n_gram_level=1):
    art_words = get_words(article_text)
    summary_words = get_words(summary_text)
    
    # compute common ngrams between article and summary
    common_ngrams = set(ngrams(art_words,n_gram_level)).intersection(set(ngrams(summary_words,n_gram_level)))    
    
    # find the summary words that are part of the common ngrams
    copied_summary_words_in_common_ngrams = []
    for word in summary_words:
        for c_ngram in common_ngrams:
            if word in c_ngram and word not in copied_summary_words_in_common_ngrams:
                copied_summary_words_in_common_ngrams.extend([word])
            
    # compute summary abstractiveness at the current n_gram_level
    ngram_abstractiveness = 1 - (len(copied_summary_words_in_common_ngrams)/ len(set(summary_words)))
    return round(ngram_abstractiveness * 100.0, 2)

def compute_ngram_abstractiveness(article_text, summary_text):
    # compute at four levels: unigram to 4-gram
    result = {}
    result['uni_gram_abs'] = get_ngram_abstractiveness(article_text, summary_text,1)
    result['bi_gram_abs'] = get_ngram_abstractiveness(article_text, summary_text,2)
    result['tri_gram_abs'] = get_ngram_abstractiveness(article_text, summary_text,3)
    result['four_gram_abs'] = get_ngram_abstractiveness(article_text, summary_text,4)
    return result

# Hallucinations: words in the summary not from the artice
def compute_hallucination(article_text, summary_text):
    article_words = get_words(article_text.lower())
    summary_words = get_words(summary_text.lower())
    hallucinations = [w for w in summary_words if w not in article_words]
    return hallucinations

# Compression Ratio: word ratio between the article and the summary
def compute_compression(article_text, summary_text):
    article_words = get_words(article_text)
    summary_words = get_words(summary_text)
    ratio = round(len(article_words) / len(summary_words), 2)
    return ratio

# Entity-level Factuality: precision percentage w.r.t article; ratio of number of common entities in the article and the summary, and the number of entities in the summary
# NOTE: this method takes the entire json record as input
def compute_entity_level_factuality(article_record, summary_record):
    art_ents = get_entities(article_record)
    summ_ents = get_entities(summary_record)
    common_entities = set(get_common_entities(art_ents, summ_ents))
    precision = round(len(common_entities)/len(summ_ents), 2)
    return precision * 100.0

# Relation-level factuality: precision percentage w.r.t article: ratio of number of common relations in the article and the summary, and the number of relations in the summary. 
# NOTE: If the summary has no relations (could not be identified by the information extraction module), this returns "None" and such records must thus be excluded when computing the average score.
def compute_relation_level_factuality(sample_article_record, sample_summary_record):
    art_relations = get_relations(sample_article_record)
    summary_relations = get_relations(sample_summary_record)
    if len(summary_relations) and len(art_relations):
        art_relations_text = [r['text'].lower() for r in art_relations]
        summary_relations_text = [r['text'].lower() for r in summary_relations]
        common_relations = list(set(art_relations_text).intersection(set(summary_relations_text)))
        novel_relations = list(set(summary_relations_text).difference(set(art_relations_text)))
        if len(novel_relations):
            print("Novel relations found {}".format(novel_relations))
        precision = round(len(common_relations) / len(summary_relations_text), 2)
        return precision * 100.0
    else:
        return None


@click.command()
@click.option('--input_dir', required=True, default=None, help="Path to files with automatic evaluation scores")
@click.option('--output_dir', required=True, default='.', help="Path to store files with other metrics")

def compute_other_metrics(input_dir, output_dir):
    

