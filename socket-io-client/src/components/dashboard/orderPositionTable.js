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

class OrderPositionTable extends Component {
  constructor(props) {
    super(props);
    this.state={
      columnDefs: [
        { headerName:"WORKING ORDERS", marryChildren:true,
          children:[
        {headerName: 'Time', field: 'time'},
        {headerName: 'Order Id', field: 'clientOrderId',},
        {headerName: 'State', field: 'state',},
        {headerName: 'Symbol', field: 'order.symbol',},
        {headerName: 'Side', field: 'order.side',},
        {headerName: 'Qty', field: 'order.qty',},
        {headerName: 'Type', field: 'order.type',},
        {headerName: 'Limit Price', field: 'order.limitPrice',},
        {headerName: 'Avg Price', field: 'avgPrice',},
        
          ]
        }
        
      ],
      rowData: [],
      gridReady:false,
      defaultColDef:{ resizeable:true, sortable:true},
      getRowNodeId:function(data){
        return data.clientOrderId
      },
    }
    
    this.storeorderarr = [];
  }

  onGridReady=(params)=>{
    this.setState({
      gridReady:true,
    })
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }



  componentWillMount() {
    if (this.props.type.length !== 0 && this.props.type.state !== "COMPLETE") {
      this.storeorderarr.unshift(this.props.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStrat !== nextProps.currentStrat) {
      this.storeorderarr = [];
    }
    var pt = this.storeorderarr.findIndex(
      i => i.clientOrderId === nextProps.type.clientOrderId
    );
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        if (nextProps.type.state !== "COMPLETE") {
          this.storeorderarr.splice(pt, 1, nextProps.type);
        } else if (nextProps.type.state === "COMPLETE") {
          this.storeorderarr.splice(pt, 1);
        }
      } else if (pt < 0) {
        if (nextProps.type.state !== "COMPLETE") {
          this.storeorderarr.unshift(nextProps.type);
        }
      }
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
              if(storerowNode[0].state!=="COMPLETE"){
        
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
              }else if (storerowNode[0].state==="COMPLETE"){
                this.gridApi.updateRowData({ remove: [data] });
              }
            }else{
              if(storerowNode[0].state!=="COMPLETE"){
                var newdata = storerowNode[0];
                this.gridApi.updateRowData({ add: [newdata] });
              }

            }
      }
    }
    
  }
  

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
         <div style = {{width:"100%",height:"100%"}}>
          <div style = {{display: "flex", flexDirection:"row"}}>
            <div style = {{overflow:"hidden",flexGrow:"1"}}>
              <div
              id="myGrid"
              style={{
                height:"250px",
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

OrderPositionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderPositionTable);