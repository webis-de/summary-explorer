import React from 'react';
import '../assets/main.css';
import ShuffleIcon from "../assets/images/shuffle.svg"
import axios from "axios";
import LoadingIcon from "../assets/images/loading.svg";
import ArticleBlockRelations from "./ArticleBlockRelations";
import SummaryBlockRelations from "./SummaryBlockRelations";
import ArticleNavigationBar from "./ArticleNavigationBar";
import ErrorMessage from "./ErrorMessage";
import ShareButton from "./ShareButton";


class SingleGroupViewRelations extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            api_summary_url : `../api/summary/`,
            api_article_url : `../api/article/`,

            article_id: this.props.article_id,
            dataset_id: this.props.dataset_id,
            selected_models: this.props.selected_models,

            selected_sentences: {},
            models_selected_sentences: {},

            hallucinations: [],
            models_loaded: false,
            smodels: [],
            summaries:[],
            relations: [],
            current_model: null,
            aggregate: false,
            selected_relation: null,
            corpus_upper_bound: {1: 11448, 2: 10360, 3:250},
            error_message:"",
            show_error: false,
            relation_view: true,

        };
    }

    componentDidMount() {
        this.loadArticle(this.props.article_id, this.props.dataset_id);
    }

    loadArticle = (article_id, ds_id)=>{
      this.setState({
          article_loaded: false,
          models_loaded: false
      });
        let url = this.state.api_article_url + article_id+"/"+ds_id;
        if (article_id === -1){
          url="../api/article/" + this.state.dataset_id+"/random";
      }
      this.getArticle(url);
      this.reset_article_parameters();
    };

    reset_article_parameters = ()=>{
        this.setState({
            selected_sentences: {}
        })
    }

    set_selected_relation = (s)=>{
        this.setState({
            selected_relation: s,
            relation_view: s!==null
        })
    }

    getArticle = (url)=>{
        const {selected_models} = this.props
        axios.get(url)
          .then(res => {
              const article = res.data.raw;
              console.log(res)
              this.setState({
                  article_id: res.data.article_id,
                  sentences: article.sentences,
                  article_loaded: true,
                  selected_relation: null
              });
              this.props.setArticleId(res.data.article_id);
              this.loadGroupSummaries(selected_models);
          });
    }

    loadGroupSummaries = (selected_models)=>{
        this.setState({
          models_loaded: false
      });
        const url = '../api/article/relations?ds_id='+this.state.dataset_id+'&id='+
            this.state.article_id+'&models='+selected_models.join(",");
        console.log(url)
        axios.get(url)
        .then(res => {
          this.setState({
              models_loaded: true,
              summaries: res.data.summaries,
              smodels: res.data.smodels,
              relations: res.data.relations_list,
              hallucinations: res.data.unique_hallucinations,
          });
          console.log(res.data.smodels)
      });
    };

    toggleAggregate = ()=>{
        this.setState({
            aggregate: !this.state.aggregate
        })
    }

    loadArticleUserInput = ()=>{
        const {dataset_id, corpus_upper_bound} = this.state;
        let article_id = document.getElementById("article_id_input").value;
        if(!isNaN(article_id) && article_id > 0 && article_id < corpus_upper_bound[dataset_id]){
            this.loadArticle(article_id, dataset_id)
        }else{
            this.setState({
                error_message:"Article ID should be a number between 1 and "+corpus_upper_bound[dataset_id],
                show_error: true
            })
            document.getElementById("article_id_input").value = article_id;
        }
    }

    closeErrorMessage = ()=>{
        this.setState({
                error_message:"",
                show_error: false
            })
    }

    highlight_article_sentences = (sentences, current_model) =>{
        // this.reset_highlighting_all_models()
        console.log(sentences)
        this.setState({
            selected_sentences: sentences,
            relation_view: false
        })
    }

    copyTextToClipboard = ()=>{
        const {dataset_id, article_id} = this.state;
        const external_link = window.location.origin+"/article?ds="+dataset_id+"&a="+article_id+"&s=4&m="+this.props.selected_models.join(",");
        navigator.clipboard.writeText(external_link)
    }

    render(){
        console.log("rendering...")
        const {article_loaded, models_loaded, sentences, smodels, current_model, dataset_id, hallucinations, summaries,
            aggregate, article_id, relations, corpus_upper_bound, selected_relation} = this.state;
        return (
            <div>
                 <div className="w-full p-1 justify-end text-sm left-0 text-left ">
                     <div className="flex w-full px-0 py-0 mb-1">
                         <div className="w-6/12 items-end">
                                {article_loaded?
                                    <ArticleNavigationBar article_id={article_id}
                                                          dataset_id={dataset_id}
                                                          loadArticleUserInput={this.loadArticleUserInput}
                                                          loadArticle={this.loadArticle}
                                                          copyTextToClipboard={this.copyTextToClipboard}
                                    />:null
                                }
                                {this.state.show_error?
                                    <ErrorMessage
                                     error_message={this.state.error_message}
                                     closeErrorMessage={this.closeErrorMessage}/>
                                :null
                                }
                         </div>
                         <div className="w-6/12 ml-4 ">
                            <ShareButton copyTextToClipboard={this.copyTextToClipboard} />
                         </div>
                     </div>
                     <div className="flex" id="singleModelViewHalucination">
                        <div className="w-6/12 bg-white text-left border rounded-t-md shadow-xl" >
                            {article_loaded?
                                    <ArticleBlockRelations key="ArticleBlock"
                                                  json={sentences}
                                                  relation_view={this.state.relation_view}
                                                  relations={relations}
                                                           selected_sentences={this.state.selected_sentences}
                                                  selected_relation={selected_relation}
                                                  article_id={this.state.article_id}
                                    /> :
                                <div className="w-full bg-white text-left border rounded-t-md shadow-xl">
                                  <div dangerouslySetInnerHTML={{__html: LoadingIcon}} className="p-5 m-auto block" />
                                </div>
                            }

                        </div>
                        <div className="w-6/12 ml-4 text-left">
                            {models_loaded?
                                    <div>
                                        {aggregate?
                                        <div className="py-2 px-4 w-full leading-loose shadow-xl border bg-white mb-2
                                        rounded-md flex-wrap  hover:border-gray-600 hover:border-4">
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
                                                       <div className="uppercase text-xs text-gray-700inline whitespace-no-wrap header_font font-semibold">{summ["smodel_id"]}</div>
                                                 <div >{summ['novelWords'].map(h=>{
                                            return <div className="mt-2 inline mx-1 px-1 py-1 text-xs  py-0
                                             hover:bg-gray-400 bg-gray-300 text-red-700 rounded ">{h['token']}
                                                <span className="bg-white ml-1 px-1 rounded text-red-800  text-xs font-semibold">{h['freq']}</span>{" "}</div>
                                        })}</div>
                                                   </div>
                                        })}
                                    </div>
                                        :
                                        <div>
                                           {smodels.map((model, i)=>{
                                                return <SummaryBlockRelations key={"SummaryView"+i}
                                                                             all_models={this.props.all_models}
                                                                             sentences={model.raw.sentences}
                                                                             model_info={model.model_info}
                                                                             summ_model={model.smodel}
                                                                             novelWords={model.raw.novelWords}
                                                                             article_id={this.state.article_id}
                                                                             current_model={current_model}
                                                                             set_selected_relation={this.set_selected_relation}
                                                                             highlight_article_sentences={this.highlight_article_sentences}
                                                        />
                                        })}
                                       </div>
                                        }
                                    </div>:
                                <div className="w-full bg-white text-left border rounded-t-md shadow-xl">
                                  <div dangerouslySetInnerHTML={{__html: LoadingIcon}} className="p-5 m-auto block" />
                                </div>
                            }

                        </div>
                    </div>
                 </div>
            </div>
        )
    }
}

export default SingleGroupViewRelations;