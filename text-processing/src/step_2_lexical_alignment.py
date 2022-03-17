import json
import click
from metrics import compute_mean_rouge_overlap
from tqdm import tqdm
import pathlib
from shutil import copy, copyfile


def get_remaining_content(candidate, matched):
    candidate_words = candidate.split()
    matched_words = matched.lower().split()
    remaining = [c for c in candidate_words if c.lower() not in set(matched_words)]
    return " ".join(remaining)


@click.command()
@click.option(
    "--input_dir",
    required=True,
    default=None,
    help="Path to model files with semantic similarities computed",
)
@click.option(
    "--output_dir",
    required=True,
    default=".",
    help="Path to store files with lexical alignments computed",
)

def compute_lexical_alignment(input_dir, output_dir):
    input_file_paths = [str(p) for p in pathlib.Path(input_dir).rglob("*.jsonl")]
    article_file_path = [p for p in input_file_paths if "articles" in p][0]
    input_file_paths.remove(article_file_path)
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    article_file_lines = open(article_file_path, "r", encoding="utf-8").readlines()
    article_records = [json.loads(a.strip("\n")) for a in article_file_lines]
    print("Read {} article records.".format(len(article_file_lines)))
    print("Found {} model files to be processed, including references.".format(len(input_file_paths)))
    
    for file in tqdm(input_file_paths):
        model_name = file.split("/")[-1].replace(".jsonl", "").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, "r", encoding="utf-8").readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]
        with open(out_file_name, "w", encoding="utf-8") as outf:
            for art, model in tqdm(list(zip(article_records, model_records))):
                article_sentences = art["sentences"]
                summary_sentences = model["sentences"]
                for s_sent in summary_sentences:
                    lexical_alignments = []

                    # save temp scores for primary and secondary matches
                    rouge_overlap_primary_records = []
                    rouge_overlap_secondary_records = []
                    s_text = s_sent["text"]
                    for art_sent in article_sentences:
                        art_text = art_sent["text"]
                        art_sent_id = art_sent["sent_id"]
                        mean_rouge_overlap = compute_mean_rouge_overlap(
                            art_text, s_text
                        )
                        rouge_overlap_primary_records.append(
                            {
                                "summary_sent": s_text,
                                "article_sent": art_text,
                                "article_sent_id": art_sent_id,
                                "mean_rouge_overlap": mean_rouge_overlap,
                            }
                        )

                    # sort rouge_overlap_records, select the top record as primary match
                    rouge_primary_sorted = sorted(
                        rouge_overlap_primary_records,
                        key=lambda i: i["mean_rouge_overlap"],
                        reverse=True,
                    )
                    primary_match = rouge_primary_sorted[0]

                    # remove overlapping words with primary match and rerun to find the secondary match
                    primary_match_text = primary_match["article_sent"]
                    lexical_alignments.append(primary_match)
                    s_text_remaining = get_remaining_content(s_text, primary_match_text)

                    # if the summary sentence still has some content to be matched, rerun the process
                    if len(s_text_remaining.split()):
                        for art_sent in article_sentences:
                            art_text = art_sent["text"]
                            art_sent_id = art_sent["sent_id"]
                            mean_rouge_overlap = compute_mean_rouge_overlap(
                                art_text, s_text_remaining
                            )
                            rouge_overlap_secondary_records.append(
                                {
                                    "summary_sent": s_text,
                                    "article_sent": art_text,
                                    "article_sent_id": art_sent_id,
                                    "mean_rouge_overlap": mean_rouge_overlap,
                                }
                            )
                        rouge_secondary_sorted = sorted(
                            rouge_overlap_secondary_records,
                            key=lambda i: i["mean_rouge_overlap"],
                            reverse=True,
                        )
                        secondary_match = rouge_secondary_sorted[0]
                        secondary_match_text = secondary_match["article_sent"]
                        if primary_match_text != secondary_match_text:
                            lexical_alignments.append(secondary_match)
                    s_sent[
                        "lexical_alignment_candidates_mean_rouge"
                    ] = lexical_alignments
                outf.write(json.dumps(model))
                outf.write("\n")
        print("Finished processing {}".format(model_name))
    
    # Copy article files to the destination folder for the next step.
    destination = str(pathlib.Path(output_dir)) + "/articles.jsonl"
    copyfile(pathlib.Path(article_file_path), pathlib.Path(destination))
    print("Copied the articles file to the output directory.")


if __name__ == "__main__":
    compute_lexical_alignment()
