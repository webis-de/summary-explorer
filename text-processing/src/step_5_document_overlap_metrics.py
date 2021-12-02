import click
import json
from tqdm import tqdm
import pathlib
from utils import compute_hallucinations
from metrics import compute_compression, compute_entity_level_factuality, compute_relation_level_factuality, compute_ngram_abstractiveness



@click.command()
@click.option(
    "--input_dir",
    required=True,
    default=None,
    help="Path to files with automatic metrics",
)
@click.option(
    "--output_dir",
    required=True,
    default=".",
    help="Path to store files with other metrics",
)

def compute_document_overlap_metrics(input_dir, output_dir):
    input_file_paths = [str(p) for p in pathlib.Path(input_dir).rglob("*.jsonl")]
    article_file_path = str(pathlib.Path(input_dir).parent) + "/nlp-processed/articles.jsonl"
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    article_file_lines = open(article_file_path, "r", encoding="utf-8").readlines()
    article_records = [json.loads(a.strip("\n")) for a in article_file_lines]
    print("Read {} article records.".format(len(article_file_lines)))
    print("Found {} model files to be processed, including references".format(len(input_file_paths)))

    for file in tqdm(input_file_paths):
        model_name = file.split("/")[-1].replace(".jsonl", "").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, "r", encoding="utf-8").readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]
        with open(out_file_name, "w", encoding="utf-8") as outf:
            for art, model in tqdm(list(zip(article_records, model_records))):
                article_text = " ".join(sent["text"] for sent in art["sentences"])
                summary_text = " ".join(sent["text"] for sent in model["sentences"])
                model["compression"] = compute_compression(article_text, summary_text)
                model["hallucinations"] = compute_hallucinations(
                    article_text, summary_text
                )
                model["ngram_abstractiveness"] = compute_ngram_abstractiveness(
                    article_text, summary_text
                )

                # the factuality level metrics take the entire json object as inputs
                model["entity_level_factuality"] = compute_entity_level_factuality(
                    art, model
                )
                model["relation_level_factuality"] = compute_relation_level_factuality(
                    art, model
                )
                outf.write(json.dumps(model))
                outf.write("\n")
            print("Finished processing {}".format(model_name))


if __name__ == "__main__":
    compute_document_overlap_metrics()
