from rouge_score import rouge_scorer
from bert_score import BERTScorer
from statistics import mean
from nltk import ngrams
from utils import get_common_entities, get_document_entities, get_document_relations, get_words

try:
    ROUGE_SCORER = rouge_scorer.RougeScorer(
        ["rouge1", "rouge2", "rougeL"], use_stemmer=True
    )

    # BERT_SCORER = BERTScorer(
    #     nthreads=8, device="cuda:0", lang="en", rescale_with_baseline=False
    # )
except Exception as e:
    print(e)

def compute_mean_rouge_overlap(source, target):
    """
    Returns the mean of the ROUGE precision, recall, and F scores for a pair of texts. 
    """
    scores = ROUGE_SCORER.score(source.lower(), target.lower())
    average = mean([s.fmeasure for s in scores.values()])
    return average

def compute_rouge_score(source, target):
    scores = ROUGE_SCORER.score(source.lower(), target.lower())
    result_dict = {}
    for score_type, score_values in scores.items():
        p, r, f = score_values
        rounded_values = {
            "precision": round(p, 3),
            "recall": round(r, 3),
            "fmeasure": round(f, 3),
        }
        result_dict[score_type] = rounded_values
    return result_dict

def compute_bert_score(source, target):
    scores = BERT_SCORER.score([source], [target])
    p, r, f = scores
    return {
        "precision": round(p.item(), 3),
        "recall": round(r.item(), 3),
        "fmeasure": round(f.item(), 3),
    }


def get_ngram_abstractiveness(source, target, n_gram_level=1):
    """
    Computes n-gram abstractiveness of the target w.r.t the source on different n-gram sizes.
    """
    source_words = get_words(source)
    target_words = get_words(target)

    # compute common ngrams between source and target
    common_ngrams = set(ngrams(source_words, n_gram_level)).intersection(
        set(ngrams(target_words, n_gram_level))
    )

    # Find the target words that are part of the common ngrams.
    copied_target_words_in_common_ngrams = []
    for word in target_words:
        for c_ngram in common_ngrams:
            if word in c_ngram and word not in copied_target_words_in_common_ngrams:
                copied_target_words_in_common_ngrams.extend([word])

    # Compute target abstractiveness at the current n_gram_level
    ngram_abstractiveness = 1 - (
        len(copied_target_words_in_common_ngrams) / len(set(target_words))
    )
    return round(ngram_abstractiveness * 100.0, 2)


def compute_ngram_abstractiveness(source, target):
    """
    Computes n-gram abstractiveness of the target w.r.t the source on different n-gram sizes.
    """
    result = {}
    result["uni_gram_abs"] = get_ngram_abstractiveness(source, target, 1)
    result["bi_gram_abs"] = get_ngram_abstractiveness(source, target, 2)
    result["tri_gram_abs"] = get_ngram_abstractiveness(source, target, 3)
    result["four_gram_abs"] = get_ngram_abstractiveness(source, target, 4)
    return result


def compute_compression(source, target):
    """
    Returns the word ratio between the source and the target.
    """
    source_words = get_words(source)
    target_words = get_words(target)
    ratio = round(len(source_words) / len(target_words), 2)
    return ratio

def compute_entity_level_factuality(source_record, target_record):
    """
    Returns the ratio of common entities between the source and the target to the number of target entities. Both source and target are processed JSON records containing the identified named entities. If the target text has no entities (could not be identified by the NER tool), this returns "None" and such records must thus be excluded when computing the average score.
    """
    src_ents = get_document_entities(source_record)
    tgt_ents = get_document_entities(target_record)
    if len(src_ents) > 0 and len(tgt_ents) > 0:
        common_entities = set(get_common_entities(source_record, target_record))
        precision = round(len(common_entities) / len(tgt_ents), 2)
        return precision * 100.0
    else:
        return None


def compute_relation_level_factuality(source_record, target_record):
    """
    Returns the ratio of common relations between the source and the target to the number of target relations. Both source and target are processed JSON records containing the identified relations. If the target text has no relations (could not be identified by the information extraction module), this returns "None" and such records must thus be excluded when computing the average score.
    """
    src_relations = get_document_relations(source_record)
    tgt_relations = get_document_relations(target_record)
    if len(src_relations) > 0 and len(tgt_relations) > 0:
        src_relations_text = [r["text"].lower() for r in src_relations]
        tgt_relations_text = [r["text"].lower() for r in tgt_relations]
        common_relations = list(
            set(src_relations_text).intersection(set(tgt_relations_text))
        )
        precision = round(len(common_relations) / len(tgt_relations_text), 2)
        return precision * 100.0
    else:
        return None