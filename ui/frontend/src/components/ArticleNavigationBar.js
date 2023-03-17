/* eslint-disable */
import React from "react";

import NextIcon from "./icons/NextIcon";
import PrevIcon from "./icons/PrevIcon";
import ShuffleIcon from "./icons/ShuffleIcon";

export default function ArticleNavigationBar(props) {
  const { article_id, dataset_id, dataset_boundaries } = props;
  const btn_style =
    "px-1 py-1 bg-blue-800 text-white text-xs rounded mr-1 hover:bg-red-700 cursor-pointer";
  return (
    <div className="mb-1 flex">
      {article_id > dataset_boundaries["article_id__min"] ? (
        <span
          className={btn_style}
          onClick={() => {
            props.loadArticle(article_id - 1, dataset_id);
          }}
        >
          <PrevIcon />
        </span>
      ) : null}

      <span
        className={btn_style}
        onClick={() => {
          props.loadArticle(-1, dataset_id);
        }}
      >
        <div className="m-auto block">
          <ShuffleIcon />
        </div>
      </span>

      {article_id < dataset_boundaries["article_id__max"] ? (
        <span
          className={btn_style}
          onClick={() => {
            props.loadArticle(article_id + 1, dataset_id);
          }}
        >
          <NextIcon />
        </span>
      ) : null}
      <span>
        <input
          type="text"
          name="article_id"
          id="article_id_input"
          defaultValue={article_id}
          size={7}
          className="border-b-2 border-blue-800 bg-white pb-1 text-center
                                    text-blue-800 focus:outline-none"
        />
      </span>
      <span
        className="mr-1 cursor-pointer rounded-r bg-blue-800 px-1 py-1 pl-2 text-xs text-white hover:bg-red-700"
        onClick={() => {
          props.loadArticleUserInput();
        }}
      >
        Load Article
        <NextIcon />
      </span>
    </div>
  );
}
