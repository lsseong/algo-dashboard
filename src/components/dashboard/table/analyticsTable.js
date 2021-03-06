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

class AnalyticsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveColor: "#00FF00",
      negativeColor: "#ff0000",

      columnDefs: [
        {
          headerName: "ANALYTICS",
          children: [
            { headerName: "Time", field: "time", type: "numericColumn" },
            { headerName: "Symbol", field: "key", type: "numericColumn" },
            { headerName: "Indicator", field: "name", type: "numericColumn" },
            {
              headerName: "Value",
              field: "value",
              type: "numericColumn",
              cellStyle: this.setColumnColorStyle,
            },
          ],
        },
      ],
      rowData: [],
      defaultColDef: { resizable: true, sortable: true, suppressMovable: true },
      gridReady: false,
      getRowNodeId: function (data) {
        return data.key + data.name;
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (this.state.gridReady) {
      if (this.props.currentStrat !== prevProps.currentStrat) {
        this.gridApi.setRowData([]);
      }

      if (this.props.type !== prevProps.type && this.props.type.length !== 0) {
        let uid = this.props.type.key + this.props.type.name;
        let rowNode = this.gridApi.getRowNode(uid);
        let storerowNode = [];
        storerowNode.push(this.props.type);

        if (rowNode !== undefined) {
          var data = rowNode.data;
          data.time = storerowNode[0].time;
          data.key = storerowNode[0].key;
          data.name = storerowNode[0].name;
          data.value = storerowNode[0].value;

          this.gridApi.batchUpdateRowData({ update: [data] });
          this.gridApi.refreshCells();
        } else {
          var newdata = storerowNode[0];
          this.gridApi.updateRowData({ add: [newdata], addIndex: 0 });
        }
      }
    }
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.props.isMobile) {
      this.gridColumnApi.autoSizeColumns();
    } else {
      this.gridApi.sizeColumnsToFit();
    }
    this.setState({
      gridReady: true,
    });
  };

  setColumnColorStyle = (params) => {
    let number = Number(params.value);
    if (number > 0) {
      return {
        color: this.state.positiveColor,
      };
    } else if (number === 0) {
      return {
        color: "grey",
      };
    } else {
      return {
        color: this.state.negativeColor,
      };
    }
  };

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
      <div className={classes.root} style={{ width: "100%", height: "100%" }}>
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
                // paginationAutoPageSize={true}
                paginationPageSize={this.props.numofRows}
                pagination={true}
                onGridSizeChanged={this.sizeToFit}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AnalyticsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnalyticsTable);
