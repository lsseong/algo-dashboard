import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);
//**Need Bar Data and current strategy to work
export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphbar:[],
      
    };
    this.storefirstcol = [];
  }

  componentDidMount() {
   
    let chart = am4core.create("chartdiv2", am4charts.XYChart);

    chart.paddingRight = 40;
  

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;


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
    const dropdown = this.storefirstcol.map((object,i)=>
    <option key={i} value={object}>{object}</option>
   )
   
    return (
      <div className="small">
    
      {dropdown.length!==0
      ? <div className="col-md-12">
     
      <select id="stock" onChange={this.change}>
       {dropdown}
      </select>
      </div>
      :<div><br/></div>
      }
     
      <div className="small">
    
      <div className="small" id="chartdiv2" style={{ width: "100%", height: "280px" }}></div>
      </div>
 
      </div>
    );
  }
}
