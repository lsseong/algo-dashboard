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
  
 });


//**Need Position Data and current strategy to work
class StackedBarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphbar: [],
      graphReady:false,
    };
    this.storefirstcol = [];
    this.graphID = this.getUniqueID()
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

  createBarGraph=(id)=>{
    am4core.useTheme(this.mytheme);
    let chart = am4core.create(id, am4charts.XYChart); 
    am4core.options.minPolylineStep = 5;


    // Use only absolute numbers
    chart.numberFormatter.numberFormat = "#.#";
    chart.maskBullets = false;
    chart.responsive.enabled = true;

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "symbol";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.truncate = true;
    categoryAxis.maxWidth = 120;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.extraMin = 0.1;
    valueAxis.extraMax = 0.1;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.renderer.ticks.template.length = 5;
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
    valueAxis.renderer.minGridDistance =50;
    valueAxis.renderer.minLabelPosition = 0.01;
    valueAxis.renderer.maxLabelPosition = 0.99;

    // fix the range
    valueAxis.min = -100000;
    valueAxis.max = 100000;

    // guide lines
    var range = valueAxis.axisRanges.create();
    range.value = 50000;
    range.grid.stroke = am4core.color("#A96478");
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    var range2 = valueAxis.axisRanges.create();
    range2.value = -50000;
    range2.grid.stroke = am4core.color("#A96478");
    range2.grid.strokeWidth = 2;
    range2.grid.strokeOpacity = 1;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "position";
    series.dataFields.categoryY = "symbol";
    series.clustered = false;
    series.showOnInit = false;
    series.minBulletDistance = 20;

    //position label
    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueX}";
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;
    valueLabel.label.adapter.add("horizontalCenter", function(center, target) {
      if (!target.dataItem) {
        return center;
      }
      let values = target.dataItem.values;
      return values.valueX.value >=0
        ? "right"
        : "left";
    });

    valueLabel.label.adapter.add("dx", function(center,target) {
      let values = target.dataItem.values;
      return values.valueX.value >=0
        ? -5
        : 5;
    });



    let columnTemplate = series.columns.template;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.fill = am4core.color("#a8b3b7");
    columnTemplate.adapter.add("fill", function(fill, target) {
      if (target.dataItem && target.dataItem.valueX > 0) {
        return am4core.color("#78b711");
      } else {
        return fill
      }
    });

    series.events.on("validated", (ev)=> {
      this.resizeAxis(valueAxis);
    });

   
    this.chart = chart;
  
  }

  componentDidMount() {
    this.createBarGraph(this.graphID);
    
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentStrat !== prevProps.currentStrat) {
      // this.storefirstcol = [];
      this.chart.data = [];
    }

    
    if (this.props.type.length === 0) {
      // update due to selection event
      return;
    }

    if (this.props.type === prevProps.type) {
      // no change in bar data
      return;
    }

  
        let pt = this.chart.data.findIndex(i => i.symbol === this.props.type.symbol);
 

        if (pt >= 0) {
  
          this.chart.data[pt]['position'] = this.props.type.position;
          this.chart.invalidateData();
        } else {

          let item = {
            symbol: this.props.type.symbol,
            position: this.props.type.position
          }

          // this.storefirstcol.unshift(item);
          this.chart.addData(item)
        }

        


   
  }

  resizeAxis=(valueAxis)=>{
    if(this.chart.data.length !== 0){
      let maxvalue = this.chart.data[0].position;
      let minvalue = this.chart.data[0].position;
  
      this.chart.data.forEach((item,index)=>{
        if(item.position > maxvalue){
          maxvalue = item.position;
        }
        if(item.position < minvalue){
          minvalue = item.position;
        }
      })
  
      let maxAbs = Math.abs(maxvalue);
      let minAbs = Math.abs(minvalue);
  
      if(maxAbs > minAbs){
        valueAxis.min = -Math.abs(maxAbs-100);
        valueAxis.max = maxAbs + 100;
      }else{
        valueAxis.min = -Math.abs(minAbs-100);
        valueAxis.max = minAbs + 100;
      }
    }
   
  }

  getUniqueID = (prefix='sb')=>{
    //generate uniqueID
    var length = 10
    var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return prefix+result;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.graph} spacing={0}>
      <Grid item xs={12}>
       
        <div id={this.graphID} style={{ width: "100%", height: this.props.height }} />
        
          </Grid>
          </Grid>
   
    );
  }
}
StackedBarGraph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StackedBarGraph);
