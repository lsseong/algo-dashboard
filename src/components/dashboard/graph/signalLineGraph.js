import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { withStyles ,Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    graph:{
      backgroundColor:"#303030",
      
    },
    dropdown:{
   
      padding:"10px",
    }
   
   });

class SignalLineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selections: [],
        
        };
        this.selectedSymbol = "";
        this.dataCache = new Map();
        this.MAX_DATA_POINTS = 50;
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
      let chart = am4core.create(this.props.id, am4charts.XYChart);

      
      am4core.options.minPolylineStep = 5;

      chart.responsive.enabled = true;
      chart.data = []
   
      
      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance =50;
      dateAxis.renderer.minLabelPosition = 0.01;
      dateAxis.renderer.maxLabelPosition = 0.99;

      chart.colors.list = [
        am4core.color("#845EC2"),
        am4core.color("#D65DB1"),
        am4core.color("#FF6F91"),
        am4core.color("#FF9671"),
        am4core.color("#FFC75F"),
        am4core.color("#F9F871")
      ];

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      // Create series
    
      
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "sma10";
      series.dataFields.dateX = "time";
      series.name = "SMA10";
      series.tooltipText = "[bold font-size: 15]{valueY}[/]";
      series.legendSettings.itemValueText = "{valueY}";


      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 3;
      bullet.circle.strokeWidth = 2;
      bullet.circle.fill = am4core.color("#fff");
      
      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "sma20";
      series2.dataFields.dateX = "time";
      series2.name = "SMA20";
      series2.tooltipText = "[bold font-size: 15]{valueY}[/]";
      series2.legendSettings.itemValueText = "{valueY}";
      
      let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.radius = 3;
      bullet2.circle.strokeWidth = 2;
      bullet2.circle.fill = am4core.color("#fff");
      
      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      
      
      // Add legend
      chart.legend = new am4charts.Legend();



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
    
        if (this.props.signaldata.length === 0) {
          // update due to selection event
          return;
        }
    
        if (this.props.signaldata === prevProps.signaldata) {
          // no change in bar data
          return;
        }
    
        // create bar object
        if(this.props.signaldata!==prevProps.signaldata && this.props.signaldata.length!==0){
          var newDate = new Date();


          var signal = {
            time: newDate,
            signalname: this.props.signaldata.symbol,
            signal: this.props.signaldata.signal,
            commentary: this.props.signaldata.commentary,
            sma10: this.props.signaldata.analytics.sma10,
            sma20: this.props.signaldata.analytics.sma20,
          };
          
          // add to cache
          var array = this.dataCache.get(this.props.signaldata.symbol);
          if (array == null) {
            // first time seeing this security
            array = [];

            //create line series for the first time dynamically
            // var analyticsItems = this.props.signaldata.analytics;

            // for (const [key, value] of Object.entries(analyticsItems)) {
            //   console.log(key, value);
            //   this.addSeries(key)
            // }
      
            // initialize array with empty data
      
            this.dataCache.set(signal.signalname, array);
      
            // update state
            const selections = this.state.selections;
            selections.push(signal.signalname);
            if (this.selectedSymbol === "") {
              this.selectedSymbol = signal.signalname;
              }
            this.setState({ selections: selections });
          }
          array.push(signal);
      
          // maintain a maximum number of signal per symbol in the cache
          if (array.length > this.MAX_DATA_POINTS) {
            array.shift();
          }
          if (signal.signalname === this.selectedSymbol ) {
            // add to chart
            if (this.chart.data.length > this.MAX_DATA_POINTS) {
              this.chart.addData(signal,1);
            }else{
              this.chart.addData(signal);
            }
        }
        }
       
    }
  
    componentWillUnmount() {
      if (this.chart) {
        this.chart.dispose();
      }
    }
     addSeries=(name)=> {

        let series = this.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = name;
        series.dataFields.dateX = "time";
        series.name = name.toUpperCase();
        series.tooltipText = "[bold font-size: 15]{valueY}[/]";
        series.legendSettings.itemValueText = "{valueY}";
        
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 3;
        bullet.circle.strokeWidth = 2;
        bullet.circle.fill = am4core.color("#fff");

      }

    change = event => {
        this.chart.data = this.dataCache.get(event.target.value);
        this.selectedSymbol = event.target.value;
        console.log("change symbol " + event.target.value);
      };
  
    render() {
        const {classes} = this.props;

        const dropdown = this.state.selections.map((object, i) => (
            <option key={i} value={object}>
              {object}
            </option>
          ));
      return (
        <div style = {{width:"100%",height:"100%"}}>
        <div style={{ width: "100%", height: this.props.height }}>
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
            <div id={this.props.id} style={{ width: "100%", height:"30em" }}></div>
            </Grid>

        </Grid>
       </div>
       </div>
      );
    }
  }
  
  SignalLineGraph.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SignalLineGraph);