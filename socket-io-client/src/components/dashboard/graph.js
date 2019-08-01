import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { withStyles ,Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  graph:{
    backgroundColor:"#404040",
  },
  dropdown:{
 
    padding:"10px",
  }
 
 });

//**Need Bar Data and current strategy to work
class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections: [],
      selectedSymbol: ""
    };

    this.dataCache = new Map();
    this.MAX_DATA_POINTS = 30;
  }

  mytheme = (target) =>{
    if(target instanceof am4core.InterfaceColorSet){
      target.setFor("text" ,am4core.color("white"));
      target.setFor("grid" ,am4core.color("white"));
      target.setFor("fill" ,am4core.color("#202020").lighten(-0.5));
      target.setFor("background" ,am4core.color("#202020").lighten(-0.5));
      target.setFor("secondaryButton" ,am4core.color("#202020").lighten(-0.5));
      target.setFor("primaryButton" ,am4core.color("#202020").lighten(-0.5));
  
    }
  }

  componentDidMount() {
    am4core.useTheme(this.mytheme);
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    am4core.options.minPolylineStep = 5;

    
    chart.data = [];

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance =50;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = "time";
    series.dataFields.valueY = "close";
    series.dataFields.openValueY = "open";
    series.dataFields.lowValueY = "low";
    series.dataFields.highValueY = "high";
    series.simplifiedProcessing = true;

    this.chart = chart;
  }

  componentDidUpdate(oldProps) {
    if (this.props.currentStrat !== oldProps.currentStrat) {
      // user select a different strategy - reset
      this.selections = [];
      this.chart.data = [];
      this.setState({
        selections: [],
        selectedSymbol: ""
      });
    }

    if (this.props.bardata.length === 0) {
      // update due to selection event
      return;
    }

    if (this.props.bardata === oldProps.bardata) {
      // no change in bar data
      return;
    }

    // create bar object
    var newDate = new Date(this.props.bardata.time);
    var bar = {
      time: newDate,
      name: this.props.bardata.symbol,
      close: this.props.bardata.close,
      open: this.props.bardata.open,
      low: this.props.bardata.low,
      high: this.props.bardata.high
    };

    // add to cache
    var array = this.dataCache.get(this.props.bardata.symbol);
    if (array == null) {
      // first time seeing this security
      array = [];

      // initialize array with empty data

      this.dataCache.set(bar.name, array);

      // update state
      const selections = this.state.selections;
      selections.push(bar.name);
      this.setState({ selections: selections }, () => {
        // callback to set a default security to chart
        if (this.state.selectedSymbol === "") {
          this.setState({ selectedSymbol: this.state.selections[0] });
        }
      });
    }
    array.push(bar);

    // maintain a maximum number of bars per symbol in the cache
    if (array.length > this.MAX_DATA_POINTS) {
      array.shift();
    }

    if (bar.name === this.state.selectedSymbol) {
      // add to chart
      if (this.chart.data.length > this.MAX_DATA_POINTS) {
        this.chart.data.shift();
      }

      this.chart.data.push(bar);
      this.chart.validateData();
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  change = event => {
    this.chart.data = this.dataCache.get(event.target.value);
    this.setState({ selectedSymbol: event.target.value });
    console.log("change bar " + event.target.value);
  };

  render() {
    // create a drop down menu
    const {classes} = this.props;

    const dropdown = this.state.selections.map((object, i) => (
      <option key={i} value={object}>
        {object}
      </option>
    ));

    return (

      <Grid container className={classes.graph} spacing={0}>
        <Grid item xs={12} className={classes.dropdown}>
        {dropdown.length !== 0 ? (
          <div className="col-md-12">
            <select id="stock" onChange={this.change}>
              {dropdown}
            </select>
          </div>
        ) : null
        }
        </Grid>

        <Grid item xs={12}>
        <div
          id="chartdiv"
          style={{ width: "100%", height: "300px" }}
        />
        </Grid>

      </Grid>
    );
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);
