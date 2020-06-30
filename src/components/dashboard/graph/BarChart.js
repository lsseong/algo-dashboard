import React, {Component} from 'react';
import * as d3 from "d3";
import { withStyles ,Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    graph:{
      backgroundColor:"#303030",
      minHeight:"30em",
    },
    
   });
  
class BarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data:[]
        }

        this.margin = {top: 20, right: 60, bottom: 40, left: 60}
        this.MAX_UNITS = 10;
        this.bgColor = "#303030"
        this.textColor = 'white'
        };

    drawChart=(data=[]) =>{
  
       
        // get height and width of div that the graph is nested in 
        const divHeight = document.getElementById(`${this.props.id}`).offsetHeight;
        const divWidth = document.getElementById(`${this.props.id}`).offsetWidth;
 
        //set main graph height and width
        this.screen_height = divHeight - this.margin.top - this.margin.bottom ;
        this.screen_width = divWidth - this.margin.left  - this.margin.right ;
        
        //get x and y middle pt
        this.X_MIDDLE_PT =  this.screen_width/2
        this.Y_MIDDLE_PT = this.screen_height/2
        
        //create svg
        this.svg = d3.select(`div#${this.props.id}`)
        .append("svg")
        .attr("width", divWidth)
        .attr("height", divHeight)
        .attr("border", 1)
        .style('padding','10px')
        
        .append("g")
        .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
        
        
        //add axes and bar
        this.updateChartData(data);

        
        

      }

    drawAxes=(data)=>{
        //create x axis range
        const max = this.getMax(data);
        

        const xAxisRange = d3.scaleLinear().domain([-max,max]).range([0, this.screen_width]);
     

        this.svg
        .append("g")
        .attr("class", "x axis chart")
        .attr("transform", "translate(0," + this.screen_height + ")")
        .style("color", this.textColor)
        .call(d3.axisBottom(xAxisRange));
        
        // create grid lines x axis
        function make_x_gridlines(xRange) {		
            return d3.axisBottom(xRange)
                .ticks(7)
        }

        
        this.svg.append("g")			
        .attr("class", "x-grid axis chart")
        .attr("transform", "translate(0," + this.screen_height + ")")
        .call(make_x_gridlines(xAxisRange)
            .tickSize(-this.screen_height)
            .tickFormat("")
        ).style('color','lightgrey')
        .style("stroke-width", 0.5)
        


        //create y axis range

        let labelstring = 'symbol'
        const yAxisLabels = data.map((item)=>{
            return item[labelstring]
        })

        const yAxisRange = d3.scalePoint().domain(yAxisLabels).range([this.screen_height, 0]).padding([0.5]);
      

        this.svg
        .append("g")
        .attr("class", "y axis chart")
        .style("color", this.textColor)
        .call(d3.axisLeft(yAxisRange));


        // create grid lines y axis
        function make_y_gridlines(yRange) {		
            return d3.axisLeft(yRange)
                .ticks(5)
        }
        
        this.svg.append("g")
        .attr("class", "y-grid axis chart")			
        .call(make_y_gridlines(yAxisRange)
            .tickSize(-this.screen_width)
            .tickFormat("")
        ).style('color','lightgrey')
        .style("stroke-width", 0.5)



        // middle vertical line
        this.svg.append("line")
        .attr("class", "line axis chart")
        .attr("x1", this.X_MIDDLE_PT)
        .attr("y1", 0)
        .attr("x2", this.X_MIDDLE_PT)
        .attr("y2", this.screen_height)
        .attr("stroke-width", 1)
        .attr("stroke", this.textColor);
    }

    updateChartData = (data)=>{

        if( data !== undefined && data !== null && data.length!== 0){
            this.svg.selectAll('.chart').remove();
            this.drawAxes(data)
            this.drawBar(data);
        }
    }
      

    getMax=(data)=>{
        let max = Math.abs(data[0].position);
        let min  = Math.abs(data[0].position);

        data.forEach((item)=>{
            if(Math.abs(item.position)>max){
                max = Math.abs(item.position)
            }
            if(Math.abs(item.position)<min){
                min = Math.abs(item.position)
            }
        })
        // console.log(min,max)
        return max;
    }
    scaler=(max,position)=>{
        // console.log(min,max,position)
        // range form  0  to max units
        const min = 0;
        const MAX_SCALE = this.MAX_UNITS
        const MIN_SCALE = 0
        let results = this.MAX_UNITS;

        if (position===0){
            return 0;
        }
        if (position === max){
            return MAX_SCALE;
        }
        
        let absposition = Math.abs(position)
        let scaledposition = (((absposition-min)/(max-min))*(MAX_SCALE - MIN_SCALE))+MIN_SCALE;
      
        if (position>=0){
            results = scaledposition;
        }else{
            results = -scaledposition;
        }

        return results
    }

    barColors=(position)=>{
        let color = '#58bf58';
        if (position<0){
            color = '#ff6961';
        }

        return color;
    }

    
    get_X_Position=(data,x_length)=>{
        let result;
        if (data>=0){
            result = this.X_MIDDLE_PT
            
        }else{
            result = this.X_MIDDLE_PT + (data * x_length)
            
        }
  
        return result
        
    }
         

    drawBar=(data)=>{
       
    

        const max = this.getMax(data);
        
        // length of a x unit
        const X_UNIT_LENGTH =  this.screen_width/this.MAX_UNITS/2;
        const Y_UNIT_LENGTH = (this.screen_height/(data.length));
        
        //responsive font size
        let FONT_SIZE =  Math.sqrt((X_UNIT_LENGTH *  Y_UNIT_LENGTH)/16);

        if (this.props.fontsize !== undefined){
            FONT_SIZE = this.props.fontsize
        }
        


        // just like the select method, selectAll() selects the element that matches the argument that is passed to it. 
        // So, all elements that match the arguments are selected and not just the first.
   
    
        
        
        
        this.svg
        .append('g')
        .attr("class", "data chart")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "data chart")
        .attr("x", (d, i) => this.get_X_Position(this.scaler(max,d.position),X_UNIT_LENGTH))
        .attr("y", (d, i) => ((i * Y_UNIT_LENGTH))+Y_UNIT_LENGTH*0.05)
        .attr("height", Y_UNIT_LENGTH*0.9)
        .attr("width", (d, i) => Math.abs(this.scaler(max,d.position)) * X_UNIT_LENGTH )
        .style("stroke", 'black')
        .style("stroke-width", 0)
        .style('text-align','center')
        .attr("fill",(d, i) =>this.barColors(d.position));
     
    
        this.svg.append('g')
        .attr("class", "data chart")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d.position)
        .attr("x", (d, i) => this.get_X_Position(this.scaler(max,d.position),X_UNIT_LENGTH)+Math.abs(this.scaler(max,d.position)) * X_UNIT_LENGTH/2)
        .attr("y", (d, i) => ((i * Y_UNIT_LENGTH))+Y_UNIT_LENGTH/2)
        .style('text-anchor','middle') // move x axis anchor point to middle
        .style('dominant-baseline','middle') // move y axis anchor point to middle
        .style("font-size", FONT_SIZE)
        .style('fill',this.textColor);
  
    }

    componentDidMount() {
     
        this.drawChart(this.props.data);

      }
    componentDidUpdate(prevProps){

    if (this.props.data.length === 0) {
        // update due to selection event
      
        return;
        }

    if(prevProps.data === this.props.data){
   
        return;
    }
       
        // this.svg.remove();
        // this.drawChart()
        this.updateChartData(this.props.data);
        
    
    }

    

      render(){
        const { classes } = this.props;
          return(
            <Grid container className={classes.graph} spacing={0}>
            <Grid item xs={12}>
             
            <div id={this.props.id} style={{width:"100%",height:this.props.height}}></div>
              
                </Grid>
                </Grid>
                
         
          );
      }
}

BarChart.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(BarChart);