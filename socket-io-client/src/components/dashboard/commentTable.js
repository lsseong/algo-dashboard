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

class CommentTable extends Component {
  constructor(props) {
    super(props);
    this.state={
      rowBackgroundColor:"#484848",
      headerBackgroundColor:"#303030",
    }
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
    var pt = this.storecommentarr.findIndex(i => i.time === nextProps.type.time);
    if (this.props.type !== nextProps.type) {
      if (pt !== -1) {
        this.storecommentarr.splice(pt, 1, nextProps.type);
      } else if (pt < 0) {
        this.storecommentarr.unshift(nextProps.type);
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <ReactTable
          data={this.storecommentarr}
          pageSize={this.storecommentarr.length}
          columns={[
            {
              Header: "COMMENTS",
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
                  width: 100,
                  getProps: (state, row, column) => {
                    return {
                      style: {
                        backgroundColor:this.state.rowBackgroundColor,                  
                      }
                    };
                  }
                },
                {
                  Header: "Comment",
                  accessor: "comment",
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
          className="-striped -highlight table border round"
          showPageSizeOptions={false}
          showPagination={false}
          style={{
            height: this.props.height // This will force the table body to overflow and scroll, since there is not enough room
          }}
          defaultPageSize={this.props.numofRows}
        />
      </div>
    );
  }
}

CommentTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentTable);