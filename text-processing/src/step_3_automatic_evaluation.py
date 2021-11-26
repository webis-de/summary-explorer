from os import path
import click
import pathlib
import json
from glob import glob
from tqdm import tqdm
from metrics import compute_rouge_score
from shutil import copy, copyfile



@click.command()
@click.option(
    "--input_dir", required=True, default=None, help="Path to nlp processed files"
)
@click.option(
    "--output_dir",
    required=True,
    default=".",
    help="Path to store files with semantic similarities computed",
)

def compute_automatic_scores(input_dir, output_dir):
    input_file_paths = [str(p) for p in pathlib.Path(input_dir).rglob("*.jsonl")]
    references_file_path = [a for a in input_file_paths if "references" in a][0]
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    references_file_lines = open(references_file_path, "r", encoding="utf-8").readlines()
    reference_records = [json.loads(a.strip("\n")) for a in references_file_lines]
    input_file_paths.remove(references_file_path)
    print("Found {} model files to be processed, excluding references".format(len(input_file_paths)))
    for file in tqdm(input_file_paths):
        model_name = file.split("/")[-1].replace(".jsonl", "").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, "r", encoding="utf-8").readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]
        with open(out_file_name, "w", encoding="utf-8") as outf:
            for ref, model in tqdm(list(zip(reference_records, model_records))):
                reference_text = " ".join(r["text"] for r in ref["sentences"])
                summary_text = " ".join(s["text"] for s in model["sentences"])
                model["rouge_score"] = compute_rouge_score(summary_text, reference_text)
                outf.write(json.dumps(model))
                outf.write("\n")
            print("Finished processing {}".format(model_name))
    destination = str(pathlib.Path(output_dir)) + "/references.jsonl"
    copyfile(pathlib.Path(references_file_path), pathlib.Path(destination))
    print("Copied the references file to the output directory.")

if __name__ == "__main__":
    compute_automatic_scores()
