import pandas as pd
import json
import itertools

from .models import Article, Summary


def get_representative_relations(document):
    """Returns a list of representative relations, i.e., relation with the longest object for a given combination of subject and relation. Stanford OpenIE gives many relations that are redundant where each object is a substring of the next object in the same relation for a given subject. Thus, to lower the redundancy, we identify only unique relations for a given subject where we take the longest object. 

    Args:
        document ([dict]): Processed document record (can be article or summary)
    """
    # Get all relations extracted using Stanford OpenIE
    doc_relations = document['relations']
    _doc_relations = []
    for rel in doc_relations:
        _record = {}
        _record['subject'] = rel['subject'].lower()
        _record['relation'] = rel['relation'].lower()
        _record['object'] = rel['object'].lower()
        _doc_relations.append(_record)
    # Sort all relations by subject
    sorted_relations = sorted(_doc_relations, key=lambda x: x['subject'])
    # Group sorted relations by subect, identify unique relations and for each unique relation pick that with the longest object
    representative_relations = []
    if sorted_relations:
        rels_df = pd.DataFrame(sorted_relations)
        rels_groups = rels_df.groupby('subject')
        for idx, group in rels_groups:
            relations = group['relation'].tolist()
            objects = group['object'].tolist()
            pairs = list(zip(relations, objects))
            # Get unique relations
            u_rel = list(set(relations))
            relation = {}
            subject = group['subject'].tolist()[0]
            if len(u_rel) > 1:
                for _rel in u_rel:
                    if _rel not in relation:
                        relation[_rel] = [""]
                        for r, o in pairs:
                            if _rel == r and len(relation[_rel][-1]) < len(o):
                                relation[_rel] = []
                                relation[_rel].append(o)
            else:
                relation[u_rel[0]] = objects[0]
            complete_rel = []
            for k, v in relation.items():
                if type(v) == list:
                    complete_rel.append((subject, k, v[0]))
                else:
                    complete_rel.append((subject, k, v))
            representative_relations.append(complete_rel)
            flat_list_of_representative_relations = list(
                itertools.chain.from_iterable(representative_relations))
        return flat_list_of_representative_relations
    else:
        return None


def get_summary_sentences_for_relations(relations, summary_record):
    """Returns list of summary sentences containing either the subjects or objects from the list of representative relations.

    Args:
        relations ([list]): List of representative relations
        summary_record ([json]): Processed summary record
    """
    subjects = [rel[0] for rel in relations]
    objects = [rel[2] for rel in relations]
    summary_sentences = [r['text'].lower()
                         for r in summary_record['sentences']]
    candidate_sentences = []
    for sent in summary_sentences:
        if any(subj in sent for subj in subjects) or any(obj in sent for obj in objects):
            candidate_sentences.append(sent)
    return list(set(candidate_sentences))
