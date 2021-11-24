import spacy
import pandas as pd
import json
import pathlib
import os
from tqdm import tqdm
import string
import itertools
from itertools  import chain
tqdm.pandas()
from glob import glob
import click
from openie import StanfordOpenIE
from utils  import text_length, clean_text, detokenize_relation, is_contained, clean_entity

try:
    SPACY_NLP = spacy.load("en_core_web_lg")
    RELATION_EXTRACTION_MODEL = StanfordOpenIE()
except Exception as e:
    print(e)


def process_containment(relation_dicts):
    filtered_relation_dicts = []
    matched_relation_texts = []
    for pair in itertools.permutations(relation_dicts, r=2):
        if is_contained(pair[0]["text"].split(), pair[1]["text"].split()):
            matched_relation_texts.append(pair[0]["text"])
            if pair[1] not in filtered_relation_dicts:
                filtered_relation_dicts.append(pair[1])
            if pair[0] in filtered_relation_dicts:
                filtered_relation_dicts.remove(pair[0])
        else:
            if (
                pair[0] not in filtered_relation_dicts
                and pair[0]["text"] not in matched_relation_texts
            ):
                filtered_relation_dicts.append(pair[0])
    return filtered_relation_dicts


def get_merged_relations(relation_dicts):
    """
    Returns merged relations from lexically overlapping relations grouped by the subject.
    """
    if len(relation_dicts):
        final_relations = []
        rels_groups = pd.DataFrame(relation_dicts).groupby("subject")
        for idx, group in rels_groups:
            subjs = group["subject"].tolist()
            rels = group["relation"].tolist()
            objs = group["object"].tolist()
            all_relation_dicts = [
                {"subject": s, "relation": r, "object": o, "text": " ".join([s, r, o])}
                for s, r, o in zip(subjs, rels, objs)
            ]
            sorted_relation_dicts = sorted(
                all_relation_dicts, key=lambda x: len(x["text"].split())
            )
            merged_relations_by_subject = process_containment(sorted_relation_dicts)
            if len(merged_relations_by_subject):
                final_relations.extend(merged_relations_by_subject)
            else:
                final_relations.extend(sorted_relation_dicts)
        return final_relations
    else:
        return None

def get_entity_counts(processed_record):
    all_entities = [s["entities"] for s in processed_record["sentences"] if len(s["entities"])]
    flat_list = list(chain.from_iterable(all_entities))
    entity_texts = [item[0] for item in flat_list]
    entity_types = [item[1] for item in flat_list]
    entity_counts = []
    for idx, (ent_text, ent_typ) in enumerate(zip(entity_texts, entity_types), start=1):
        entity_counts.append({"id":idx, "text":ent_text, "type":ent_typ, "frequency":entity_texts.count(ent_text)})
    return entity_counts

def process_documents(documents):
    """
    Given a list of documents, process and return a list of json records with the extracted features: sentences, sentence tokens, sentence length, named entities, SVO relations, and entity counts. Sentences in each document should be separated by [STOP SPACE] pattern.
    """
    processed_records = []
    for idx_a, item in enumerate(tqdm(documents), start=1):
        record = {}
        record["article_id"] = idx_a
        cleaned_text = clean_text(item)
        
        # split text into sentences using [STOP SPACE] pattern
        sentences = cleaned_text.split(". ") 
        processed_sents = []
        for idx_b, sent in enumerate(sentences, start=1):
            # check if a sentence has at least one word
            if text_length(sent) > 0:
                _sent = {}
                _sent["sent_id"] = idx_b
                doc = SPACY_NLP(sent)

                # basic
                tokens = [tok.text for tok in doc]
                pos_tags = [tok.pos_ for tok in doc]
                is_alpha = [tok.is_alpha for tok in doc]
                is_stop = [tok.is_stop for tok in doc]

                token_details = [] 
                for idx, (tok, pos, is_alp, is_st) in enumerate(zip(tokens, pos_tags, is_alpha, is_stop), start=1):
                    token_details.append({"id":idx, "token":tok, "pos_tag":pos, "is_alpha":is_alp, "is_stop":is_st, "is_punct":tok in string.punctuation})   
                
                # named entities
                entities = []
                for ent in doc.ents:
                    entry = (clean_entity(ent.text), ent.label_, ent.start_char, ent.end_char)
                    entities.append(entry)
                
                # relations
                relations = RELATION_EXTRACTION_MODEL.annotate(sent)
                merged_relations =  get_merged_relations(relations)

                # processed sentence record
                _sent["text"] = sent
                _sent["length"] = text_length(sent)
                _sent["tokens"] = tokens
                _sent["pos_tags"] = pos_tags
                _sent["is_alpha"] = is_alpha
                _sent["is_stop"] = is_stop
                _sent["entities"] = entities
                _sent["relations"] = merged_relations if merged_relations else []
                _sent["token_details"] = token_details
                processed_sents.append(_sent)

        record["sentences"] = processed_sents

        # entity frequencies
        record["entity_counts"] = get_entity_counts(record)
        processed_records.append(record)
    return processed_records


@click.command()
@click.option(
    "--input_dir",
    required=True,
    default=None,
    help="Path to directory containing line delimited text files",
)
@click.option(
    "--output_dir", required=True, default=".", help="Path to store the processed files"
)
def apply_nlp(input_dir, output_dir):
    input_files = glob(input_dir + "*.txt")
    print("Found {} files to be processed".format(len(input_files)))
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    for file in tqdm(input_files):
        model_name = file.split("/")[-1].replace(".txt", "").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        input_file_lines = open(file, "r", encoding="utf-8").readlines()
        processed_records = process_documents(input_file_lines)
        print(
            "Processed {} / {} items".format(
                len(input_file_lines), len(processed_records)
            )
        )
        with open(out_file_name, "w", encoding="utf-8") as outf:
            for rec in processed_records:
                outf.write(json.dumps(rec))
                outf.write("\n")
        print("Finished processing {}".format(model_name))


if __name__ == "__main__":
    apply_nlp()
