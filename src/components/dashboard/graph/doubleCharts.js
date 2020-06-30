import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";




class DoubleGraph extends Component {

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
    // am4core.useTheme(this.mytheme);
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    var data = [];
    var price = 100;
    var quantity = 1000;
    for (var i = 0; i < 300; i++) {
        price += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
        quantity += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 1000);
        data.push({ date: new Date(2000, 1, i), price: price, quantity: quantity });
    }

    var interfaceColors = new am4core.InterfaceColorSet();

    chart.data = data;
    // the following line makes value axes to be arranged vertically.
    chart.leftAxesContainer.layout = "vertical";




    // uncomment this line if you want to change order of axes
    // chart.bottomAxesContainer.reverseOrder = true;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;

    chart.leftAxesContainer.pixelPerfect = true;
    dateAxis.pixelPerfect = true;
    dateAxis.renderer.pixelPerfect = true;
    dateAxis.renderer.gridContainer.layout = "absolute";

    // these two lines makes the axis to be initially zoomed-in
    //dateAxis.start = 0.7;
    //dateAxis.keepSelection = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    // valueAxis.renderer.opposite = true;
    
    // height of axis
    valueAxis.height = am4core.percent(100);
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = "bottom";
    valueAxis.renderer.labels.template.padding(2,2,2,2);
    valueAxis.renderer.maxLabelPosition = 0.95; 
    valueAxis.renderer.fontSize = "0.8em"

    // uncomment these lines to fill plot area of this axis with some color
    // valueAxis.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
    // valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;


    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "price";
    series.tooltipText = "{valueY.value}";
    series.name = "Series 1";
    series.id = "test";
    console.log(series)
    console.log(chart.series)


    var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;

    // valueAxis2.renderer.opposite = true;

    // // height of axis
    valueAxis2.height = am4core.percent(100);
    valueAxis2.zIndex = 3
    // this makes gap between panels
    valueAxis2.marginTop = 30;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = "bottom";
    valueAxis2.renderer.labels.template.padding(2,2,2,2);
    valueAxis2.renderer.maxLabelPosition = 0.95;
    valueAxis2.renderer.fontSize = "0.8em"

    // // uncomment these lines to fill plot area of this axis with some color
    // valueAxis2.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
    // valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(50);
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "quantity";
    series2.yAxis = valueAxis2;
    series2.tooltipText = "{valueY.value}";
    series2.name = "Series 2";
    console.log(series2.id)
    console.log(chart.series)
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

 
    // let rectangle = chart.plotContainer.createChild(am4core.Rectangle)
    // rectangle.fillOpacity = 1;
    // rectangle.width = am4core.percent(100);
    // rectangle.fill = am4core.color("#202020")
    // rectangle.isMeasured = false;
    // rectangle.height = 29;
    // rectangle.zIndex = 1000;

    // valueAxis2.events.on("positionchanged", function(){
    // rectangle.y = valueAxis2.pixelY - rectangle.pixelHeight - 1;
    // })

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default DoubleGraph;