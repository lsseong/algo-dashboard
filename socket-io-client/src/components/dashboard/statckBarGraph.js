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
 
 });


//**Need Position Data and current strategy to work
class StackedBarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphbar: []
    };
    this.storefirstcol = [];
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

    let chart = am4core.create("barchartdiv", am4charts.XYChart);

    chart.paddingRight = 40;

    //let title = chart.titles.create();
    //title.text = "POSITION GRAPH";
    //title.fontSize = 12;
    //title.marginBottom = 10;
    //title.fontWeight = 600;

    // Use only absolute numbers
    chart.numberFormatter.numberFormat = "#.#";

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "symbol";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

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

    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueX}";
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;
    valueLabel.label.horizontalCenter = "right";
    valueLabel.label.dx = -10;
    

    var columnTemplate = series.columns.template;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.adapter.add("fill", function(fill, target) {
      var dataItem = target.dataItem;
      if (dataItem.valueX > 0) {
        return am4core.color("#78b711");
      } else {
        return am4core.color("#a8b3b7");
      }
    });
    this.valueAxis= valueAxis;
    this.chart = chart;
  }
  componentDidUpdate(oldProps) {
    if (this.props.currentStrat !== oldProps.currentStrat) {
      this.storefirstcol = [];
      this.chart.data = [];
    }

    if (this.props.type.length !== 0) {
      var pt = this.storefirstcol.findIndex(i => i.symbol === this.props.type.symbol);

      if (this.props.type !== oldProps.type) {
        if (pt !== -1) {
          this.storefirstcol.splice(pt, 1, {
            symbol: this.props.type.symbol,
            position: this.props.type.position
          });
          this.chart.data = this.storefirstcol;
        } else if (pt < 0) {
          this.storefirstcol.unshift({
            symbol: this.props.type.symbol,
            position: this.props.type.position
          });
          this.chart.data = this.storefirstcol;
        }
        let maxvalue = this.storefirstcol[0].position;
        let minvalue = this.storefirstcol[0].position;
        this.storefirstcol.forEach((item,index)=>{
          if(item.position>maxvalue){
            maxvalue = item.position;
          }
          if(item.position<minvalue){
            minvalue = item.position;
          }
        })

        let maxAbs = Math.abs(maxvalue);
        let minAbs = Math.abs(minvalue);

        if(maxAbs>minAbs){
          this.valueAxis.min = -Math.abs(maxAbs);
          this.valueAxis.max = maxAbs;
        }else{
          this.valueAxis.min = -Math.abs(minAbs);
          this.valueAxis.max = minAbs;
        }

        this.chart.validateData();

        //console.log("current chart data "+this.chart.data);
      }
    }
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
          <div id="barchartdiv" style={{ width: "100%", height: "50vh" }} />
          </Grid>
      </Grid>
    );
  }
}
StackedBarGraph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StackedBarGraph);
