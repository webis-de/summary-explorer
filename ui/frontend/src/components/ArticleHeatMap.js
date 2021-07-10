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
                    <span className="w-1/2 uppercase font-bold">
                        ARTICLE {this.props.article_id}
                    </span>
                    <div className="flex-end w-1/2  text-right mr-1">
                        <span className="inline text-xs">Agreement</span>
                        <div className="flex float-right">
                            {this.props.lexical?
                            <Legend key="AHMlegend"
                                label_left="Low"
                                label_right="High" id_="articleheatmap_legend"
                                interpolator={d3.interpolateGreens}/>:
                            <Legend key="AHMlegend"
                                label_left="Low"
                                label_right="High" id_="articleheatmap_legend"
                                interpolator={d3.interpolateBlues}
                        />}</div>

                    </div>
                </h2>
                <div className="px-4 text-sm text-left leading-relaxed mb-2">
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