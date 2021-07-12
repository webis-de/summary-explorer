import spacy
import pandas as pd
import json
import pathlib
import os
from tqdm import tqdm
tqdm.pandas()
from glob import glob
import click
from flair.data import Sentence
from flair.models import SequenceTagger
from openie import StanfordOpenIE

SPACY_NLP = spacy.load("en_core_web_lg")
CHUNKING_MODEL = SequenceTagger.load("chunk")
FRAME_DETECTION_MODEL = SequenceTagger.load("frame")
RELATION_EXTRACTION_MODEL = StanfordOpenIE()

def detokenize_text(text):
    return text.replace(" n't","n't").replace(" \'", "\'").replace(' \"', '\"').replace(" ,", ",").replace("` ","`").replace(" .",".").replace("( ", "(").replace(" )",")")

def clean_text(text):
    # remove  any model specific tokens such as <t> or <n>
    detokenized_text = detokenize_text(text)
    return detokenized_text.replace("<t>","").replace("</t>","").replace("-lrb-","(").replace("-rrb-",")").replace("<n>", " ").replace("-LRB-", "(").replace("-RRB-",")").strip()

def process_items(items):
    """Given a list of texts, process and return a list of json records with the extracted features. Sentences in each text should be separated by [STOP SPACE] pattern. 

    Parameters
    ----------
    items : list of strings
        Each item is a single text (article or summary) for which we extract: tokens, sentences, part of speech tags, named entities, noun chunks, semantic frames, and relations.
    """
    processed_records = []
    for idx_a, item in (enumerate(tqdm(items), start=1)):
        record = {}
        record['article_id'] = idx_a
        cleaned_text = clean_text(item)
        # split text into sentences using [STOP SPACE] pattern
        sentences = cleaned_text.split(". ")
        processed_sents = []
        for idx_b, sent in enumerate(sentences, start=1):
            if len(sent) > 0:
                _sent = {}
                _sent['sent_id'] = idx_b
                doc = SPACY_NLP(sent)
                # basic 
                tokens = [tok.text for tok in doc]
                pos_tags = [tok.pos_ for tok in doc]
                is_alpha = [tok.is_alpha for tok in doc]
                is_stop = [tok.is_stop for tok in doc]
                
                # named entities
                entities = []
                for ent in doc.ents:
                    entry = (ent.text, ent.label_, ent.start_char, ent.end_char)
                    entities.append(entry)
                
                # noun chunks
                _flair_sent = Sentence(sent)
                CHUNKING_MODEL.predict(_flair_sent)
                _chunks = []
                for chunk in _flair_sent.get_spans('np'):
                    _chunks.append([chunk.text, chunk.tag, chunk.start_pos, chunk.end_pos])
                
                # semantic frames
                FRAME_DETECTION_MODEL.predict(_flair_sent)
                _frames = []
                for frame in _flair_sent.get_spans('frame'):
                    if frame.tag!='_':
                        _frames.append([frame.text, frame.tag])
                
                # relations
                relations  = RELATION_EXTRACTION_MODEL.annotate(sent)

                # processed sentence record
                _sent['text'] = sent
                _sent['tokens'] = tokens
                _sent['pos_tags'] = pos_tags
                _sent['is_alpha'] = is_alpha 
                _sent['is_stop'] = is_stop
                _sent['entities'] = entities
                _sent['chunks'] = _chunks
                _sent['frames'] = _frames
                _sent['relations'] = relations
                processed_sents.append(_sent)
        record['sentences'] = processed_sents
        processed_records.append(record)
    return processed_records
        
        

@click.command()
@click.option('--input_dir', required=True, default=None, help="Path to directory containing line delimited text files")
@click.option('--output_dir', required=True, default='.', help="Path to store the processed files")

def apply_nlp(input_dir, output_dir):
    input_files = glob(input_dir+"*.txt")
    print("Found {} files to be processed".format(len(input_files)))
    pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)
    for file in tqdm(input_files):
        model_name = file.split("/")[-1].replace(".txt",'').strip()
        print("Processing {} \n".format(model_name))
        out_file_name = output_dir + model_name + ".jsonl"
        input_file_lines = open(file, 'r', encoding='utf-8').readlines()
        processed_records = process_items(input_file_lines)
        print("Processed {} / {} items".format(len(input_file_lines), len(processed_records)))
        with open(out_file_name, 'w', encoding='utf-8') as outf:
            for rec in processed_records:
                outf.write(json.dumps(rec))
                outf.write("\n")
        print("Finished processing {}".format(model_name))

if __name__ == "__main__":
    apply_nlp()
            


