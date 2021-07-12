import click
import pathlib
import json
from glob import glob
from tqdm import tqdm
from rouge_score import rouge_scorer
from bert_score import BERTScorer

try:
    ROUGE_SCORER = rouge_scorer.RougeScorer(
        ["rouge1", "rouge2", "rougeL"], use_stemmer=True
    )
    BERT_SCORER = BERTScorer(nthreads=8, device='cuda:0', lang='en', rescale_with_baseline=False)
    NLP = spacy.load("en_core_web_lg")
except Exception as e:
    print(e)


def compute_rouge_score(text_a, text_b):
    scores = ROUGE_SCORER.score(text_a.lower(), text_b.lower())
    result_dict = {}
    for score_type, score_values in scores.items():
        p, r, f = score_values
        rounded_values  = {'precision':round(p,3), 'recall':round(r,3), 'fmeasure':round(f,3)}
        result_dict[score_type] = rounded_values
    return result_dict


def compute_bert_score(text_a, text_b):
    scores = BERT_SCORER.score([text_a], [text_b])
    p,r,f = scores
    return {'precision':round(p.item(),3), 'recall':round(r.item(),3), 'fmeasure':round(f.item(),3)}


@click.command()
@click.option('--input_dir', required=True, default=None, help="Path to nlp processed files")
@click.option('--output_dir', required=True, default='.', help="Path to store files with semantic similarities computed")

def compute_automatic_scores(input_dir, output_dir):
    input_files = glob(input_dir+"*.jsonl")
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    references_file = [a for a in input_files if "references.jsonl" in a][0]
    input_files.remove(references_file)
    references_file_lines = open(references_file, 'r', encoding='utf-8').readlines()
    reference_records = [json.loads(a.strip("\n")) for a in references_file_lines]
    # remaining files are models for which the automatic metrics must be computed
    for file in tqdm(input_files):
        model_name = file.split("/")[-1].replace(".jsonl","").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, 'r', encoding='utf-8').readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]
        with open(out_file_name, 'w', encoding='utf-8') as outf:
            for ref, model in tqdm(list(zip(reference_records, model_records))):
                reference_text = " ".join(r['text'] for r in ref['sentences'])
                summary_text = " ".join(s['text'] for s in model['sentences'])
                model['rouge_score'] = compute_rouge_score(summary_text, reference_text)
                model['bert_score'] = compute_bert_score(summary_text, reference_text)
                outf.write(json.dumps(model))
                outf.write("\n")
            print("Finished processing {}".format(model_name))

        


if __name__ == "__main__":
    compute_automatic_scores()
