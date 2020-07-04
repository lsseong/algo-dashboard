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

class SignalLineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selections: [],
        
        };
        this.selectedSymbol = "";
        this.graphID = this.getUniqueID();
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

      createSignalLineGraph=(id)=>{
      am4core.useTheme(this.mytheme);
      let chart = am4core.create(id, am4charts.XYChart);

      
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
      valueAxis.renderer.opposite = true;
      // Create series
    
 
      
      
      // let series2 = chart.series.push(new am4charts.LineSeries());
      // series2.dataFields.valueY = "sma20";
      // series2.dataFields.dateX = "time";
      // series2.name = "SMA20";
      // series2.tooltipText = "[bold font-size: 15]{valueY}[/]";
      // series2.legendSettings.itemValueText = "{valueY}";
      
      // let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      // bullet2.circle.radius = 3;
      // bullet2.circle.strokeWidth = 2;
      
      
      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      
      
      // Add legend
      chart.legend = new am4charts.Legend();
  


      this.chart = chart;
      }

 
    componentDidMount() {
      this.createSignalLineGraph(this.graphID)
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
          let spiltTime = this.props.signaldata.time.split(":");
          var newDate = new Date();
          newDate.setHours(spiltTime[0])
          newDate.setMinutes(spiltTime[1])
          newDate.setSeconds(spiltTime[2])

          var signal = {
            time: newDate,
            signalname: this.props.signaldata.symbol,
            signal: this.props.signaldata.signal,
            commentary: this.props.signaldata.commentary,
          };
          var analyticsItems = this.props.signaldata.analytics;
          
          for (const [key, value] of Object.entries(analyticsItems)) {
            signal[key] = value
            let analyticsExist = this.chart.map.getKey(key)
            if(analyticsExist === undefined){
                    // create line series dynamically
              this.addSeries(key)
            }
          }
          
          // add to cache
          var array = this.dataCache.get(this.props.signaldata.symbol);
          if (array == null) {
            // first time seeing this security
            array = [];

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
        series.id = name
        series.dataFields.valueY = name;
        series.dataFields.dateX = "time";
        series.name = name.toUpperCase();
        series.tooltipText = "[bold font-size: 15]{valueY}[/]";
        series.legendSettings.itemValueText = "{valueY}";
        

        var bullet = series.bullets.push(new am4charts.Bullet());

        let arrow = bullet.createChild(am4core.Triangle);
        arrow.horizontalCenter = "middle";
        arrow.verticalCenter = "middle";
        arrow.stroke = am4core.color("#fff");
        arrow.direction = "top";
        arrow.width = 8;
        arrow.height = 8;

        arrow.adapter.add("fill", function(fill, target) {
          if (!target.dataItem) {
            return fill
          }
         
          let values = target.dataItem.dataContext.signal;
          if (values === -1){
            return am4core.color("red")
          }else if(values === 1){
           return  am4core.color("green")
          }else{
           return fill
          }
      
        });
        
        arrow.adapter.add("rotation", function(rotation, target) {
          if (!target.dataItem) {
            return rotation;
          }
          let values = target.dataItem.dataContext.signal;
          if (values === -1){
            return 180
          }else if(values === 1){
           return  0
          }else{
           return 90
          }
        });

        // bullet.circle.stroke = am4core.color("#fff");

        

      }
    getUniqueID = (prefix='sl')=>{
      var length = 10
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return prefix+result;
    }

    change = event => {
        this.chart.data = this.dataCache.get(event.target.value);
        this.selectedSymbol = event.target.value;
        // console.log("change symbol " + event.target.value);
      };
  
    render() {
        const {classes} = this.props;

        const dropdown = this.state.selections.map((object, i) => (
            <option key={i} value={object}>
              {object}
            </option>
          ));
        
      return (
        <div style = {{width:"100%",height:this.props.height}}>
    
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
            <div id={this.graphID} style={{ width: "100%", height:this.props.height}}></div>
            </Grid>

        </Grid>
       
       </div>
      );
    }
  }
  
  SignalLineGraph.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SignalLineGraph);