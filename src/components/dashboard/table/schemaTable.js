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

class SchemaTable extends Component {
  constructor(props) {
    super(props);
    //state and variable initalisation
    this.state = {
      positiveColor: "#00FF00",
      negativeColor: "#ff0000",

      columnDefs: [
        {
          headerName: "Parameters",
          children: [
            { headerName: "Name", field: "name", type: "numericColumn" },
            {
              headerName: "Description",
              field: "description",
              type: "numericColumn",
            },
            {
              headerName: "Mandatory",
              field: "mandatory",
              type: "numericColumn",
              cellStyle: this.setColumnColorStyle,
            },
            { headerName: "Min", field: "min", type: "numericColumn" },
            { headerName: "Max", field: "max", type: "numericColumn" },
            { headerName: "Type", field: "type", type: "numericColumn" },
            {
              headerName: "DecimalPlaces",
              field: "decimalPlaces",
              type: "numericColumn",
            },
          ],
        },
      ],
      rowData: [],
      gridReady: false,
      defaultColDef: { resizable: true, sortable: true, suppressMovable: true },
      getRowNodeId: function (data) {
        return data.name;
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
    if (params.value === true) {
      return {
        color: this.state.positiveColor,
      };
    } else if (params.value === false) {
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
      if (this.props.type.length === 0 || this.props.type === prevProps.type) {
        return;
      }

      this.props.type[0].parameters.forEach((obj, index) => {
        let uid = obj.name;
        let rowNode = this.gridApi.getRowNode(uid);

        let storerowNode = [];
        storerowNode.push(obj);

        if (rowNode !== undefined) {
          var data = rowNode.data;
          data.name = storerowNode[0].name;
          data.description = storerowNode[0].description;
          data.mandatory = storerowNode[0].mandatory;
          data.min = storerowNode[0].min;
          data.max = storerowNode[0].max;
          data.type = storerowNode[0].type;
          data.decimalPlaces = storerowNode[0].decimalPlaces;

          this.gridApi.batchUpdateRowData({ update: [data] });
          this.gridApi.refreshCells();
        } else {
          var newdata = storerowNode[0];
          if (newdata.decimalPlaces === undefined) {
            newdata.decimalPlaces = "N/A";
          }
          this.gridApi.updateRowData({ add: [newdata] });
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

SchemaTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchemaTable);
