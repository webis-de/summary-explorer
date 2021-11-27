import math
import re
import statistics
import numpy as np
import json


def preCompureHistograms(scores, bin_width=10):
    max_score = max(scores)
    if max_score <= 60:
        max_score = 60
        bin_width = 3
    elif max_score <= 100:
        max_score = 100
        bin_width = 5
    else:
        bin_width = 10  # math.floor(max_score/40)
        max_score += 2 * bin_width
    num_of_bins = math.ceil(max_score / bin_width)
    bins_list = [i * bin_width for i in range(0, num_of_bins + 1)]

    bins = []
    #     ax = plt.hist(scores, bins = bins_list)
    #     for a, b in zip(bins_list, ax[2].datavalues):
    ax = np.histogram(scores, bins=bins_list)
    for a, b in zip(bins_list[:-1], ax[0]):
        bins.append({"x0": a, "x1": a + bin_width, "length_": int(b)})

    ticks = [i for i in range(0, int(max_score), 2)]
    den = kernelDensityEstimator(ticks, scores)
    return {"bins": bins, "density": den, "max_score": max_score}


def kernelDensityEstimator(X, V):
    vals = []
    for x in X:
        y = statistics.mean([kernelEpanechnikov(x - v) for v in V])
        vals.append([x, y])
    return vals


def kernelEpanechnikov(v):
    k = 7
    v = v / k
    if abs(v) <= 1:
        return 0.75 * (1 - v * v) / k
    else:
        return 0

    model_file_lines = open(path, "r", encoding="utf-8").readlines()
    model_records = [json.loads(a.strip("\n")) for a in model_file_lines]

def compute_length(text):
    return len(get_words(text))


def get_words(text):
    return re.compile('\w+').findall(text)

def getModelHistogramData(path):
    model_file_lines = open(path, "r", encoding="utf-8").readlines()
    summaries = [json.loads(a.strip("\n")) for a in model_file_lines]
    compression = []
    length = []
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
        summary_text = " ".join(s['text'] for s in summ['sentences'])
        summ_length = compute_length(summary_text)

        compression.append(summ['compression'])

        length.append(summ_length)

        if "rouge_score" in summ and "rouge1" in summ["rouge_score"]:
            rouge1.append(summ["rouge_score"]["rouge1"]["fmeasure"])
        else:
            rouge1.append(0)

        if "rouge_score" in summ and "rouge2" in summ["rouge_score"]:
            rouge2.append(summ["rouge_score"]["rouge2"]["fmeasure"])
        else:
            rouge2.append(0)

        if "rouge_score" in summ and "rougeL" in summ["rouge_score"]:
            rougel.append(summ["rouge_score"]["rougeL"]["fmeasure"])
        else:
            rougel.append(0)

        if summ["ngram_abstractiveness"]["uni_gram_abs"] > -1:
            uni_gram_abs.append(summ["ngram_abstractiveness"]["uni_gram_abs"])
        if summ["ngram_abstractiveness"]["bi_gram_abs"] > -1:
            bi_gram_abs.append(summ["ngram_abstractiveness"]["bi_gram_abs"])
        if summ["ngram_abstractiveness"]["tri_gram_abs"] > -1:
            tri_gram_abs.append(summ["ngram_abstractiveness"]["tri_gram_abs"])
        if summ["ngram_abstractiveness"]["four_gram_abs"] > -1:
            four_gram_abs.append(summ["ngram_abstractiveness"]["four_gram_abs"])

        if summ["entity_level_factuality"] is not None and summ["entity_level_factuality"] > -1:
            entities.append(summ["entity_level_factuality"])

        if summ["relation_level_factuality"] is not None and summ["relation_level_factuality"] > -1:
            relations.append(summ["relation_level_factuality"])

    histo = {"uni_gram_abs": preCompureHistograms(uni_gram_abs, 5),
             "bi_gram_abs": preCompureHistograms(bi_gram_abs, 5),
             "tri_gram_abs": preCompureHistograms(tri_gram_abs, 5),
             "four_gram_abs": preCompureHistograms(four_gram_abs, 5),
             "rougel": preCompureHistograms(rougel, 5) if len(rougel) > 0 else [],
             "rouge2": preCompureHistograms(rouge2, 5) if len(rouge2) > 0 else [],
             "rouge1": preCompureHistograms(rouge1, 5) if len(rouge1) > 0 else [],
             "entities": preCompureHistograms(entities, 5),
             "relations": preCompureHistograms(relations, 5),
             "length_": preCompureHistograms(length, 10),
             "compression": preCompureHistograms(compression, 10)
             }
    stats = {"length": round(sum(length) / len(length), 2),
             "rouge1": round(sum(rouge1) / len(rouge1), 2) if len(rouge1) > 0 else 0,
             "rouge2": round(sum(rouge2) / len(rouge2), 2) if len(rouge2) > 0 else 0,
             "rougeL": round(sum(rougel) / len(rougel), 2) if len(rougel) > 0 else 0,
             "entities": round(sum(entities) / len(entities), 2),
             "relations": round(sum(relations) / len(relations), 2),
             "compression": round(sum(compression) / len(compression), 2),
             "uni_gram_abs": round(sum(uni_gram_abs) / len(uni_gram_abs), 2),
             "bi_gram_abs": round(sum(bi_gram_abs) / len(bi_gram_abs), 2),
             "tri_gram_abs": round(sum(tri_gram_abs) / len(tri_gram_abs), 2),
             "four_gram_abs": round(sum(four_gram_abs) / len(four_gram_abs), 2)
             }
    return histo, stats