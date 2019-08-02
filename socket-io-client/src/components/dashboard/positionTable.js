import React, { Component } from "react";
import  { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

import "../dashboard/styling/css/Table.css";

import {withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  root:{
    backgroundColor:"#404040",
    fontSize:"12px",
    color:"white",
    border:"1px",
    borderColor:"white",
  }
 
 });



class PositionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveColor:"#00FF00",
      negativeColor:"#ff0000",

      columnDefs: [
        { headerName:"POSITIONS", 
          children:[
        {headerName: 'Time', field: 'time',type:'numericColumn'},
        {headerName: 'Symbol', field: 'symbol',type:'numericColumn'},
        {headerName: 'Position', field: 'position',type:'numericColumn',cellStyle:this.setColumnColorStyle},
        {headerName: 'Unrealized Pnl', field: 'unrealizedPnl',type:'numericColumn',cellStyle:this.setColumnColorStyle},
        {headerName: 'Realized Pnl', field: 'realizedPnl',type:'numericColumn',cellStyle:this.setColumnColorStyle},
          ]
        }
        
      ],
      rowData: [],
      defaultColDef:{ resizeable:true, sortable:true},
      gridReady:false,
      getRowNodeId:function(data){
        return data.symbol
      },
    }
  }

  componentDidUpdate(prevProps){
    if(this.state.gridReady){
      if(this.props.currentStrat!==prevProps.currentStrat){
        this.gridApi.setRowData([]);
      }
    
      if (this.props.type !== prevProps.type) {
        let rowNode = this.gridApi.getRowNode(this.props.type.symbol);
        let storerowNode = [];
        storerowNode.push(this.props.type);
     
            if(rowNode!==undefined){
              var data = rowNode.data;
              data.time = storerowNode[0].time;
              data.symbol = storerowNode[0].symbol;
              data.position = storerowNode[0].position;
              data.realizedPnl = storerowNode[0].realizedPnl;
              data.unrealizedPnl = storerowNode[0].unrealizedPnl;
              this.gridApi.batchUpdateRowData({update:[data]});
              this.gridApi.refreshCells();
            }else{
              var newdata = storerowNode[0];
              this.gridApi.updateRowData({ add: [newdata] });
            }
      }
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
                height:"50vh",
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

PositionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PositionTable);

