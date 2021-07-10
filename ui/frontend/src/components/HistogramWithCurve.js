import React from 'react';
import '../assets/main.css';
import * as d3 from 'd3';
import ReactDOM from "react-dom";


class HistogramWithCurve extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }


    draw = ()=>{
        const {title, scores, uid} = this.props;
        const node = ReactDOM.findDOMNode(this);
        const divWidth = node.getBoundingClientRect().width-20;

        const max = scores.max_score;

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 10, bottom: 20, left: 45};
        const width =  divWidth - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        d3.select("#histogram_"+uid).select("svg").remove();
        const svg = d3.select("#histogram_"+uid).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");;


        var x = d3.scaleLinear()
            .domain([0, max])
            .range([0, width]); //.range([margin.left, width - margin.right]);

        var y2 = d3.scaleLinear()
            .domain([0, 0.1])
            .range([height, 0]);//.range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        var bins = scores.bins;
        var density = scores.density;

        var y = d3.scaleLinear()
            .domain([0, d3.max(bins, function(d) { return d.length_; })])
            .range([height, 0]); //.range([height - margin.bottom, margin.top]);

        svg.append("g")
            //.attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(y));

          svg.insert("g", "*")
              .attr("fill", "#2b6cb0")
            .selectAll("rect")
            .data(bins)
            .enter().append("rect")
              .attr("x", function(d) { return x(d.x0) + 1; })
              .attr("y", function(d) { return y(d.length_); })
              .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
              .attr("height", function(d) { return y(0) - y(d.length_); });

          svg.append("path")
              .datum(density)
              .attr("fill", "none")
              .attr("stroke", "#FF3333")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("d",  d3.line()
                  .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y2(d[1]); }));

    }


    render() {
        const {uid, title} = this.props
        return (
            <div>
                <div id={"histogram_"+uid} className="bg-white my-2 rounded px-4 py-1">
                </div>
                <div className="text-center text-xs font-semibold text-blue-800" >{title}</div>
            </div>
        )
    }
}

export default HistogramWithCurve;