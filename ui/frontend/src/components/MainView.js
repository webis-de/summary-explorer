import React from 'react';
import '../assets/main.css';
import axios from "axios";
import HeatMap from "./HeatMap";
import Histogram from "./Histogram";
import SingleGroupView from "./SingleGroupView";
import HistogramWithCurve from "./HistogramWithCurve";
import Questions from "./Questions";
import PopoverDiv from "./Popover";
import SingleGroupViewHalucination from "./SingleGroupViewHalucination";
import SingleGroupViewEntity from "./SingleGroupViewEntity";
import SingleGroupViewArticleHM from "./SingleGroupViewArticleHM";
import SingleGroupViewRelations from "./SingleGroupViewRelations";
import ArticlesBarsHeatMap from "./ArticlesBarsHeatMap";
import Legend from "./Legend";
import * as d3 from "d3";
import ListBoxQuestions from "./ListBoxQuestions";
import BackIcon from "./icons/BackIcon"
import DataSetBlock from "./DataSetBlock";


class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data_loaded: false,
            models: [],
            metrics: [],
            metrics_subset: [],
            dataset_id: this.props.dataset_id,
            selected_model: null,
            user_selected_models: [],
            default_view:"questions",
            compression: null,
            current_question: "",
            question_id: null,
            selected_models: {},
            article_bars_HM_selected_article: null,

        }
    }

    componentDidMount() {
        this.loadScores(this.props.dataset_id)
    }

    loadModel = (model_name) => {
        if(this.state.question_id===6){
            let temp={};
            temp["model_name"] = model_name;
            this.setState({
                      selected_models: temp
                  });
        }else{
            const url="../api/smodel/"+model_name+"/"+this.props.dataset_id;
            let temp = this.state.selected_models
            axios.get(url)
              .then(res => {
                  temp[res.data.name] = res.data
                  this.setState({
                      selected_model:res.data,
                      selected_models: temp
                  });
              });
        }

    }

    loadScores = (dataset_id) =>{
      this.setState({
          data_loaded: false,
      });

      const url="../api/dataset/"+dataset_id+"/models_stat";
      axios.get(url)
          .then(res => {
              this.setState({
                  dataset_id: dataset_id,
                  models: res.data.models,
                  metrics: res.data.metrics,
                  data_loaded: true,
              });
          });
    };

    setSubMetrics = (metrics_list, question, q_id) => {
        this.setState({
            metrics_subset: metrics_list,
            default_view:"allArticlesAllSummaries",
            current_question: question,
            question_id:q_id
        })
    }

    updateSubMetrics = (metrics_list) => {
        this.setState({
            metrics_subset: metrics_list,
        })
    }

    // addModelToSelectedModels = (name)=>{
    //     console.log("add "+name+" to user_selected_models")
    //     let arr = this.state.user_selected_models;
    //     if(this.state.question_id===6)
    //         arr=[name]
    //     else
    //         arr.push(name)
    //     console.log(arr)
    //     this.setState({
    //         user_selected_models: arr,
    //     })
    // }
    //
    // removeModelToSelectedModels = (name)=>{
    //     console.log("remove  "+name+" from user_selected_models")
    //     let arr = this.state.user_selected_models;
    //     const index = arr.indexOf(name);
    //     if (index > -1) {
    //         arr.splice(index, 1);
    //     }
    //     console.log(arr)
    //     this.setState({
    //         user_selected_models: arr,
    //     })
    // }

    openSingleGroupView = ()=>{
        this.setState({
            default_view: "SingleGroupView",
        })
    }

    openMainView = ()=>{
        this.setState({
            default_view: "allArticlesAllSummaries",
        })
    }

    openQuestionsView = ()=>{
        this.setState({
            default_view: "questions",
            selected_models: []
        })
    }

    removeFromSelectedModels = (n)=>{
        let temp = this.state.selected_models;
        delete temp[n];
        this.setState({
            selected_models: temp
        })
    }

    setArticleBarsHeatMapSelectedModel=(article_id)=>{
        this.setState({
            article_bars_HM_selected_article: article_id,
            default_view: "SingleGroupViewSingleArticle",
        })
    }

    cbangeQuestionId = (id, q)=>{
        this.setState({
            question_id:id,
            current_question: q
        })
    }

    render() {
        const {models, metrics, dataset_id, data_loaded, selected_model, current_question, metrics_subset,selected_models,
            user_selected_models, default_view, question_id} = this.state;
        return (
            <div>
                <DataSetBlock dataset_id={dataset_id} />
                {default_view==="questions" ?
                    <Questions setSubMetrics={this.setSubMetrics}/>: null
                }

                {(data_loaded && default_view==="allArticlesAllSummaries") ?
                    <div className="w-full p-1 pl-0 justify-end text-sm left-0 text-left ">
                        <button onClick={()=>{this.openQuestionsView()}} className="back-button">
                            <BackIcon />
                            Back to The Questions
                        </button>
                        <h1 className="header_font  px-1 font-semibold text-blue-800">Which models do you want to compare?</h1>

                        <HeatMap metrics={metrics_subset}
                                 updateSubMetrics={this.updateSubMetrics}
                                 scores={models}
                                 selected_models={Object.keys(selected_models)}
                                 loadModel={this.loadModel}
                        />
                        <h1 className="header_font bmb-2 font-semibold text-blue-800">
                            {question_id === 6 ?
                                current_question :
                                <ListBoxQuestions selected_question={question_id} handleSelect={this.cbangeQuestionId}/>
                            }
                        </h1>

                        {Object.keys(selected_models).length > 0 && question_id!==6?
                        <div className="mb-1 flex">
                            <button className="float-rightmy-1 rounded text-sm px-3 py-1  py-0 font-normal
                                            hover:bg-red-700 bg-blue-800 text-white focus:outline-none text-xs"
                                            onClick={()=>{this.openSingleGroupView()}}>
                                                Show Examples
                            </button>
                        </div>: null}
                        {question_id===6?
                            <div>
                                {"model_name" in selected_models?
                                    <div className="bg-white my-2 rounded px-4 py-1">
                                        <Legend key="legend_2" label_left="Low" label_right="High" interpolator={d3.interpolateBlues} />
                                        <ArticlesBarsHeatMap
                                            dataset_id={dataset_id}
                                            model_name={selected_models["model_name"]}
                                            setArticleBarsHeatMapSelectedModel = {this.setArticleBarsHeatMapSelectedModel}
                                            />
                                    </div>:null}
                            </div>:
                        <div className="grid grid-cols-4 gap-4">


                            {Object.entries(selected_models).map(([key,selected_model],i) =>{
                                return <div className="bg-white text-left border rounded shadow-xl mb-2 px-3 py-2">
                                {/*Remove Block*/}
                                <span className="float-right text-gray-700  hover:text-red-800 cursor-pointer  pr-1 pt-1"
                                      onClick={()=>{this.removeFromSelectedModels(key)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>

                                {selected_model==null?null:
                                    <div className="text-sm font-medium text-gray-900">
                                          <div className="mb-2 text-blue-800">{selected_model.raw.name.toUpperCase()}
                                              <PopoverDiv model_info={selected_model.raw}/>
                                          </div>
                                    </div>
                                }
                                {selected_model!==null?
                                    <div>
                                            <div className="w-full">
                                                {metrics_subset.includes("compression")?
                                                    <HistogramWithCurve
                                                    model={selected_model.raw.name}
                                                    title="Compression"
                                                    uid={"copm" + i}
                                                    scores={selected_model.histogram_data.compression}
                                                    key={"copm" + i}
                                                    />: null
                                                }
                                            </div>
                                            <div className="w-full">
                                                {metrics_subset.includes("length")?
                                                <HistogramWithCurve
                                                    title="Length"
                                                    uid={"lngth" + i}
                                                    scores={selected_model.histogram_data.length_}
                                                    key={"lngth" + i}
                                                />: null}
                                            </div>
                                            <div className="w-full">
                                            {metrics_subset.includes("rouge1")?
                                                <HistogramWithCurve
                                                    title="Rouge 1"
                                                    uid={"rg1" + i}
                                                    scores={selected_model.histogram_data.rouge1}
                                                    key={"rg1" + i}
                                                    />:null}
                                            </div>
                                            <div className="w-full">
                                                {metrics_subset.includes("rouge2")?
                                                <HistogramWithCurve
                                                    title="Rouge 2"
                                                    uid={"rg2" + i}
                                                    scores={selected_model.histogram_data.rouge2}
                                                    key={"rg2" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                                {metrics_subset.includes("rougeL")?
                                                <HistogramWithCurve
                                                    title="Rouge L"
                                                    uid={"rgl" + i}
                                                    scores={selected_model.histogram_data.rougel}
                                                    key={"rgl" + i}
                                                    />:null}
                                            </div>
                                            <div className="w-full">
                                                {metrics_subset.includes("entities")?
                                                <Histogram
                                                    title="Entity Level Factuality"
                                                    uid={"ent" + i}
                                                    scores={selected_model.histogram_data.entities}
                                                    key={"nov" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                                {metrics_subset.includes("relations")?
                                                <Histogram
                                                    title="Relation Level Factuality"
                                                    uid={"rel_fact_" + i}
                                                    scores={selected_model.histogram_data.relations}
                                                    key={"rel_fact_" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                            {metrics_subset.includes("uni_gram_abs")?
                                                <HistogramWithCurve
                                                    title="Unigram Abs."
                                                    uid={"unigram_" + i}
                                                    scores={selected_model.histogram_data.uni_gram_abs}
                                                    key={"unigram_" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                             {metrics_subset.includes("bi_gram_abs")?
                                                <HistogramWithCurve
                                                    title="Bigram Abs."
                                                    uid={"bigram_" + i}
                                                    scores={selected_model.histogram_data.bi_gram_abs}
                                                    key={"bigram_" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                             {metrics_subset.includes("tri_gram_abs")?
                                                <HistogramWithCurve
                                                    title="Trigram Abs."
                                                    uid={"trigram_" + i}
                                                    scores={selected_model.histogram_data.tri_gram_abs}
                                                    key={"trigram_" + i}
                                                />:null}
                                            </div>
                                            <div className="w-full">
                                             {metrics_subset.includes("four_gram_abs")?
                                                <HistogramWithCurve
                                                    title="Fourgram Abs."
                                                    uid={"fourgram_" + i}
                                                    scores={selected_model.histogram_data.four_gram_abs}
                                                    key={"fourgram_" + i}
                                                />:null}
                                            </div>
                                    </div>
                                    :null}


                            </div>
                            })}
                        </div>
                            }
                    </div>
                    : null}
                {default_view==="SingleGroupView"?
                    <div className="w-full p-1 pl-0 justify-end text-sm left-0 text-left ">
                        <button onClick={()=>{this.openMainView()}} className="back-button">
                            <BackIcon />
                            Back to Models
                        </button>
                        <h1 className="header_font font-semibold text-blue-800 ml-1">{current_question}</h1>
                        {question_id===1?
                            <SingleGroupView key="ModelGroupView"
                                     dataset_id={dataset_id}
                                     article_id={-1}
                                     all_models={models}
                                     selected_models={Object.keys(selected_models)}
                                     />:null
                        }
                        {question_id===2?
                            <SingleGroupViewHalucination key="ModelGroupViewHalucination"
                                     dataset_id={dataset_id}
                                     article_id={-1}
                                     all_models={models}
                                     selected_models={Object.keys(selected_models)}
                                     />:null
                        }
                        {question_id===3?
                            <SingleGroupViewEntity key="SingleGroupViewEntity"
                                     dataset_id={dataset_id}
                                     article_id={-1}
                                     all_models={models}
                                     selected_models={Object.keys(selected_models)}
                                     />:null
                        }
                        {question_id===4?
                            <SingleGroupViewRelations key="SingleGroupViewRelations"
                                     dataset_id={dataset_id}
                                     article_id={-1}
                                     all_models={models}
                                     selected_models={Object.keys(selected_models)}
                                     />:null
                        }
                        {question_id===5?
                            <SingleGroupViewArticleHM key="SingleGroupViewArticleHM"
                                     dataset_id={dataset_id}
                                     article_id={-1}
                                     all_models={models}
                                     selected_models={Object.keys(selected_models)}
                                     />:null
                        }
                    </div>
                :null}

                {default_view==="SingleGroupViewSingleArticle"?
                    <div>
                        <button onClick={()=>{this.openMainView()}} sclassName="back-button">
                            <BackIcon />
                            Back to Models
                        </button>
                        <h1 className="header_font font-semibold text-blue-800">{current_question}</h1>
                        {question_id===6?
                            <SingleGroupView key="ModelGroupView"
                                     dataset_id={dataset_id}
                                     article_id={this.state.article_bars_HM_selected_article}
                                     all_models={models}
                                     selected_models={[selected_models["model_name"]]}
                                     />:null
                        }
                    </div>:null
                }
            </div>
        )
    }
}
export default MainView;