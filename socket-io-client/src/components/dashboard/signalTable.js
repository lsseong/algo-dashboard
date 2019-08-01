import React, { Component } from "react";
import ReactTable from "react-table";

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


class SignalTable extends Component {
  constructor(props) {
    super(props);
    //state and variable initalisation
    this.state = {
      rowBackgroundColor:"#484848",
      headerBackgroundColor:"#303030",
      positiveColor:"#00FF00",
      negativeColor:"#ff0000",
    }
    this.storesignalarr = [];
  }
  //when component 1st mount store the var in the array and set the state of the storesignal
  componentWillMount() {
    if (this.props.type.length !== 0) {
      this.storesignalarr.unshift(this.props.type);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentStrat !== nextProps.currentStrat) {
      this.storesignalarr = [];
    }
    var pt = this.storesignalarr.findIndex(
      i => i.symbol === nextProps.type.symbol
    );
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storesignalarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storesignalarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <ReactTable
          data={this.storesignalarr}
          pageSize={this.storesignalarr.length}
          columns={[
            {
              Header: "SIGNALS",
              getHeaderProps: (state, rowInfo, column, instance) => ({
                style: {
                  fontWeight: "600",
                  textAlign: "center",
                  backgroundColor:this.state.headerBackgroundColor,
                }
              }),
              columns: [
                {
                  Header: "Time",
                  accessor: "time",
                  minWidth: "30%",
                  getProps: (state, row, column) => {
                    return {
                      style: {
                        backgroundColor:this.state.rowBackgroundColor,                  
                      }
                    };
                  }
                },
                {
                  Header: "Symbol",
                  accessor: "symbol",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    return {
                      style: {
                        backgroundColor:this.state.rowBackgroundColor,                  
                      }
                    };
                  }
                },
                {
                  Header: "Signal",
                  accessor: "signal",
                  minWidth: "20%",
                  getProps: (state, rowInfo, column) => {
                    if (rowInfo)
                      return {
                        style: {
                          color: rowInfo.row.signal >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          backgroundColor:this.state.rowBackgroundColor,  
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "SMA 10",
                  id: "sma10",
                  accessor: "analytics.sma10",
                  minWidth: "20%",
                  getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.row)
                      return {
                        style: {
                          color: rowInfo.row.sma10 >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          backgroundColor:this.state.rowBackgroundColor,  
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "SMA 20",
                  id: "sma20",
                  accessor: "analytics.sma20",
                  minWidth: "20%",
                  getProps: (state, rowInfo, column) => {
                    if (rowInfo)
                      return {
                        style: {
                          color: rowInfo.row.sma20 >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          backgroundColor:this.state.rowBackgroundColor,  
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                }
              ]
            }
          ]}
          showPagination={false}
          defaultPageSize={this.props.numofRows}
          className="-striped -highlight table border round"
          style={{
            height: "200px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          showPageSizeOptions={false}
        />
      </div>
    );
  }
}

SignalTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignalTable);
