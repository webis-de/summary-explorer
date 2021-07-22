import click
import json
import itertools
import pathlib
import pandas as pd
from tqdm import tqdm
from glob import glob


def detokenize_text(text):
    return (
        text.replace(" n't", "n't")
        .replace(" '", "'")
        .replace(' "', '"')
        .replace(" ,", ",")
        .replace("` ", "`")
        .replace(" .", ".")
    )


def detokenize_relation(relation):
    return {k: detokenize_text(v) for k, v in relation.items()}


def is_contained(small_list, big_list):
    result = all(elem in big_list for elem in small_list)
    return result


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


def get_representative_relations(relation_dicts):
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
        representative_relations_by_subject = process_containment(sorted_relation_dicts)
        if len(representative_relations_by_subject):
            final_relations.extend(representative_relations_by_subject)
        else:
            final_relations.extend(sorted_relation_dicts)
    return final_relations


@click.command()
@click.option(
    "--input_dir", required=True, default=None, help="Path to nlp processed files"
)
@click.option(
    "--output_dir",
    required=True,
    default=".",
    help="Path to store files with filtered relations",
)
def filter_relations(input_dir, output_dir):
    input_files = glob(input_dir + "*.jsonl")
    print("Found {} files to be processed".format(len(input_files)))
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    for file in tqdm(input_files):
        model_name = file.split("/")[-1].replace(".jsonl", "").strip()
        print("Processing {} \n ".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, "r", encoding="utf-8").readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]

        with open(out_file_name, "w", encoding="utf-8") as outf:
            for model_rec in tqdm(model_records):
                sent_recs = model_rec["sentences"]
                for s_rec in sent_recs:
                    if len(s_rec["relations"]):
                        sentence_relations = [
                            detokenize_relation(r) for r in s_rec["relations"]
                        ]
                        sentence_relations_filtered = get_representative_relations(
                            sentence_relations
                        )
                        s_rec["filtered_relations"] = sentence_relations_filtered
                    else:
                        s_rec["filtered_relations"] = []
                outf.write(json.dumps(model_rec))
                outf.write("\n")
        print("Finished processing {}".format(model_name))


if __name__ == "__main__":
    filter_relations()
