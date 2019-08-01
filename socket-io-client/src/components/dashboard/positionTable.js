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



class PositionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveColor:"#00FF00",
      negativeColor:"#ff0000",
      rowBackgroundColor:"#484848",
      headerBackgroundColor:"#303030"
    }
    this.storeposarr = [];
  }
  componentWillMount() {
    if (this.props.type.length !== 0) {
      this.storeposarr.unshift(this.props.type);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentStrat !== nextProps.currentStrat) {
      this.storeposarr = [];
    }
    var pt = this.storeposarr.findIndex(i => i.symbol === nextProps.type.symbol);
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storeposarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storeposarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <ReactTable
          data={this.storeposarr}
          pageSize={this.storeposarr.length}
          
          columns={[
            {
              Header: "POSITIONS",
              getHeaderProps: () => ({
                style: {
                  fontWeight: "600",
                  textAlign: "center",
                  color:"white",
                  backgroundColor:this.state.headerBackgroundColor,
                }
              }),
              columns: [
                {
                  Header: "Time",

                  accessor: "time",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    return {
                      style: {
                        textAlign: "right",
                        color:"white",
                        backgroundColor:this.state.rowBackgroundColor,
                        fontSize:"15px",
                       
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
                        textAlign: "right",
                        color:"white",
                        backgroundColor:this.state.rowBackgroundColor,
                        fontSize:"15px",
                      }
                    };
                  }
                },
                {
                  Header: "Position",
                  accessor: "position",
                  minWidth: "10%",

                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: {
                          color: row.row.position >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          textAlign: "right",
                          backgroundColor:this.state.rowBackgroundColor,
                          fontSize:"15px",
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "Unrealized Pnl",
                  accessor: "unrealizedPnl",
                  minWidth: "10%",

                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: {
                          color: row.row.unrealizedPnl >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          textAlign: "right",
                          backgroundColor:this.state.rowBackgroundColor,
                          fontSize:"15px",
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "RealizedPnl",
                  accessor: "realizedPnl",
                  minWidth: "10%",

                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: {
                          color: row.row.realizedPnl >= 0 ? this.state.positiveColor : this.state.negativeColor,
                          textAlign: "right",
                          backgroundColor:this.state.rowBackgroundColor,
                          fontSize:"15px",
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
          
          defaultPageSize={this.props.numofRows}
          className="-striped -highlight table border round"
          showPagination={false}
          style={{
            height: "300px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          showPageSizeOptions={false}
        />
      </div>
    );
  }
}

PositionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PositionTable);

