import click
import spacy
from tqdm import tqdm
import json
import pathlib
from glob import glob
from bert_score import BERTScorer

try:
    NLP = spacy.load("en_core_web_lg")
    BERT_SCORER = BERTScorer(nthreads=8, batch_size=512, device='cuda:0', lang='en', rescale_with_baseline=True)
except Exception as e:
    print(e)

def spacy_similarity(text_a, text_b):
    nlp = NLP
    doc_a = nlp(text_a)
    doc_b = nlp(text_b)
    sim = doc_a.similarity(doc_b)
    return sim

def bert_score_similarity(summary_sents, article_sents):
    bert_sims = []
    all_preds = BERT_SCORER.score(summary_sents, article_sents)
    ps, rs, fs = all_preds
    for idx, f_score in enumerate(fs):
        bert_sims.append({'summary_sent':summary_sents[0], 'article_sent':article_sents[idx], 'article_sent_id':idx+1, 'similarity':f_score.item()})
    # sort and return the top 3 candidates according to the score (F1 score)
    bert_sims_sorted = sorted(bert_sims, key=lambda i:i['similarity'], reverse=True)
    return bert_sims_sorted[:3]
    

@click.command()
@click.option('--input_dir', required=True, default=None, help="Path to nlp processed files")
@click.option('--output_dir', required=True, default='.', help="Path to store files with semantic similarities computed")

def compute_similarity(input_dir, output_dir):
    input_files = glob(input_dir+"*.jsonl")
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    articles_file = [a for a in input_files if "articles.jsonl" in a][0]
    input_files.remove(articles_file)
    articles_file_lines = open(articles_file, 'r', encoding='utf-8').readlines()
    article_records = [json.loads(a.strip("\n")) for a in articles_file_lines]
    # remaining files are the models for which semantically aligned sentences from the articles must be found 
    for file in tqdm(input_files):
        model_name = file.split("/")[-1].replace(".jsonl","").strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        model_file_lines = open(file, 'r', encoding='utf-8').readlines()
        model_records = [json.loads(a.strip("\n")) for a in model_file_lines]
        with open(out_file_name, 'w', encoding='utf-8') as outf:
            for art, model in tqdm(list(zip(article_records, model_records))):
                article_sentences = art['sentences']
                summary_sentences  = model['sentences']
                for s_sent in summary_sentences:
                    # BertScore works faster when a summary sentence is broadcasted to be paired against each article sentence.
                    art_sents = [a['text'] for a in article_sentences]
                    s_sents = [s_sent['text']]*len(art_sents)
                    bert_score_candidates  = bert_score_similarity(s_sents, art_sents)
                    spacy_similarities =  []
                    s_sent_text = s_sent['text']
                    for a_sent in article_sentences:
                        a_sent_id = a_sent['sent_id']
                        a_sent_text = a_sent['text']
                        # Spacy similarity
                        spacy_sim = spacy_similarity(s_sent_text, a_sent_text)
                        spacy_similarities.append({'summary_sent':s_sent_text,'article_sent':a_sent_text, 'article_sent_id':a_sent_id, 'similarity':spacy_sim})
                    spacy_sorted_sims = sorted(spacy_similarities, key=lambda i:i['similarity'], reverse=True)
                    s_sent['semantic_similarity_candidates_spacy'] = spacy_sorted_sims[:3]
                    s_sent['semantic_similarity_candidates_bert_score'] = bert_score_candidates
                outf.write(json.dumps(model))
                outf.write("\n")
        print("Finished processing {}".format(model_name))

if __name__== "__main__":
    compute_similarity()

