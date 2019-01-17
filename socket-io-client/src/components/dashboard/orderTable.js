import React, { Component } from "react";
import ReactTable from "react-table";
export default class OrderTable extends Component {
  constructor(props) {
    super(props);

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
    var pt = this.storeorderarr.findIndex(
      i => i.clientOrderId === nextProps.type.clientOrderId
    );
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storeorderarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storeorderarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    return (
      <div className="small">
        <ReactTable
          data={this.storeorderarr}
          columns={[
            {
              Header: "ORDERS",
              getHeaderProps: (state, rowInfo, column, instance) => ({
                style: {
                  fontWeight: "600",
                  textAlign: "center"
                }
              }),
              columns: [
                {
                  Header: "Time",
                  accessor: "time",
                  minWidth: "10%"
                },
                {
                  Header: "Client Order Id",
                  accessor: "clientOrderId",
                  minWidth: "10%"
                },
                {
                  Header: "State",
                  accessor: "state",
                  minWidth: "10%"
                },
                {
                  Header: "Symbol",
                  accessor: "order.symbol",
                  minWidth: "10%"
                },
                {
                  Header: "Side",
                  accessor: "order.side",
                  minWidth: "10%"
                },
                {
                  Header: "Quantity",
                  accessor: "order.qty",
                  minWidth: "10%"
                },
                {
                  Header: "Type",
                  accessor: "order.type",
                  minWidth: "10%"
                },
                {
                  Header: "Limit Price",
                  accessor: "order.limitPrice",
                  minWidth: "10%"
                },
                {
                  Header: "Avg Price",
                  accessor: "avgPrice",
                  minWidth: "10%"
                }
              ]
            }
          ]}
          //pageSizeOptions = {[100]}

          defaultPageSize={this.props.numofRows}
          showPageSizeOptions={false}
          className="-striped -highlight table border round"
        />
      </div>
    );
  }
}
