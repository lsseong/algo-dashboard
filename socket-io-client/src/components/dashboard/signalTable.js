import React, { Component } from "react";
import  { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';


import "../dashboard/styling/css/Table.css";

const styles = theme => ({
  root:{
    backgroundColor:"#404040",
    fontSize:"12px",
    color:"white",
    border:"1px",
    borderColor:"white",
  }
 
 });


class SignalTable extends Component {
  constructor(props) {
    super(props);
    //state and variable initalisation
    this.state = {
      positiveColor:"#00FF00",
      negativeColor:"#ff0000",

      columnDefs: [
        { headerName:"SIGNALS", 
          children:[
        {headerName: 'Time', field: 'time',type:'numericColumn'},
        {headerName: 'Symbol', field: 'symbol',type:'numericColumn'},
        {headerName: 'Signal', field: 'signal',type:'numericColumn',cellStyle:this.setColumnColorStyle},
        {headerName: 'SMA 10', field: 'analytics.sma10',type:'numericColumn',cellStyle:this.setColumnColorStyle},
        {headerName: 'SMA 20', field: 'analytics.sma20',type:'numericColumn',cellStyle:this.setColumnColorStyle},
          ]
        }
        
      ],
      rowData: [],
      gridReady:false,
      defaultColDef:{ resizeable:true, sortable:true},
      getRowNodeId:function(data){
        return data.symbol
      },
    }
  }

  
  onGridReady=(params)=>{
    this.setState({
      gridReady:true,
    })
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  setColumnColorStyle=(params)=>{
    if(params.value>0){
      return{
        color:this.state.positiveColor,
      }
    }else if(params.value===0){
      return{
        color:"black",
      }
    }else{
      return{
        color:this.state.negativeColor,
      }
    }
  }

  //when component 1st mount store the var in the array and set the state of the storesignal
  componentDidUpdate(prevProps){
    if(this.state.gridReady){
      if(this.props.currentStrat!==prevProps.currentStrat){
        this.gridApi.setRowData([]);
      }
      if (this.props.type !== prevProps.type) {
        let rowNode = this.gridApi.getRowNode(this.props.type.symbol);
        let storerowNode = [];
        storerowNode.push(this.props.type);
        console.log(storerowNode);
     
            if(rowNode!==undefined){
              var data = rowNode.data;
              console.log(data);
              data.time = storerowNode[0].time;
              data.symbol = storerowNode[0].symbol;
              data.signal = storerowNode[0].signal;
              data.analytics.sma10 = storerowNode[0].analytics.sma10;
              data.analytics.sma20 = storerowNode[0].analytics.sma20;
  
              this.gridApi.batchUpdateRowData({update:[data]});
              this.gridApi.refreshCells();
            }else{
              var newdata = storerowNode[0];
              this.gridApi.updateRowData({ add: [newdata] });
            }
      }
    }
    
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <div style = {{width:"100%",height:"100%"}}>
          <div style = {{display: "flex", flexDirection:"row"}}>
            <div style = {{overflow:"hidden",flexGrow:"1"}}>
              <div
              id="myGrid"
              style={{
                height:"25vh",
                width:"100%",
                fontSize:"15px",
                fontFamily:"TitilliumWeb_Regular",
              }}
              className="ag-theme-balham-dark"
              >
                <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                onGridReady={this.onGridReady}
                defaultColDef ={this.state.defaultColDef}
                getRowNodeId = {this.state.getRowNodeId}
                >
                </AgGridReact>

              </div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

SignalTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignalTable);
