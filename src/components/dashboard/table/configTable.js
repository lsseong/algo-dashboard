import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "../styling/css/Table.css";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const styles = (theme) => ({
  root: {
    backgroundColor: "#404040",
    fontSize: "12px",
    color: "white",
    border: "1px",
    borderColor: "white",
  },
});

class ConfigTable extends Component {
  constructor(props) {
    super(props);
    //state and variable initalisation
    this.state = {
      positiveColor: "#00FF00",
      negativeColor: "#ff0000",

      columnDefs: [
        {
          headerName: "CONFIG",
          children: [
            {
              headerName: "Name",
              field: "key",
              width: 20,
            },
            {
              headerName: "Value",
              field: "value",
              cellStyle: this.setColumnColorStyle,
              width: 100,
            },
          ],
        },
      ],
      rowData: [],
      gridReady: false,
      defaultColDef: { resizable: true, sortable: true, suppressMovable: true },
      getRowNodeId: function (data) {
        return data.key;
      },
    };
  }

  onGridReady = (params) => {
    this.setState({
      gridReady: true,
    });
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if (this.props.isMobile) {
      this.gridColumnApi.autoSizeColumns();
    } else {
      this.gridApi.sizeColumnsToFit();
    }
  };

  setColumnColorStyle = (params) => {
    if (
      params.value > 0 ||
      params.value === "RUNNING" ||
      params.value === "true"
    ) {
      return {
        color: this.state.positiveColor,
      };
    } else if (
      params.value < 0 ||
      params.value === "STOP" ||
      params.value === "false"
    ) {
      return {
        color: this.state.negativeColor,
      };
    }
  };

  //when component 1st mount store the var in the array and set the state of the storesignal
  componentDidUpdate(prevProps) {
    if (this.state.gridReady) {
      if (this.props.currentStrat !== prevProps.currentStrat) {
        this.gridApi.setRowData([]);
      }

      if (this.props.type === prevProps.type) {
        return;
      }

      this.props.type.forEach((item, index) => {
        // console.log(item, index);

        if (this.props.currentStrat === item.id) {
          Object.entries(item).forEach(([key, value]) => {
            let objKey = key;
            let objValue = value;
            let obj = {
              key,
              value,
            };

            if (typeof value === "object") {
              Object.entries(value).forEach(([paramsKey, paramsvalue]) => {
                obj = {
                  key: paramsKey,
                  value: paramsvalue,
                };

                objKey = paramsKey;
                objValue = paramsvalue;

                let rowNode = this.gridApi.getRowNode(objKey);
                let storerowNode = [];
                storerowNode.push(obj);

                if (rowNode !== undefined) {
                  var data = rowNode.data;
                  data[objKey] = storerowNode[0].objKey;
                  data[objValue] = storerowNode[0].objValue;

                  this.gridApi.batchUpdateRowData({ update: [data] });
                  this.gridApi.refreshCells();
                } else {
                  var newdata = storerowNode[0];

                  this.gridApi.updateRowData({ add: [newdata] });
                }
              });
            } else {
              let rowNode = this.gridApi.getRowNode(objKey);
              let storerowNode = [];
              storerowNode.push(obj);

              if (rowNode !== undefined) {
                var data = rowNode.data;
                data[objKey] = storerowNode[0].objKey;
                data[objValue] = storerowNode[0].objValue;

                this.gridApi.batchUpdateRowData({ update: [data] });
                this.gridApi.refreshCells();
              } else {
                var newdata = storerowNode[0];

                this.gridApi.updateRowData({ add: [newdata] });
              }
            }
          });
        }
      });
    }
  }

  sizeToFit = () => {
    if (this.props.isMobile) {
      this.gridColumnApi.autoSizeColumns();
    } else {
      this.gridApi.sizeColumnsToFit();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div style={{ width: "100%", height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ overflow: "hidden", flexGrow: "1" }}>
              <div
                style={{
                  height: this.props.height,
                  width: "100%",
                  fontSize: "15px",
                  fontFamily: "TitilliumWeb_Regular",
                }}
                className="ag-theme-balham-dark"
              >
                <AgGridReact
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.rowData}
                  onGridReady={this.onGridReady}
                  defaultColDef={this.state.defaultColDef}
                  getRowNodeId={this.state.getRowNodeId}
                  paginationAutoPageSize={true}
                  pagination={true}
                  onGridSizeChanged={this.sizeToFit}
                ></AgGridReact>
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
