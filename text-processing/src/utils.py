import re
from itertools import chain
from nltk.corpus import stopwords

STOP_WORDS = set(stopwords.words("english"))

def detokenize_text(text):
    return (
        text.replace(" n't", "n't")
        .replace(" '", "'")
        .replace(' "', '"')
        .replace(" ,", ",")
        .replace("` ", "`")
        .replace(" .", ".")
        .replace("( ", "(")
        .replace(" )", ")")
    )

def detokenize_relation(relation):
    return {k: detokenize_text(v) for k, v in relation.items()}

def clean_text(text):
    # remove  any model specific tokens such as <t> or <n>
    detokenized_text = detokenize_text(text)
    return (
        detokenized_text.replace("<t>", "")
        .replace("</t>", "")
        .replace("-lrb-", "(")
        .replace("-rrb-", ")")
        .replace("<n>", "")
        .replace("</n>","")
        .replace("-LRB-", "(")
        .replace("-RRB-", ")")
        .replace("<s>", "")
        .replace("</s>","")
        .strip()
    )

def get_words(text):
    return re.compile("\w+").findall(text)

def text_length(text):
    return len(get_words(text))

def is_contained(small_list, big_list):
    result = all(elem in big_list for elem in small_list)
    return result

def clean_entity(txt):
    return ''.join(ch for ch in txt if ch.isalnum() or ch==' ')

def get_document_entities(record):
    """
    Take a processed JSON record and return the unique named entities.
    """
    all_entities = [s["entities"] for s in record["sentences"] if len(s["entities"])]
    flat_list = list(chain.from_iterable(all_entities))
    entity_texts = [item[0] for item in flat_list]
    return list(set(entity_texts))

def get_document_relations(record):
    """
    Take a processed JSON record and return all the relations.
    """
    all_relations = [
        s["relations"]
        for s in record["sentences"]
        if len(s["relations"])
    ]
    return list(chain.from_iterable(all_relations))

def get_common_entities(a_record, b_record):
    """
    Take two processed JSON records and return the common named entities. This function also performs partial alignment for finding the common entities. 
    """
    a_record_entities = get_document_entities(a_record)
    b_record_entities = get_document_entities(b_record)
    
    # Lower case all entities
    a_entities = [e.lower() for e in a_record_entities]
    b_entities = [e.lower() for e in b_record_entities]

    common_entities = []
    complete_matches = list(set(a_entities).intersection(set(b_entities)))
    common_entities.append(complete_matches)

    # Remove matched summary entities
    unmatched_entities = list(
        filter(lambda e: e not in complete_matches, b_entities)
    )

    # Partial matches
    for b_entity in unmatched_entities:
        b_entity_tokens = (
            b_entity.split("-")
            if "-" in b_entity
            else b_entity.split()
        )
        # Remove stop words from tokens
        b_entity_tokens = [
            t for t in b_entity_tokens if t not in STOP_WORDS
        ]
        for a_entity in a_entities:
            a_entity_tokens = (
                a_entity.split("-")
                if "-" in a_entity
                else a_entity.split()
            )

            # Remove stop words
            a_entity_tokens = [
                t for t in a_entity_tokens if t not in STOP_WORDS
            ]

            if len(b_entity_tokens) == 1 and len(a_entity_tokens) > 1:
                if b_entity in a_entity_tokens:
                    common_entities.append([b_entity])

            if len(b_entity_tokens) > 1 and len(a_entity_tokens) > 1:
                if len(
                    set(b_entity_tokens).intersection(set(a_entity_tokens))
                ):
                    common_entities.append([b_entity])
    return list(chain.from_iterable(common_entities))

def compute_hallucinations(source, target):
    """
    Returns words in the target that are not from the source and their counts.
    """
    source_words = get_words(source.lower())
    target_words = get_words(target.lower())
    hallucinations = [w for w in target_words if w not in source_words]
    return [{"token":hallucination, "frequency":hallucinations.count(hallucination)} for hallucination in hallucinations]