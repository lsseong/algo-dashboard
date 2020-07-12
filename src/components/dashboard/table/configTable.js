import React, { Component } from "react";
import  { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "../styling/css/Table.css";
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


class ConfigTable extends Component {
  constructor(props) {
    super(props);
    //state and variable initalisation
    this.state = {
      positiveColor:"#00FF00",
      negativeColor:"#ff0000",

      columnDefs: [
        { headerName:"CONFIG", 
          children:[
        {headerName: 'ID', field: 'id',type:'numericColumn'},
        {headerName: 'Name', field: 'name',type:'numericColumn'},
        // {headerName: 'Time', field: 'time',type:'numericColumn'},
        {headerName: 'Status', field: 'status',type:'numericColumn'},
        {headerName: 'Trade Amt', field: 'parameters.tradeAmt',type:'numericColumn'},
        {headerName: 'Long Only', field: 'parameters.longOnly',type:'numericColumn'},
        {headerName: 'Security', field: 'parameters.security',type:'numericColumn'},
        {headerName: 'Market Order', field: 'parameters.marketOrderAllowed',type:'numericColumn'},
        {headerName: 'Frequency', field: 'parameters.frequency',type:'numericColumn'},
          ]
        }
        
      ],
      rowData: [],
      gridReady:false,
      defaultColDef:{ resizable:true, sortable:true,suppressMovable: true,},
      getRowNodeId:function(data){
        return data.id
      },
    }
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
      if (this.props.type !== prevProps.type && this.props.type.length!==0) {
     
        this.props.type.forEach((item)=>{
          
        let rowNode = this.gridApi.getRowNode(item.id);
        let storerowNode = [];
        storerowNode.push(item);
      
            if(rowNode!==undefined){
              var data = rowNode.data;
              data.id = storerowNode[0].id;
              data.name = storerowNode[0].name;
              data.status = storerowNode[0].status;
              data.parameters.tradeAmt = storerowNode[0].parameters.tradeAmt;
              data.parameters.longOnly = storerowNode[0].parameters.longOnly;
              data.parameters.security = storerowNode[0].parameters.security;
              data.parameters.marketOrderAllowed = storerowNode[0].parameters.marketOrderAllowed;
              data.parameters.frequency = storerowNode[0].parameters.frequency;
              
         
              this.gridApi.batchUpdateRowData({update:[data]});
              this.gridApi.refreshCells();
            }else{
              var newdata = storerowNode[0];
             
              this.gridApi.updateRowData({ add: [newdata] ,addIndex: 0});
        
            }
        })
      }
    }
    
  }
  componentDidMount(){
      console.log(this.props.type)
  }

  sizeToFit=()=> {
    if(this.props.isMobile){
      this.gridColumnApi.autoSizeColumns();
    }else{
      this.gridApi.sizeColumnsToFit();
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
              
              style={{
                height:this.props.height,
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

ConfigTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigTable);
