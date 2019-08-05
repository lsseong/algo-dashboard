import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { withStyles ,Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  graph:{
    backgroundColor:"#303030",
    minHeight:"50vh",
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
    };

    this.dataCache = new Map();
    this.MAX_DATA_POINTS = 50;
    this.selectedSymbol = "";
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

    series.tooltipText = "OPEN: [bold]{openValueY}[/]\nHIGH: [bold]{highValueY}[/]\nLOW: [bold]{lowValueY}[/]\nCLOSE: [bold]{closeValueY}[/]\n";
    
    chart.cursor = new am4charts.XYCursor();


    this.chart = chart;
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentStrat !== prevProps.currentStrat) {
      // user select a different strategy - reset
      this.selections = [];
      this.chart.data = [];
      this.dataCache = new Map();
      this.setState({
        selections: [],
      });
      this.selectedSymbol = "";
    }

    if (this.props.bardata.length === 0) {
      // update due to selection event
      return;
    }

    if (this.props.bardata === prevProps.bardata) {
      // no change in bar data
      return;
    }

    // create bar object
    if(this.props.bardata!==prevProps.bardata && this.props.bardata.length!==0){
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
        if (this.selectedSymbol === "") {
          this.selectedSymbol = bar.name;
          }
        this.setState({ selections: selections });
      }
      array.push(bar);
  
      // maintain a maximum number of bars per symbol in the cache
      if (array.length > this.MAX_DATA_POINTS) {
        array.shift();
      }
      if (bar.name === this.selectedSymbol ) {
        // add to chart
        if (this.chart.data.length > this.MAX_DATA_POINTS) {
          this.chart.addData(bar,1);
        }else{
          this.chart.addData(bar);
        }
    }
    }
   
}
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  change = event => {
    this.chart.data = this.dataCache.get(event.target.value);
    this.selectedSymbol = event.target.value;
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
        {dropdown.length !== 0 && this.chart.data.length!==0  ? (
          <div>
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
          style={{ width: "100%", height: "50vh" }}
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
