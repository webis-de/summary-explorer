import React from 'react';
//import '../assets/main.css';
import * as d3 from 'd3';
import ReactDOM from "react-dom";
import Legend from "./Legend";
import { sliderBottom } from 'd3-simple-slider';


class HeatMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            all_metrics: ["compression", "length", "rouge1", "rouge2", "rougeL", "entities", "relations",
               "uni_gram_abs", "bi_gram_abs", "tri_gram_abs", "four_gram_abs"],
            metrics_labels: {"compression": "Compression", "length": "Length", "novelity": "Novelty",
                "rouge1": "Rouge 1", "rouge2": "Rouge 2", "rougeL": "Rouge L", "entities": "Entity Level Fact.",
                "relations": "Relation Level Fact.", "uni_gram_abs": "Unigram Abs.",
                "bi_gram_abs": "Bigram Abs.", "tri_gram_abs": "Trigram Abs.",
                "four_gram_abs": "4gram Abs."},
            metrics: this.props.metrics,
            scores: this.props.scores,
            loadModel: this.props.loadModel,
            selected_models: this.props.selected_models
        }
    }

    componentDidMount() {
        this.drawPanel();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.selected_models!==this.props.selected_models){
            this.setState({
            selected_models: this.props.selected_models
            })
        }
        this.drawPanel();
    }

    drawPanel = ()=>{
        const {metrics, scores, loadModel, all_metrics, metrics_labels, selected_models} = this.state;
        let max_vals = {}
        let min_vals = {}
        metrics.forEach(element => {max_vals[element] = Math.max(...scores.map(a=>{return a[element]}))});
        metrics.forEach(element => {min_vals[element] = Math.min(...scores.map(a=>{return a[element]}))});

        const node = ReactDOM.findDOMNode(this);
        const divWidth = node.getBoundingClientRect().width-20;

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 3, bottom: 10, left: 3};
        const width =  divWidth - margin.left - margin.right;
        let horizontal_labels_width = (metrics.includes("compression") || metrics.includes("uni_gram_abs") || metrics.includes("bi_gram_abs")
        || metrics.includes("tri_gram_abs")|| metrics.includes("four_gram_abs"))?70:50;
        horizontal_labels_width = (metrics.includes("entities") || metrics.includes("relations"))?90:horizontal_labels_width;
        const vertical_labels_height = 110;

        const cell_width = 18;
        const cell_height = 18;
        const paddingX = 2;
        const paddingY = 2;
        const labels_color = "#333333";
        const height = (cell_width + paddingY)*metrics.length + vertical_labels_height - margin.top - margin.bottom;

        d3.select("#all_models_scores").select("svg").remove();
        const svg = d3.select("#all_models_scores").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Build X scales and axis:
        let xAxis = d3.scaleLinear()
            .range([ 0, (cell_width+paddingX)*scores.length])
            .domain([0,scores.length]);

        // Tooltip
        let tooltip = d3.select("#tooltip_nav").append("div")
            .attr("class", "tooltip_navigation")
            .style("opacity", 0);


        // add labels
        let counter = 0;
        all_metrics.map((metric, ind)=>{
            if(metrics.includes(metric)){
                svg.append("text").attr("x", function(d) { return 0; })
                .attr("y", function(d) { return paddingY/2 + (cell_height+ paddingY)/2 + (counter)*(cell_height+ paddingY); })
                .text( function (d) { return metrics_labels[metric]; }) //.toUpperCase()
                .attr("font-family", "sans-serif")
                .attr("metric", metric)
                .attr("font-size", "9px")
                .attr("fill", labels_color)
                counter+=1;
            }
        });

        scores.map((value, idx) => {
            const y = 5 + (cell_height+paddingY)* metrics.length ;
            const xx = horizontal_labels_width + xAxis(idx)+cell_width/2;
            const highlight = selected_models.includes(value["model"])

            svg.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("model", value["model"])
                .text( value["model"].toUpperCase())
                .attr("font-family", "sans-serif")
                .attr("font-size", "9px")
                .attr("fill", highlight?"rgb(161, 14, 21)": labels_color)
                .style('text-anchor', 'end')
                .attr("transform", "translate("+xx+"," + y+ "), rotate(-45)");
        })

        const ColorWithNormalization = (higligt, v, min_val=0, max_val=1)=>{
            var scale = d3.scaleSequential(d3.interpolateBlues).domain([min_val*0.9, max_val*1.1]);
            var higlight_scale = d3.scaleSequential(d3.interpolateReds).domain([min_val*0.9, max_val*1.1]);
            return higligt?higlight_scale(v):scale(v)
        }

        // Draw HeatMap
        scores.map((value, idx) => {
            counter = 0;
            const highlight = selected_models.includes(value['model'])
            all_metrics.map((mod, ind)=>{ //metrics
                if(metrics.includes(mod)){
                    svg.append("rect")
                    .attr("class", "bars")
                    .attr("y", (counter * (cell_height + paddingY)))
                    .attr("x", horizontal_labels_width + xAxis(idx))
                    .attr("width", Math.max(cell_width - paddingX, 0) )
                    .attr("height", cell_height)
                    .attr("model_attr", value['model'])
                    .attr("metric_attr", mod)
                    .style("fill", ()=>{
                        return ColorWithNormalization(highlight, value[mod], min_vals[mod], max_vals[mod])
                    })
                    .on("click", function (s){
                        tooltip.html("").style("opacity", 0)
                        loadModel(value["model"]);
                    })
                    .on("mouseover", function(s) {
                        tooltip.html("<span class='uppercase'>"+ metrics_labels[mod]+ "</span><br>"+
                            " <b class='uppercase'>  "+value['model']+ "  <span class='ml-2 text-lg' >"+ value[mod]+ "</span></b>")
                            .style("left", s.x + "px")
                            .style("top", (s.pageY - 28) + "px")
                            .style("background-color", "rgb(10, 72, 141)")
                            .style("color", "#FFFFFF").style("opacity", .95);
                        // highlight the model and the metric
                        d3.selectAll("[metric='"+mod+ "']").attr("fill", "#DB0565").attr("font-weight", "bold");
                        d3.selectAll("[model='"+value['model']+ "']").attr("fill", "#db0565").attr("font-weight", "bold");
                        //d3.selectAll("[model_attr='"+value['model']+ "']").style("stroke", "#d69e2e");

                    })
                    .on("mouseout", function(s) {
                        tooltip.html("").style("opacity", 0);
                        d3.selectAll("[metric='"+mod+ "']").attr("fill", labels_color).attr("font-weight", "");
                        d3.selectAll("[model='"+value['model']+ "']").attr("fill", labels_color).attr("font-weight", "");
                        d3.selectAll("[model='"+value['model']+ "']").each(function (p, j) {
                            const highlight = selected_models.includes(this.getAttribute("model"))
                             d3.select(this).attr("fill", highlight?"rgb(161, 14, 21)": labels_color)
                        })
                        //d3.selectAll("[model_attr='"+value['model']+ "']").style("stroke", "")
                    })
                    counter+=1;
                }

            });
        })
    }

    metric_clicked =(metric)=> {
        let temp= this.state.metrics;
        if(temp.includes(metric)){
            const index = temp.indexOf(metric)
            if (index > -1)
              temp.splice(index, 1);
        }else
            temp.push(metric)
        this.setState({
            metrics: temp
        })
        this.props.updateSubMetrics(temp)
    }


    render() {
        const {metrics, all_metrics, metrics_labels} = this.state;
        return (
            <div>
                <div className="bg-white my-2 rounded px-4 py-1">
                    <div className="flex">
                        <Legend key="legend"
                                label_left="Low"
                                label_right="High"
                                id_="heatmap_legend"
                                interpolator={d3.interpolateBlues}
                        />
                        <div className="inline mt-1">
                            {all_metrics.map(m=>{
                                let clr = metrics.includes(m)?" bg-blue-700": " bg-gray-500"
                                return <span className={clr+" mr-2 text-white header_font text-xxs rounded px-1 cursor-pointer"}
                                onClick={()=>{this.metric_clicked(m)}}>{metrics_labels[m].toUpperCase()+ " "}</span>
                            })}
                        </div>
                    </div>
                    <div id="all_models_scores" />
                </div>
                <div id="tooltip_nav">
                </div>
            </div>
        )
    }
}

export default HeatMap;