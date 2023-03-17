import Q1 from "../../assets/images/gifs/q1.gif";
import Q2 from "../../assets/images/gifs/q2.gif";
import Q3 from "../../assets/images/gifs/q3.gif";
import Q4 from "../../assets/images/gifs/q4.gif";
import Q5 from "../../assets/images/gifs/q5.gif";
import Q6 from "../../assets/images/gifs/q6.gif";

export default [
  {
    id: 1,
    heading: "Content Coverage",
    question: "What parts of a document are captured by a summary?",
    desc: "This view shows the content coverage of the summary. We highlight in the summary the common information from the document. This helps to judge if the summary covers key information from the document.",
    metrics_subset: ["length", "rouge1", "rouge2", "rougeL"],
    badge: "Document vs. Summary/Summaries",
    badge_style: " text-yellow-800 bg-yellow-100",
    image_path: Q1,
  },
  {
    id: 3,
    heading: "Entity Coverage (Faithfulness)",
    question: "Which entities from a document are captured by a summary?",
    desc: "This view shows the entity coverage of the summary. We highlight in the summary the common entities from the document. This helps to judge if the summary covers the key entities from the document. Please note that this may not be perfect because of mismatches due to having only partial entity representations in either the document or the summary. For example, if the document contains Barack Obama, the summary may contain only obama which is not counted as an exact match.",
    metrics_subset: ["entities"],
    badge: "Document vs. Summary/Summaries",
    badge_style: " text-yellow-800 bg-yellow-100",
    image_path: Q3,
  },
  {
    id: 4,
    heading: "Relation Coverage (Faithfulness)",
    question: "Which relations from a document are captured by a summary?",
    desc: "This view shows the relation coverage of the summary. We present on the left all the relations from the document, and on the right all relations from the summary. We highlight the common relations (exact subject-verb-object) in the summary. This helps to judge if the summary is faithful to the document by preserving the relations from the document.",
    metrics_subset: ["length", "rouge1", "rouge2", "rougeL"],
    badge: "Document vs. Summary/Summaries",
    badge_style: " text-yellow-800 bg-yellow-100",
    image_path: Q4,
  },
  {
    id: 2,
    heading: "Hallucinations (Faithfulness)",
    question: "What are the hallucinations in a summary?",
    desc: "This view shows the hallucinations in the summary. We highlight in the summary the information not found in the document. This helps to judge if the novel words produced in the summary are a result of modifying existing information from the document (intrinsic hallucinations), or adding completely new information (extrinsic hallucinations).",
    metrics_subset: [
      "compression",
      "uni_gram_abs",
      "bi_gram_abs",
      "tri_gram_abs",
      "four_gram_abs",
    ],
    badge: "Document vs. Summary/Summaries",
    badge_style: " text-yellow-800 bg-yellow-100",
    image_path: Q2,
  },
  {
    id: 5,
    heading: "Position Bias Across Models",
    question: "Which parts of a document do all summaries come from?",
    desc: "This view shows the content agreement among multiple summaries. We project all the chosen summaries onto the document using different color gradients. The darker parts indicate that more summaries capture this part of the document giving a pseudo indication of its importance as perceived by the models.",
    metrics_subset: [
      "compression",
      "length",
      "rouge1",
      "rouge2",
      "rougeL",
      "entities",
      "relations",
    ],
    badge: "Document vs. Summaries",
    badge_style: " text-red-800 bg-red-100",
    image_path: Q5,
  },
  {
    id: 6,
    heading: "Position Bias Across Documents and Models",
    question: "Which parts of all documents do all summaries come from?",
    desc: "This view shows the position bias of a summarization model. For 100 randomly sampled documents, we project the summaries from the corresponding model. This helps to judge if the model is focusing on a specific location in the document to compose a summary.",
    metrics_subset: [
      "compression",
      "uni_gram_abs",
      "bi_gram_abs",
      "tri_gram_abs",
      "four_gram_abs",
    ],
    badge: "Corpus vs. Model",
    badge_style: " text-purple-800 bg-purple-100",
    image_path: Q6,
  },
];
