import React from "react";
import * as d3 from "d3";
import { postData } from '../utils';

class LineChart extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            newData: null
        }
    }

    componentDidMount() {
        this.renderLineChart(this.props.payload);
    }

    componentDidUpdate(prevProps, prevState){
        if ( this.state.newData ) {
            const elem = document.querySelector('#LineChart svg');
            elem.parentNode.removeChild(elem);
            const payload = prevProps.payload.concat(this.state.newData);
            this.renderLineChart(payload);
        }
    }

    renderLineChart(payload) {
        if(!payload) return;
        d3.selectAll(".dot").remove();
        let data = payload;
        let width = 500;
        let height = 300;
        let margin = 50;
        let duration = 250;

        let lineOpacity = "0.25";
        let lineOpacityHover = "0.85";
        let otherLinesOpacityHover = "0.1";
        let lineStroke = "1.5px";
        let lineStrokeHover = "2.5px";

        let circleOpacity = "0.85";
        let circleOpacityOnLineHover = "0.25";
        let circleRadius = 3;
        let circleRadiusHover = 6;

        data.forEach(function (d) {
            d.x = new Date(d.x);
            d.y = +d.y;
        });

        /* Scale */
        let xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.x))
            .range([0, width - margin]);

        let yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height - margin, 0]);

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        /* Add SVG */
        let svg = d3
            .select("#LineChart")
            .append("svg")
            .attr("width", width + margin + "px")
            .attr("height", height + margin + "px")
            .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);

        /* Add line into SVG */
        let line = d3
            .line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        let lines = svg.append("g").attr("class", "lines");

        lines
            .selectAll(".line-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "line-group")
            .append("path")
            .attr("class", "line")
            .attr("d", () => line(data))
            .style("stroke", (d, i) => color(i))
            .style("opacity", lineOpacity)
            .on("mouseover", function (d) {
                d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
                d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
                d3.select(this)
                    .style("opacity", lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function (d) {
                d3.selectAll(".line").style("opacity", lineOpacity);
                d3.selectAll(".circle").style("opacity", circleOpacity);
                d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
            });

        /* Add circles in the line */
        lines
            .selectAll("circle-group")
            .data(data)
            .enter()
            .append("g")
            // .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "circle")
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.y}`)
                    .attr("x", d => xScale(d.x) + 5)
                    .attr("y", d => yScale(d.y) - 10);
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text")
                    .remove();
            })
            .append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", circleRadius)
            .style("opacity", circleOpacity)
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadiusHover);
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadius);
            });


        /* Add Axis into SVG */
        let xAxis = d3.axisBottom(xScale).ticks(5);
        let yAxis = d3.axisLeft(yScale).ticks(5);

        svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height - margin})`)
            .call(xAxis)
            .append("text")
            .attr("x", width - 60)
            .attr("y", 30)
            .attr("fill", "#000")
            .text("Time");

        svg
            .append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Values");
    }

    handleUpdate = (e) => {
        e.preventDefault()
        let x = new Date(this.refs.xValue.value).toUTCString()
        let y = parseInt(this.refs.yValue.value)
        let formData = {x, y};
        postData(formData).then(response => {
            this.setState({
                newData: formData
            });
            this.refs.xValue.value = '';
            this.refs.yValue.value = '';
        });
    }

    render() {
        return (
            <div className="LineChart">
                <div id="LineChart" />
                <form onSubmit={this.handleUpdate}>
                    <h3>Add new values</h3>
                    <input type="date" ref="xValue" placeholder="Enter Time" />
                    <input type="number" ref="yValue" placeholder="Enter Value" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default LineChart;
