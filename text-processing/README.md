`python step_1_nlp_pipeline.py --input_dir ../data/ --output_dir ../data/nlp-processed/`

`python step_2_filter_relations.py --input_dir ../data/nlp-processed/ --output_dir ../data/relations-filtered/`

`python step_3_semantic_similarity.py --input_dir ../data/relations-filtered/ --output_dir ../data/semantic-similarities/`

`python step_4_lexical_alignment.py --articles_file ../data/relations-filtered/articles.jsonl --input_dir ../data/semantic-similarities/ --output_dir ../data/lexical-alignments/`

`python step_5_automatic_evaluation.py --input_dir ../data/lexical-alignments/ --output_dir ../data/automatic-metrics/`


