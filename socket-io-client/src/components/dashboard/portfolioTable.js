import React, { Component } from "react";
import ReactTable from "react-table";

class PorfolioTable extends Component {
  render() {
    return (
      <div className="small">
        <ReactTable
          data={[this.props.data]}
          columns={[
            {
              Header: "ALL STRATEGIES",
              getHeaderProps: (state, rowInfo, column, instance) => ({
                style: {
                  fontWeight: "600",
                  textAlign: "center"
                }
              }),

              columns: [
                {
                  Header: "Name",
                  accessor: "id",
                  minWidth: "10%"
                },
                {
                  Header: "Time",
                  accessor: "time",
                  minWidth: "10%"
                },
                {
                  Header: "Total   Value",
                  accessor: "totalValue",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: {
                          color: row.row.totalValue >= 0 ? "#03c03c" : "red"
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "Cash",
                  accessor: "cash",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: { color: row.row.cash >= 0 ? "#03c03c" : "red" }
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
                          color: row.row.unrealizedPnl >= 0 ? "#03c03c" : "red"
                        }
                      };
                    else
                      return {
                        style: { className: "-striped -highlight" }
                      };
                  }
                },
                {
                  Header: "Realized Pnl",
                  accessor: "realizedPnl",
                  minWidth: "10%",
                  getProps: (state, row, column) => {
                    if (row)
                      return {
                        style: {
                          color: row.row.realizedPnl >= 0 ? "#03c03c" : "red"
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
          defaultPageSize={3}
          className="-striped -highlight table border round"
          showPageSizeOptions={false}
        />
      </div>
    );
  }
}
export default PorfolioTable;
