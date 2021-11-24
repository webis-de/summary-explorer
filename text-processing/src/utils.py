import re



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
