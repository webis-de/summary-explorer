import React from 'react';
import '../assets/main.css';
import * as d3 from 'd3';
import Legend from "./Legend";

class ArticleHeatMap extends React.Component {

    constructor(props) {
        super(props);
    }

    Color = (v)=>{
        const interpolator = this.props.lexical? d3.interpolateGreens:d3.interpolateBlues;
        return interpolator(0.5 + v/2)
    }

    render() {
        const {sentences, sentences_array} = this.props;
        return (
            <div>
                <h2 className="flex text-normal mb-0 px-4 py-2  text-justify article_header text-blue-900">
                    <span className="w-1/3 uppercase font-bold">
                        ARTICLE {this.props.article_id}
                    </span>
                    <div className="flex-end w-2/3  text-right mr-1">
                        <div className="flex float-right">
                            <div className="flex float-right">
                                <span className="px-1 py-1 text-xxs">Agreement</span>
                            </div>
                            {this.props.lexical?
                            <Legend key="AHMlegend"
                                label_left="Low"
                                label_right="High" id_="articleheatmap_legend"
                                interpolator={d3.interpolateGreens}/>:
                            <Legend key="AHMlegend"
                                label_left="Low"
                                label_right="High" id_="articleheatmap_legend"
                                interpolator={d3.interpolateBlues}
                            />}

                            <div className="flex">
                                <button onClick={()=>{this.props.buttonClicked('lexical')}}
                                    className={'px-1 py-1 text-xxs rounded mr-1 hover:text-white hover:bg-blue-700 focus:outline-none'
                                    + (this.props.buttons['lexical'] ? " bg-blue-800  text-white":" bg-gray-400  text-gray-800") }>Lexical
                                </button>
                                <button onClick={()=>{this.props.buttonClicked('bert')}}
                                    className={'px-1 py-1 text-xxs rounded mr-1 hover:text-white hover:bg-blue-700 focus:outline-none'
                                    + (this.props.buttons['bert'] ? " bg-blue-800  text-white":" bg-gray-400  text-gray-800") }>Semantic
                                </button>
                            </div>



                        </div>

                    </div>
                </h2>
                <div className="px-4 text-sm text-left leading-relaxed mb-2  pb-2">
                    <div style={{fontFamily: "Verdana, serif"}}>{
                        sentences.map(sent => {
                            const score = sent.sent_id in sentences_array?sentences_array[sent.sent_id] : 0
                            const font_color = score > 0 ? "#FFFFFF": "#000000"
                            let label = Math.round(score*this.props.num_of_summaries) +"/"+this.props.num_of_summaries;
                            return (
                                <span>
                                     <span id={"sent_" + sent.sent_id} className="mr-1 cursor-pointer"
                                           title={label}
                                           onClick={()=>{this.props.set_id(sent.sent_id)}}
                                           style={{backgroundColor: score===0?"#FFFFFF":this.Color(score), color: font_color}}>
                                         {sent.text+ "."}
                                     </span>
                                    &nbsp;
                                </span>)
                         })
                    }
                    </div>

                </div>
            </div>
        )
    }
}

export default ArticleHeatMap;