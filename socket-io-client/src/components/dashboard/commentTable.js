import React, { Component } from "react";
import ReactTable from "react-table";

export default class CommentTable extends Component {
  constructor(props) {
    super(props);
    this.storecommentarr = [];
  }

  componentWillMount() {
    if (this.props.type.length !== 0) {
      this.storecommentarr.unshift(this.props.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStrat !== nextProps.currentStrat) {
      this.storecommentarr = [];
    }
    if (this.storecommentarr.length > 80) {
      this.storecommentarr.pop();
    }
    var pt = this.storecommentarr.findIndex(
      i => i.time === nextProps.type.time
    );
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storecommentarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storecommentarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    return (
      <div className="small">
        <ReactTable
          data={this.storecommentarr}
          //pageSize={this.storecommentarr.length}
          columns={[
            {
              Header: "COMMENTS",
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
                  minWidth: "1"
                },
                {
                  Header: "Comment",
                  accessor: "comment",
                  minWidth: "2.5"
                }
              ]
            }
          ]}
          className="-striped -highlight table border round"
          showPageSizeOptions={false}
          defaultPageSize={this.props.numofRows}
        />
      </div>
    );
  }
}
