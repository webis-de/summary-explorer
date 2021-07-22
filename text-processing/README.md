**Step 1:** 
Apply basic NLP: de-tokenization, unifying the sentence segmentation tokens, sentence splitting, named entity recognition, and relation extraction.

`python step_1_nlp_pipeline.py --input_dir ../data/ --output_dir ../data/nlp-processed/`

**Step 2:**
Merge redundant relations based on containment.

`python step_2_filter_relations.py --input_dir ../data/nlp-processed/ --output_dir ../data/relations-filtered/`

**Step 3:**
Compute semantic alignment of each summary sentence with the document sentences.

`python step_3_semantic_alignment.py --input_dir ../data/relations-filtered/ --output_dir ../data/semantic-similarities/`

**Step 4:**
Compute lexical alignment of each summary sentence with the document sentences.

`python step_4_lexical_alignment.py --articles_file ../data/relations-filtered/articles.jsonl --input_dir ../data/semantic-similarities/ --output_dir ../data/lexical-alignments/`

**Step 5:**
Compute ROUGE and BERTScore for model summaries.

`python step_5_automatic_evaluation.py --input_dir ../data/lexical-alignments/ --output_dir ../data/automatic-metrics/`

`cp ../data/lexical-alignments/references.jsonl ../data/automatic-metrics/.`


**Step 6:**
Compute document overlap metrics: summary compression, hallucinations, entity level factuality, and relation level factuality.

`python step_6_document_overlap_metrics.py --articles_file ../data/relations-filtered/articles.jsonl --input_dir ../data/automatic-metrics/ --output_dir ../data/document-overlap-metrics/`