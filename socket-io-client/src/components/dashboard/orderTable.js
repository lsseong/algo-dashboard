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

class OrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowBackgroundColor:"#484848",
      headerBackgroundColor:"#303030"
    }
    this.storeorderarr = [];
  }
  componentWillMount() {
    if (this.props.type.length !== 0) {
      this.storeorderarr.unshift(this.props.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStrat !== nextProps.currentStrat) {
      this.storeorderarr = [];
    }
    if (this.storeorderarr.length > 80) {
      this.storeorderarr.pop();
    }
    var pt = this.storeorderarr.findIndex(i => i.clientOrderId === nextProps.type.clientOrderId);
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storeorderarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storeorderarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <ReactTable
          data={this.storeorderarr}
          pageSize={this.storeorderarr.length}
          columns={[
          

            {
              Header: "ORDERS",
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
                  Header: "Client Order Id",
                  accessor: "clientOrderId",
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
                  Header: "State",
                  accessor: "state",
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
                  Header: "Symbol",
                  accessor: "order.symbol",
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
                  Header: "Side",
                  accessor: "order.side",
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
                  Header: "Quantity",
                  accessor: "order.qty",
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
                  Header: "Type",
                  accessor: "order.type",
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
                  Header: "Limit Price",
                  accessor: "order.limitPrice",
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
                  Header: "Avg Price",
                  accessor: "avgPrice",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    return {
                      style: {
                        backgroundColor:this.state.rowBackgroundColor,                  
                      }
                    };
                  }
                  
                }
              ]
            }
          ]}
          //pageSizeOptions = {[100]}
          defaultPageSize={this.props.numofRows}
          showPageSizeOptions={false}
          showPagination={false}
          style={{
            height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight table border round"
        />
      </div>
    );
  }
}
OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);