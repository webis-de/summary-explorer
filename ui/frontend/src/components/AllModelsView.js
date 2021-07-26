import React from 'react';
import '../assets/main.css';
import ModelsScores from "./ModelsScores";
import axios from "axios";
import ArticleHeatMap from "./ArticleHeatMap";
import ShuffleIcon from "../assets/images/shuffle.svg";


class AllModelsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data_loaded: false,
            scores: [],
            article: [],
            spacy_article_map: [],
            hallucinations:[],
            missing_entities: [],
            summaries: [],
            article_id: this.props.article_id,
            dataset_id: this.props.dataset_id
        }
    }

    componentDidMount() {
        this.loadScores(this.props.article_id, this.props.dataset_id)
    }


    loadScores = (article_id, dataset_id) =>{
      this.setState({
          data_loaded: false,
      });

      const url="../api/article/" + article_id +"/"+dataset_id+"/scores";
      axios.get(url)
          .then(res => {
              this.setState({
                  article_id: res.data.article.article_id,
                  dataset_id: dataset_id,
                  scores: res.data.scores,
                  article: res.data.article,
                  spacy_article_map: res.data.spacy_article_map,
                  hallucinations: res.data.unique_hallucinations,
                  entities: res.data.entities,
                  summaries: res.data.summaries,
                  missing_entities: res.data.missing_entities,
                  data_loaded: true,
              });
          });
    };

    render() {
        const {article, spacy_article_map, scores, data_loaded, article_id, summaries, dataset_id,
            hallucinations, entities, missing_entities} = this.state;
        return (
            <div>
                {data_loaded ?
                    <div className="w-full p-1 justify-end text-sm left-0 text-left ">
                        <div className="flex w-full px-0 py-0 mb-1">
                         <div className="w-7/12 items-end flex">
                            <div className="flex">
                                 <span className="px-1 py-1  bg-blue-900 text-white text-xs rounded mr-1
                                  hover:bg-red-700"
                                 onClick={()=>{this.loadScores(article_id-1, dataset_id)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                 </span>

                                 <span className="px-1 py-1  bg-blue-900 text-white text-xs rounded mr-1
                                  hover:bg-red-700"
                                 onClick={()=>{this.loadScores(0, dataset_id)}}>
                                     <span dangerouslySetInnerHTML={{__html: ShuffleIcon}} className="m-auto block" />
                                 </span>

                                 <span className="px-1 py-1  bg-blue-900 text-white text-xs rounded mr-1
                                  hover:bg-red-700"
                                 onClick={()=>{this.loadScores(article_id+1, dataset_id)}}>
                                         <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                         </svg>
                                 </span>
                         </div>
                         </div>
                         <div className="w-5/12 ">

                         </div>
                     </div>

                        <ModelsScores scores={scores}/>
                        <div className="flex">
                            <div className="w-7/12 bg-white text-left border rounded shadow-xl mb-2">
                                <ArticleHeatMap
                                    article_id={article_id}
                                    sentences={article.sentences}
                                    sentences_array={spacy_article_map}
                                />
                            </div>
                            <div className="w-3/6  ml-2 text-left">
                                <div className="py-2 px-4 w-full leading-loose shadow-xl border bg-white mb-2 rounded-md flex-wrap  hover:border-gray-600 hover:border-4">
                                    <div className="flex ">
                                        <h2 className="font-extrabold text-normal mb-0  article_header self-end ">
                                            <span className="uppercase">Hallucinations</span>
                                        </h2>
                                    </div>
                                    <div className="flex-wrap">
                                        <div className="mb-2">
                                            {hallucinations.map(h=>{
                                        return <div className="mt-2 inline mx-1 px-1 py-1 text-xs  py-0
                                         hover:bg-gray-400 bg-gray-300 text-red-700 rounded ">{h[0]}
                                            <span className="bg-white ml-1 px-1 rounded text-red-800  text-xs font-semibold">{h[1]}</span>{" "}</div>
                                            })}
                                        </div>

                                        {hallucinations.length===0?<span className="text-xs text-gray-600 "> No Hallucinations!</span>:null}</div>
                                    {summaries.map(summ=>{
                                        return <div className="flex mb-2">
                                                   <div className="uppercase text-xs text-gray-700inline whitespace-no-wrap">{summ["smodel_id"]}</div>
                                             <div >{summ['novelWords'].map(h=>{
                                        return <div className="mt-2 inline mx-1 px-1 py-1 text-xs  py-0
                                         hover:bg-gray-400 bg-gray-300 text-red-700 rounded ">{h['token']}
                                            <span className="bg-white ml-1 px-1 rounded text-red-800  text-xs font-semibold">{h['freq']}</span>{" "}</div>
                                    })}</div>
                                               </div>
                                    })}
                                </div>

                                <div className="py-2 px-4 w-full leading-loose shadow-xl border bg-white mb-2 rounded-md flex-wrap  hover:border-yellow-600 hover:border-4">
                                    <div className="flex ">
                                        <h2 className="font-extrabold text-normal mb-0  article_header self-end ">
                                            <span className="uppercase text-green-800">Covered Article Entities</span>
                                        </h2>
                                    </div>
                                    <div className="flex-wrap">
                                    {entities.map(h=>{
                                        return <div className="mt-2 inline mx-1 px-1 py-1 text-xs py-0
                                         hover:bg-green-800 bg-green-700 text-white rounded ">{h[0][0]}
                                            <sub className="ml-1 text-xs font-bold text-yellow-300" style={{fontSize: "5pt"}}>{h[0][1]}</sub>
                                            <span className="bg-white text-green-800 ml-1 px-1 rounded text-xs font-semibold">{h[1]}</span>{" "}</div>
                                    })}
                                        {entities.length===0?<span className="text-xs text-gray-600 "> Summaries don't contain any entities!</span>:null}

                                </div>
                                </div>

                                <div className="py-2 px-4 w-full leading-loose shadow-xl border bg-white mb-2 rounded-md flex-wrap  hover:border-red-600 hover:border-4">
                                    <div className="flex ">
                                        <h2 className="font-extrabold text-normal mb-0  article_header self-end text-red-600">
                                            <span className="uppercase">Uncovered Article Entities</span>
                                        </h2>
                                    </div>
                                    <div className="flex-wrap whitespace-normal">
                                    {missing_entities.map(h=>{
                                        return <div className="mt-2 inline mx-1 px-1 py-1 text-xs py-0 text-white
                                        hover:bg-red-700 bg-red-600 rounded" >{h[0][0]}
                                            <sub className="ml-1 text-xs font-bold text-yellow-300" style={{fontSize: "5pt"}}>{h[0][1]}</sub>
                                            <span className="bg-white text-red-800 ml-1 px-1 rounded text-xs font-semibold">{h[1]}</span>{" "}</div>
                                    })}
                                        {missing_entities.length===0?<span className="text-xs text-gray-600 "> No missing entities!</span>:null}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        )
    }
}
export default AllModelsView;