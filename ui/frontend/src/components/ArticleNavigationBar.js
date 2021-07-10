import React from "react";
import ShuffleIcon from "../assets/images/shuffle.svg";
import LinkIcon from "./icons/LinkIcon";
import NextIcon from "./icons/NextIcon";
import PrevIcon from "./icons/PrevIcon";

export default function ArticleNavigationBar(props) {
    const {article_id, dataset_id} = props;
    const corpus_upper_bound = {1: 11448, 2: 10360, 3:250};
    const btn_style = "px-1 py-1 bg-blue-800 text-white text-xxs rounded mr-1 hover:bg-red-700 cursor-pointer";
    return (
        <div className="flex mb-1">
                                {article_id > 1?
                                 <span className={btn_style}
                                       onClick={()=>{props.loadArticle(article_id-1, dataset_id)}}>
                                        <PrevIcon />
                                 </span>: null}

                                 <span className={btn_style}
                                       onClick={()=>{props.loadArticle(-1, dataset_id)}}>
                                     <span dangerouslySetInnerHTML={{__html: ShuffleIcon}} className="m-auto block" />
                                 </span>

                                {article_id < corpus_upper_bound[dataset_id]?
                                 <span className={btn_style}
                                       onClick={()=>{props.loadArticle(article_id+1, dataset_id)}}>
                                    <NextIcon />
                                 </span>:null}
                                <span>
                                    <input type="text"
                                           name="article_id"
                                           id="article_id_input"
                                           defaultValue={article_id}
                                           size={7}
                                           className="border-b-2 border-blue-800 bg-white text-center
                                    text-blue-800 focus:outline-none"/>
                                </span>
                                <span className="px-1 py-1  bg-blue-800 text-white text-xxs rounded-r mr-1 hover:bg-red-700 cursor-pointer"
                                      onClick={()=>{props.loadArticleUserInput()}}>
                                    Load Article
                                         <NextIcon />
                                 </span>

                                <span className={btn_style + " mr-1"}
                                      onClick={()=>{props.copyTextToClipboard()}}>
                                    <LinkIcon /><span className="mr-1">Copy Link</span>
                                </span>
                         </div>
    )
}