import React, { Component } from 'react';
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
      graphbar:[],
      
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
    let chart = am4core.create("chartdiv2", am4charts.XYChart);

    
    am4core.options.minPolylineStep = 5;

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
    // eslint-disable-next-line
    series.tooltipText = "Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}";
    

    chart.cursor = new am4charts.XYCursor();
   
    this.chart = chart;
    

  
  }

  componentDidUpdate(oldProps){
 
    if(this.props.currentStrat!==oldProps.currentStrat){
      this.storefirstcol=[];
      this.chart.data = [];
      this.setState({
        graphbar:[],
      })
    }
  
    if(this.props.bardata.length!==0){
      var pt = this.storefirstcol.findIndex(i => i === this.props.bardata.symbol); 
      if(this.storefirstcol.length===0){
        this.storefirstcol.unshift(this.props.bardata.symbol);
        var newDate = new Date(this.props.bardata.time);
        this.chart.data.push( {
          time: newDate,
          name:this.props.bardata.symbol,
          close: this.props.bardata.close,
          open:this.props.bardata.open,
          low:this.props.bardata.low,
          high:this.props.bardata.high,
        } );
        this.chart.validateData();
     
       
      }else if(this.storefirstcol.length>0){
        if(pt===-1){
          this.storefirstcol.push(this.props.bardata.symbol);
        }

      }

    if(this.props.bardata!==oldProps.bardata&&this.props.bardata.symbol===this.storefirstcol[0]){
     
        if(this.chart.data.length>20){
          this.chart.data.shift();
        }
        // add new one at the end
        newDate = new Date(this.props.bardata.time);
        this.chart.data.push( {
          time: newDate,
          name:this.props.bardata.symbol,
          close: this.props.bardata.close,
          open:this.props.bardata.open,
          low:this.props.bardata.low,
          high:this.props.bardata.high,
        } );
      
        this.chart.validateData();
     
        

      }
    }
  }
        
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  change =(event)=>{
    this.storefirstcol=[];
    this.chart.data = [];
     this.setState({
      graphbar: event.target.value,
                   });

                   console.log("change bar "+event.target.value);
   
   }
  render() {
    const { classes } = this.props;
    const dropdown = this.storefirstcol.map((object,i)=>
    <option key={i} value={object}>{object}</option>
   )
   
    return (
      <Grid container className={classes.graph} spacing={0}>
        <Grid item xs={12} className={classes.dropdown}>
    
      {dropdown.length!==0
      ? <div className="col-md-12">
     
      <select id="stock" onChange={this.change}>
       {dropdown}
      </select>
      </div>
      :null
      }
       </Grid>
       <Grid item xs={12}>
    
      <div className="small" id="chartdiv2" style={{ width: "100%", height: "280px" }}></div>
      </Grid>

      </Grid>
    );
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);