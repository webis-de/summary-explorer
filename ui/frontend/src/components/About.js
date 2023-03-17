import React from "react";

import { renderListWithSeparator } from "../util";

const TEST_SETS = [
  [
    "CNN/Daily Mail",
    "https://files.webis.de/summary-explorer/test-set/cnn-dm/cnn_dm_articles.txt",
  ],
  [
    "XSum",
    "https://files.webis.de/summary-explorer/test-set/xsum/xsum_articles.txt",
  ],
  [
    "Webis TL;DR",
    "https://files.webis.de/summary-explorer/test-set/tldr/tldr_articles.txt",
  ],
];

const EMAILS = [
  "shahbaz.syed[at]uni-leipzig.de",
  "tariq.yousef[at]uni-leipzig.de",
];

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="inline  h-6 w-6 "
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block  h-6 w-6 "
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function About() {
  return (
    <div className="left-0 mt-4 w-full justify-end rounded-lg bg-white p-1 px-4 py-4 text-left text-sm">
      <h1 className="text-normal article_header header_font mb-0 px-4 py-2 text-justify text-xl font-extrabold text-blue-900">
        Model Submission
      </h1>

      <div
        className="mx-4 mt-2 border-l-4 border-blue-700 bg-blue-100 px-4 py-2 text-blue-800"
        role="alert"
      >
        <ol className=" list-decimal p-2 leading-loose">
          <li>
            Download the test set for a dataset (a single text file with one
            article per line):{" "}
            {renderListWithSeparator(
              TEST_SETS,
              ([name, link]) => (
                <a
                  href={link}
                  className="font-semibold underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  {name}
                </a>
              ),
              { key: ([name]) => name }
            )}
          </li>
          <li>
            Generate summaries from your model in the <b>exact order</b> to
            avoid alignment errors with hosted models.
          </li>
          <li>
            Send us the output file with summaries (a single text file with one
            summary per line) to{" "}
            {renderListWithSeparator(
              EMAILS,
              (email) => (
                <span className="underline">{email}</span>
              ),
              { separator: " or " }
            )}
          </li>
        </ol>
      </div>

      <h1
        className="text-normal article_header header_font mt-6 mb-0 px-4 py-2 text-justify text-xl font-extrabold
             text-blue-900"
      >
        Automatic Metrics
      </h1>
      <div className="m-4">
        <span className="font-bold text-blue-900">Summary Length:</span> It is
        the number of words in the summary.
      </div>

      <div className="m-4">
        <span className="font-bold text-blue-900">Novelty:</span> It is the
        percentage of summary words that are not in the document.
      </div>

      <div className="m-4">
        <span className="font-bold text-blue-900">Compression Ratio:</span> It
        is the word ratio between the article and the summary.
      </div>

      <div className="m-4">
        <span className="font-bold  text-blue-900">ROUGE:</span> We use the
        Python implementation provide by{" "}
        <a
          href="https://github.com/google-research/google-research/tree/master/rouge"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Google Research
        </a>
        .
      </div>

      <div className="m-4">
        <span className="font-bold text-blue-900">Factual Consistency:</span> We
        compute this on two levels inspired by{" "}
        <a
          href="https://www.aclweb.org/anthology/2021.eacl-main.235/"
          target="_blank"
          className="underline"
          rel="noreferrer"
        >
          Nan et.al, 2021
        </a>
        .
        <div className="mx-5 mt-2">
          <ul>
            <li className="mt-2 leading-relaxed">
              <span className="font-bold text-orange-800 ">Entity-level:</span>{" "}
              the percentage of named entities in the summary that are found in
              the document. We also match partial entities to their longer
              counterparts from the document if they share parts of the entity.
            </li>
            <li className="mt-2 leading-relaxed">
              <span className="font-bold text-orange-800 ">
                Relation-level:
              </span>{" "}
              the percentage of relations (extracted using{" "}
              <a
                href="http://nlp.stanford.edu/software/openie.html"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Stanford OpenIE
              </a>
              ) in the summary that are found in the document. Since we consider
              reference also a model, we only compute the precision with respect
              to the source document.
            </li>
          </ul>
        </div>
      </div>
      <div className="m-4">
        <span className="font-bold text-blue-900">N-gram Abstractiveness:</span>{" "}
        We compute the n-gram abstractiveness upto 4-grams following{" "}
        <a
          href="https://aclanthology.org/W19-8665/"
          target="_blank"
          className="underline"
          rel="noreferrer"
        >
          Gehrmann et al., 2019
        </a>
        . It is the normalized score for novelty that tracks parts of a summary
        that are already among the n-grams it has in common with the document.
      </div>

      <div className="m-4 mt-10">
        <div>
          <span className="font-bold text-blue-900">
            <DocumentIcon />
          </span>{" "}
          <a
            href="https://arxiv.org/abs/2108.01879"
            target="_blank"
            className="font-medium underline"
            rel="noreferrer"
          >
            Summary Explorer: Visualizing the State of the Art in Text
            Summarization
          </a>
        </div>
        <div className="mt-2">
          <span className="font-bold text-blue-900">
            <GitHubIcon />
          </span>{" "}
          <a
            href="https://github.com/webis-de/summary-explorer"
            target="_blank"
            className="font-medium underline"
            rel="noreferrer"
          >
            Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
