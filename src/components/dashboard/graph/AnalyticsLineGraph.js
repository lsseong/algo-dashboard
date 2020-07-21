import React, { Component } from "react";
import * as d3 from "d3";
import { withStyles, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const styles = (theme) => ({
  graph: {
    backgroundColor: "#303030",
    minHeight: "30em",
  },
});

class AnalyticsChart extends Component {
  constructor(props) {
    super(props);

    this.margin = { top: 20, right: 60, bottom: 40, left: 60 };
    this.MAX_UNITS = 10;
    this.bgColor = "#303030";
    this.textColor = "white";
    this.maxDate = new Map();
    this.minDate = new Map();
    this.maxY = new Map();
    this.minY = new Map();
    this.maxItem = new Map();
    this.graphID = this.getUniqueID();
  }

  initChart = (id, analytics = []) => {
    // get height and width of div that the graph is nested in

    const divHeight = document.getElementById(id).offsetHeight;
    const divWidth = document.getElementById(id).offsetWidth;

    //set main graph height and width

    this.screen_height = divHeight - this.margin.top - this.margin.bottom;
    this.screen_width = divWidth - this.margin.left - this.margin.right;

    //set font size dynamically
    this.fontSize = divWidth * 0.01;

    //create svg
    this.svg = d3
      .select("div#" + id)
      .append("svg")
      .attr("width", divWidth)
      .attr("height", divHeight)
      .attr("border", 1)
      .style("background-color", this.bgColor)
      //   .style("padding", "10px")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    //update chart
    this.updateChart(this.svg, analytics);
  };

  updateAxes = (minDate, maxDate, minY, maxY, numItem) => {
    this.updateXAxis(minDate, maxDate, numItem);
    this.updateYAxis(minY, maxY);
  };

  updateChart = (svg, analytics) => {
    //get Min and Max Value to declare domain and range for x and y axis
    let haveItem = false;

    if (
      analytics !== undefined &&
      analytics !== null &&
      analytics.length !== 0
    ) {
      const allSignalKeys = [...analytics.keys()];

      allSignalKeys.forEach((key, index) => {
        let analyticsdata = analytics.get(key);

        this.maxDate.set(key, this.getMaxObjectValue(analyticsdata, "time"));
        this.minDate.set(key, this.getMinObjectValue(analyticsdata, "time"));

        this.maxY.set(key, this.getMaxObjectValue(analyticsdata, "value"));
        this.minY.set(key, this.getMinObjectValue(analyticsdata, "value"));

        this.maxItem.set(key, analyticsdata.length);

        haveItem = true;
      });
    }

    //init Axes
    this.initAxes(this.svg);

    //update Axes
    if (haveItem === true) {
      const maxDate = this.getMaxValue([...this.maxDate.values()]);
      const maxY = this.getMaxValue([...this.maxY.values()]);
      const minDate = this.getMinValue([...this.minDate.values()]);
      const minY = this.getMinValue([...this.minY.values()]);
      const numItem = this.getMaxValue([...this.maxItem.values()]);

      this.updateAxes(minDate, maxDate, minY, maxY, numItem);

      //draw items

      this.updateAnalytics(svg, analytics, this.xAxisRange, this.yAxisRange);
    }
  };

  initAxes = (svg) => {
    const minDate = new Date();
    const maxDate = this.addSeconds(minDate, 1);
    const minY = 0;
    const maxY = 1;
    const numItem = 1;

    //x axis

    this.drawXaxis(svg, minDate, maxDate, numItem);

    //y axis range

    //Draw yAxis and guide lines
    this.drawYaxis(svg, minY, maxY);
  };

  updateXAxis = (minDate, maxDate, numItem, guidelines = true, ticks = 15) => {
    const X_DATE_SPACING = numItem > 2 ? Math.floor(Math.log(numItem)) : 1;

    const timeMax = this.addSeconds(maxDate, X_DATE_SPACING);

    const timeMin = this.addSeconds(minDate, -1);

    const xBuffer = numItem + X_DATE_SPACING;

    this.xBandScale.domain(d3.range(0, xBuffer));

    this.xAxisRange.domain([timeMin, timeMax]);
    this.xAxis.call(
      d3
        .axisBottom(this.xAxisRange)
        .ticks(3)
        .tickFormat(d3.timeFormat("(%m/%d) %H:%M:%S"))
    );

    if (guidelines === true && isNaN(ticks) === false) {
      this.xGuideLines.call(
        this.makeGuidelines("x", this.xAxisRange, ticks)
          .tickSize(-this.screen_height)
          .tickFormat("")
      );
    }
  };

  updateYAxis = (minY, maxY, guidelines = true, ticks = 5) => {
    const yBuffer = (maxY - minY) / 4;
    const yMinWithBufer = minY - yBuffer;
    const yMaxwithBuffer = maxY + yBuffer;

    this.yAxisRange.domain([yMinWithBufer, yMaxwithBuffer]);

    this.yAxis.call(d3.axisRight(this.yAxisRange));

    if (guidelines === true && isNaN(ticks) === false) {
      this.yGuideLines.call(
        this.makeGuidelines("y", this.yAxisRange, ticks)
          .tickSize(-this.screen_width)
          .tickFormat("")
      );
    }
  };

  updateAnalytics = (svg, analytics, xAxisRange, yAxisRange) => {
    if (
      analytics !== undefined &&
      analytics !== null &&
      analytics.length !== 0
    ) {
      this.drawAllSignalLines(
        svg,
        analytics,
        xAxisRange,
        yAxisRange,
        "time",
        "value"
      );
    }
  };

  getMaxObjectValue = (data, props) => {
    const max = d3.max(data.map((d) => d[props]));
    return max;
  };

  getMinObjectValue = (data, props) => {
    const min = d3.min(data.map((d) => d[props]));
    return min;
  };

  getMaxValue = (array) => {
    if (array.length === 0) {
      return;
    }

    let max = array[0];
    if (array.length === 1) {
      return max;
    } else {
      array.forEach((value) => {
        if (value > max) {
          max = value;
        }
      });
    }

    return max;
  };

  getMinValue = (array) => {
    if (array.length === 0) {
      return;
    }

    let min = array[0];
    if (array.length === 1) {
      return min;
    } else {
      array.forEach((value) => {
        if (value < min) {
          min = value;
        }
      });
    }

    return min;
  };

  drawXaxis = (
    svg,
    minDate,
    maxDate,
    numItem,
    guidelines = true,
    ticks = 15
  ) => {
    const X_DATE_SPACING = numItem > 2 ? Math.floor(Math.log(numItem)) : 2;

    const timeMax = this.addSeconds(maxDate, X_DATE_SPACING);

    const timeMin = this.addSeconds(minDate, -1);

    const xBuffer = numItem + X_DATE_SPACING;

    this.xBandScale = d3
      .scaleBand()
      .domain(d3.range(0, xBuffer))
      .range([0, this.screen_width])
      .paddingInner(0.5);

    this.xAxisRange = d3
      .scaleTime()
      .domain([timeMin, timeMax])
      .rangeRound([0, this.screen_width])
      .nice();

    this.xAxis = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.screen_height + ")")
      .style("color", this.textColor)
      .call(
        d3
          .axisBottom(this.xAxisRange)
          .ticks(3)
          .tickFormat(d3.timeFormat("(%m/%d) %H:%M:%S"))
      );

    if (guidelines === true && isNaN(ticks) === false) {
      this.xGuideLines = svg
        .append("g")
        .attr("class", "x-grid axis")
        .attr("transform", "translate(0," + this.screen_height + ")")
        .call(
          this.makeGuidelines("x", this.xAxisRange, ticks)
            .tickSize(-this.screen_height)
            .tickFormat("")
        )
        .style("color", "lightgrey")
        .style("opacity", 0.1)
        .style("stroke-width", 1);
    }
  };

  drawYaxis = (svg, minY, maxY, guidelines = true, ticks = 5) => {
    const yMinWithBufer = minY * 0.01;
    const yMaxwithBuffer = maxY * 1.2;
    this.yAxisRange = d3
      .scaleLinear()
      .domain([yMinWithBufer, yMaxwithBuffer])
      .range([this.screen_height, 0])
      .nice();
    this.yAxis = svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate( " + this.screen_width + ", 0 )") // move the axis to right side using translate screen width
      .style("color", this.textColor)
      .call(d3.axisRight(this.yAxisRange));

    if (guidelines === true && isNaN(ticks) === false) {
      this.yGuideLines = svg
        .append("g")
        .attr("class", "y-grid axis")
        .call(
          this.makeGuidelines("y", this.yAxisRange, ticks)
            .tickSize(-this.screen_width)
            .tickFormat("")
        )
        .style("color", "lightgrey")
        .style("opacity", 0.1)
        .style("stroke-width", 1);
    }
  };

  makeGuidelines = (axisType, range, ticks) => {
    if (axisType === "y") {
      return d3.axisLeft(range).ticks(ticks);
    } else if (axisType === "x") {
      return d3.axisBottom(range).ticks(ticks);
    }
    return null;
  };

  createVerticalBars = (
    svg,
    data,
    xRange,
    xBandWidth,
    xValueName,
    yValueName,
    itemName
  ) => {
    const Y_UNIT_LENGTH = this.screen_height / this.MAX_UNITS / 8;
    const maxValue = d3.max(data.map((d) => d[yValueName]));

    svg
      .append("rect")
      .attr("class", itemName)
      .attr("x", (d, i) => xRange(d[xValueName]) - xBandWidth / 2)
      .attr(
        "y",
        (d, i) =>
          this.screen_height -
          this.scaler(maxValue, d[yValueName]) * Y_UNIT_LENGTH
      )
      .attr(
        "height",
        (d, i) => this.scaler(maxValue, d[yValueName]) * Y_UNIT_LENGTH
      )
      .attr("width", xBandWidth)
      .style("stroke", "white")
      .style("opacity", 0.1)
      .style("stroke-width", 1)
      .attr("fill", "orange");
  };

  drawAllSignalLines = (svg, data, xRange, yRange, xValueName, yValueName) => {
    const allSignalKeys = [...data.keys()];
    const radius = 3;
    //exit, remove
    svg.selectAll(".signal_lines").remove();

    //define group and join
    //enter
    var signal_lines_group = svg.append("g").attr("class", "signal_lines");
    //append - as many items as you need

    let colourScheme = d3.schemeSet1.concat(d3.schemeSet2, d3.schemeSet3);

    allSignalKeys.forEach((key, index) => {
      if (index >= colourScheme.length) {
        console.log("index out of bounds", "max", colourScheme.length);
      }
      var line = d3
        .line()
        .x((d, i) => {
          return xRange(d[xValueName]);
        }) // set the x values for the line generator
        .y((d) => {
          return yRange(d[yValueName]);
        });

      let analyticsdata = data.get(key);

      // var enter = svg.enter()
      //             .append("g").attr("class","signal_line_"+key)

      let slg = signal_lines_group
        .append("g")
        .attr("class", "signal_line_" + index);

      slg
        .append("g")
        .attr("class", "line_" + index)
        .selectAll(".smaline")
        .data([analyticsdata])
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", colourScheme[index % colourScheme.length])
        .attr("stroke-width", 1.5)
        .attr("class", "line")
        // .attr('shape-rendering','geometricPrecision')
        .attr("d", line);

      // Add the scatterplot
      slg
        .append("g")
        .attr("class", "point" + index)
        .selectAll("dot")
        .data(analyticsdata)
        .enter()
        .append("circle")
        .attr("fill", colourScheme[index % colourScheme.length])
        .attr("r", radius)
        .attr("cx", function (d, i) {
          return xRange(d[xValueName]);
        })
        .attr("cy", function (d, i) {
          return yRange(d[yValueName]);
        });
    });
    this.updateSignalLegend(this.svg, allSignalKeys, colourScheme);
  };

  updateSignalLegend = (svg, data, colourScheme) => {
    svg.selectAll(".signal_legends").remove();

    // let legendUnitSize = this.screen_width * 0.1;
    // let startRange = this.screen_width / 2 - data.length * legendUnitSize * 0.5;

    // let endRange = this.screen_width / 2 + data.length * legendUnitSize * 0.5;

    // if (startRange < 0) {
    //   startRange = 0;
    // }

    // if (endRange > this.screen_width) {
    //   endRange = this.screen_width;
    // }

    // var legendBand = d3.scalePoint().domain(data).range([startRange, endRange]);

    var legends_group = svg
      .append("foreignObject")
      .attr("class", "signal_legends")
      .attr("x", -this.margin.left)
      .attr("width", this.margin.left * 0.9)
      .attr("height", this.screen_height)
      .style("margin", "0px")
      .style("padding", "0px")
      .style("overflow-x", "auto")
      .style("overflow-y", "auto")

      .append("xhtml:div")

      .style("background-color", this.bgColor)
      .selectAll(".signal_legends")
      .data(data);
    //exit, remove
    // candlesticks_group.exit().remove();
    //enter

    var legends_enter = legends_group
      .enter()
      .append("ul")
      .style("list-style-position", "inside")
      .style("margin", 0)
      .style("padding", 0)
      .attr("class", "legend");
    //   svg
    //   .append("foreignObject")
    //   .attr("x", 0)
    //   .attr("y", this.screen_height)
    //   .attr("width", 480)
    //   .attr("height", 500)
    //   .append("xhtml:body")
    //   .style("background-color", "white")
    //   .style("font", "14px 'Helvetica Neue'")
    //   .html("test");

    //append - as many items connected to each row in data as you want

    legends_enter.append("li").attr("class", "legend_text");

    // candlesticks_enter.append("line").attr("class","data_group");
    //merge
    legends_group = legends_group.merge(legends_enter);

    legends_group
      .select(".legend_text")
      .style("color", (d, i) => colourScheme[i % colourScheme.length])
      .style("font-size", this.fontSize + "px")
      .html((d, i) => d.toUpperCase());
  };

  drawSignalPoints = (svg, data, xaxisrange, xValue, signalValue) => {
    svg.selectAll(".signal_points").remove();

    // define group and join
    var signal_group = svg
      .append("g")
      .attr("class", "signal_points")
      .selectAll(".signal_points")
      .data(data);
    //exit, remove

    //enter
    var enter = signal_group.enter().append("g").attr("class", "circle_points");
    //append - as many items as you need
    enter.append("circle").attr("class", "node_circle");

    //merge
    signal_group = signal_group.merge(enter);

    signal_group
      .select(".node_circle")
      .attr("fill", (d) =>
        d[signalValue] > 0 ? "lime" : d[signalValue] < 0 ? "red" : "white"
      )
      .attr("r", 3)
      .attr("cx", function (d, i) {
        return xaxisrange(d[xValue]);
      })
      .attr("cy", this.screen_height);
  };

  addSeconds = (date, seconds) => {
    var result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  };

  scaler = (max, item) => {
    // console.log(min,max,position)
    const min = 0;
    const MAX_SCALE = this.MAX_UNITS;
    const MIN_SCALE = 0;
    let scaledposition = this.MAX_UNITS;

    if (item < 0) {
      return;
    }

    if (max === 0) {
      return 0;
    }

    let absposition = Math.abs(item);
    scaledposition =
      ((absposition - min) / (max - min)) * (MAX_SCALE - MIN_SCALE) + MIN_SCALE;

    return scaledposition;
  };

  componentDidMount() {
    this.initChart(this.graphID, this.props.analytics);
  }

  componentDidUpdate(prevProps) {
    //TODO clear Map when strategy change or security change

    if (
      this.props.analytics === undefined ||
      this.props.analytics === null ||
      this.props.analytics.length === 0
    ) {
      return;
    }

    const allSignalKeys = [...this.props.analytics.keys()];

    allSignalKeys.forEach((key, index) => {
      let analyticsdata = this.props.analytics.get(key);

      this.maxDate.set(key, this.getMaxObjectValue(analyticsdata, "time"));
      this.minDate.set(key, this.getMinObjectValue(analyticsdata, "time"));

      this.maxY.set(key, this.getMaxObjectValue(analyticsdata, "value"));
      this.minY.set(key, this.getMinObjectValue(analyticsdata, "value"));

      this.maxItem.set(key, analyticsdata.length);
    });

    //update Axes

    let maxDate = this.getMaxValue([...this.maxDate.values()]);
    let maxY = this.getMaxValue([...this.maxY.values()]);
    let minDate = this.getMinValue([...this.minDate.values()]);
    let minY = this.getMinValue([...this.minY.values()]);
    let numItem = this.getMaxValue([...this.maxItem.values()]);

    this.updateAxes(minDate, maxDate, minY, maxY, numItem);

    this.updateAnalytics(
      this.svg,
      this.props.analytics,
      this.xAxisRange,
      this.yAxisRange
    );
  }
  getUniqueID = (prefix = "al") => {
    //generate uniqueID
    var length = 10;
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return prefix + result;
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.graph} spacing={0}>
        <Grid item xs={12}>
          <div
            id={this.graphID}
            style={{
              width: "100%",
              height: this.props.height,
              backgroundColor: "grey",
            }}
          ></div>
        </Grid>
      </Grid>
    );
  }
}

AnalyticsChart.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnalyticsChart);
