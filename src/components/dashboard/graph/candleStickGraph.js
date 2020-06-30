import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { withStyles ,Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
am4core.options.queue = true;
const styles = theme => ({
  graph:{
    backgroundColor:"#303030",
    minHeight:"30em",
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
    this.graphID = this.getUniqueID();
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

 updateValues = (dataItem)=> {
  
  if (dataItem !== undefined){
    am4core.array.each(["open", "close", "high", "low"], (key)=> {
      // console.log(key)
      let series = this.chart.series.getIndex(0);
      // console.log(series)
      let label = this.chart.map.getKey(key);

      // console.log(dataItem[key])
        
        label.text = this.chart.numberFormatter.format(dataItem[key + "ValueY"] );
        // console.log(label.text)
      if (dataItem.droppedFromOpen) {
        label.fill = series.dropFromOpenState.properties.fill;
      }
      else {
        label.fill = series.riseFromOpenState.properties.fill;
      }

    });
  }
  }
  updateYaxis =(dataItem)=>{
    if (dataItem !== undefined){
      let series = this.chart.series.getIndex(0);
      let yAxes = this.chart.yAxes.getIndex(0);
      let range  =yAxes.axisRanges.values[0]

      range.value = dataItem['closeValueY']
      range.label.text = dataItem['closeValueY']
      
      if (dataItem.droppedFromOpen) {
        range.label.background.fill = series.dropFromOpenState.properties.fill;
        range.grid.stroke = series.dropFromOpenState.properties.fill;
      }
      else {
        range.label.background.fill = series.riseFromOpenState.properties.fill;
        range.grid.stroke = series.riseFromOpenState.properties.fill;
      }
      range.label.zIndex = 10000;
    }
    
  }
  
  createLabel = (info,field, title="")=> {
    let titleLabel = info.createChild(am4core.Label);
    titleLabel.text = title + ":";
    titleLabel.marginRight = 5;
    titleLabel.minWidth = 10;
    titleLabel.fontSize = 12;

    let valueLabel = info.createChild(am4core.Label);
    valueLabel.id = field;
    valueLabel.text = "-";
    valueLabel.fontSize = 12;
    valueLabel.minWidth = 40;
    valueLabel.marginRight = 10;
  
  }

  createCSGraph=(id)=>{
    am4core.useTheme(this.mytheme);
    let chart = am4core.create(id, am4charts.XYChart);

    am4core.options.minPolylineStep = 5;

    chart.responsive.enabled = true;
    chart.data = [];
    

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance =50;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.renderer.line.strokeOpacity = 0.2;
    dateAxis.extraMax = 0.1; 

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;
    // valueAxis.renderer.labels.template.zIndex = -999;
    // valueAxis.zIndex = -998;
    // valueAxis.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#585858");


    var range = valueAxis.axisRanges.create();
    
    range.grid.strokeOpacity = 1;
    range.grid.strokeDasharray = "8,4";
    range.grid.above = true;
    range.label.fill = am4core.color("#000");
 
    range.label.padding(5, 10, 5, 10);
    range.opacity = 1;
 

    let series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "close";
    series.dataFields.openValueY = "open";
    series.dataFields.lowValueY = "low";
    series.dataFields.highValueY = "high";
    series.simplifiedProcessing = true;


    let info = chart.plotContainer.createChild(am4core.Container);
    info.width = 400;
    info.height = 30;
    info.padding(10, 10, 10, 10);
    info.background.fill = am4core.color("#000");
    info.background.fillOpacity = 0.1;
    info.layout = "grid";
    info.zIndex = 3;

    this.createLabel(info,"open", "OPEN");
    this.createLabel(info,"close", "CLOSE");
    this.createLabel(info,"high", "HIGH");
    this.createLabel(info,"low", "LOW");


    // series.tooltipText = "OPEN: [bold]{openValueY}[/]\nHIGH: [bold]{highValueY}[/]\nLOW: [bold]{lowValueY}[/]\nCLOSE: [bold]{closeValueY}[/]\n";
    chart.cursor = new am4charts.XYCursor();


    // chart.cursor.events.on("cursorpositionchanged", (ev)=> {
    //   var dataItem = dateAxis.getSeriesDataItem(
    //     series,
    //     dateAxis.toAxisPosition(chart.cursor.xPosition),
    //     true
    //   );
    
    //   this.updateValues(dataItem);
    // });
    // chart.cursor.events.on("hidden", (ev)=> {
    //   this.updateValues(series.dataItems.last);
    // });

    series.events.on("validated", (ev)=> {
      this.updateValues(series.dataItems.last);
      this.updateYaxis(series.dataItems.last);
    });

    this.chart = chart;

  /*! create reference to allow parent to toggle between securities by returning graphID and this(the object)*/
   this.props.onRef(this.graphID,this)
  }

  componentDidMount() {
   this.createCSGraph(this.graphID)
  //  this.props.ref(this.graphID)
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentStrat !== prevProps.currentStrat) {
      // user select a different strategy - reset
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

      var newDate = Date.parse(this.props.bardata.time);
      var bar = {
        date: newDate,
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
        // console.log(bar)
       
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
    
    // console.log(this.chart.data)
    
   
}
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  changeSecurity=(value)=>{
    this.chart.data = this.dataCache.get(value);
    this.selectedSymbol = value;
    // console.log("change bar " + value);
  }
  getUniqueID = (prefix='cs')=>{
    var length = 10
    var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return prefix+result;
  }

  // change = event => {
  //   this.chart.data = this.dataCache.get(event.target.value);
  //   this.selectedSymbol = event.target.value;
  //   console.log("change bar " + event.target.value);
  // };

  render() {
    // create a drop down menu
    const {classes} = this.props;

    // const dropdown = this.state.selections.map((object, i) => (
    //   <option key={i} value={object}>
    //     {object}
    //   </option>
    // ));

    return (
      <div style = {{width:"100%",height:"100%"}}>
      <div style={{ width: "100%", height: this.props.height }}>
      <Grid container className={classes.graph} spacing={0}>
        {/* <Grid item xs={12} className={classes.dropdown}>
        {dropdown.length !== 0 && this.chart.data.length!==0  ? (
          <div>
            <select id="stock" onChange={this.change}>
              {dropdown}
            </select>
          </div>
        ) : null
        }
        </Grid> */}

        <Grid item xs={12}>
        <div
          id={this.graphID}
          style={{ width: "100%", height: this.props.height }}
        />
        </Grid>

      </Grid>
      </div>
      </div>
    );
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);
