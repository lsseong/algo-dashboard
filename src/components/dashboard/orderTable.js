import React, { Component } from "react";
import  { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

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

class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName:"ORDERS", marryChildren:true,
          children:[
        {headerName: 'Time', field: 'time',width:120},
        {headerName: 'Order Id', field: 'clientOrderId',width:100,},
        {headerName: 'State', field: 'state',width:100,},
        {headerName: 'Symbol', field: 'order.symbol',width:100},
        {headerName: 'Side', field: 'order.side',width:80,},
        {headerName: 'Qty', field: 'order.qty',width:100,},
        {headerName: 'Type', field: 'order.type',width:100,},
        {headerName: 'Limit Price', field: 'order.limitPrice',width:100,},
        {headerName: 'Avg Price', field: 'avgPrice',width:100,},
        
          ]
        }
        
      ],
      rowData: [],
      gridReady:false,
      defaultColDef:{ resizable:true, sortable:true},
      getRowNodeId:function(data){
        return data.clientOrderId
      },
    }
    this.MAX_ORDER_COUNT = 50;
  }

  onGridReady=(params)=>{
    this.setState({
      gridReady:true,
    })
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if(this.props.isMobile){
      this.gridColumnApi.autoSizeColumns();
    }else{
      this.gridApi.sizeColumnsToFit();
    }
  }
  sizeToFit=()=> {
    if(this.props.isMobile){
      this.gridColumnApi.autoSizeColumns();
    }else{
      this.gridApi.sizeColumnsToFit();
    }
   
  }

  componentDidUpdate(prevProps){

    if(this.state.gridReady){
      if(this.props.currentStrat!==prevProps.currentStrat){
        this.gridApi.setRowData([]);
      }
      if (this.props.type !== prevProps.type && this.props.type.length!==0) {
        let rowNode = this.gridApi.getRowNode(this.props.type.clientOrderId);
        let storerowNode = [];
        storerowNode.push(this.props.type);
     
            if(rowNode!==undefined){
              var data = rowNode.data;
              data.time = storerowNode[0].time;
              data.clientOrderId = storerowNode[0].clientOrderId;
              data.state = storerowNode[0].state;
              data.order.symbol = storerowNode[0].order.symbol;
              data.order.side = storerowNode[0].order.side;
              data.order.qty = storerowNode[0].order.qty;
              data.order.limitPrice = storerowNode[0].order.limitPrice;
              data.avgPrice = storerowNode[0].avgPrice;
  
              this.gridApi.batchUpdateRowData({update:[data]});
              this.gridApi.refreshCells();
            }else{
              var newdata = storerowNode[0];
              this.gridApi.updateRowData({ add: [newdata],addIndex: 0 });
              if(this.gridApi.getDisplayedRowCount()>this.MAX_ORDER_COUNT){
                this.gridApi.updateRowData({remove :[this.gridApi.getDisplayedRowAtIndex(this.gridApi.getDisplayedRowCount()-1).data]});
              }
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
                height:"30em",
                width:"100%",
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
                paginationAutoPageSize={true}
                pagination={true}
                onGridSizeChanged={this.sizeToFit}
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
OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);