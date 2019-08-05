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

class CommentTable extends Component {
  constructor(props) {
    super(props);
    this.state={
      columnDefs: [
        { headerName:"COMMENTS", 
          children:[
        {headerName: 'Time', field: 'time',},
        {headerName: 'Comment', field: 'comment',},
          ]
        }
        
      ],
      rowData: [],
      gridReady:false,
      defaultColDef:{ resizeable:true, sortable:true},
      getRowNodeId:function(data){
        return data.time
      },
    }
  }

  componentDidUpdate(prevProps){
    if(this.state.gridReady){
      if(this.props.currentStrat!==prevProps.currentStrat){
        this.gridApi.setRowData([]);
      }
      if (this.props.type !== prevProps.type && this.props.type.length!==0) {
        let storerowNode = [];
        storerowNode.push(this.props.type);
        var newdata = storerowNode[0];
        this.gridApi.updateRowData({ add: [newdata] ,addIndex: 0});
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

CommentTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentTable);