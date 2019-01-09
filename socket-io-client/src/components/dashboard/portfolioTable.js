import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import ReactTable from "react-table";

class PorfolioTable extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      perfdata:[],
      stratstatuses:[],
    };
    this.socket = socketIOClient(this.state.endpoint);
  }
componentDidMount() {
 // console.log(this.props.connection);
    this.socket.on("FromStratPerf", perfdata => this.setState({perfdata}));
   //socket.on("FromStrategyStatuses", statusesdata => this.setState({stratstatuses:statusesdata}));
   this.socket.on("disconnect", () => 
    console.log("Ct disconnected")

  );
  }
  componentWillUnmount(){
      this.socket.disconnect();
      console.log("disconnect");
  }
render() {

    return (
      <div className="col-md-6 small">
       <ReactTable
     data={this.state.perfdata}
     columns={[
        {
        Header: 'ALL STRATEGIES',
        getHeaderProps: (state, rowInfo, column, instance) => ({
          style: {
          fontWeight:'600',
          textAlign: 'center'
        }
          }),
 
        columns: [
           {
             Header: "Name",
             accessor: "id",
             minWidth: '10%',
           },
           {
             Header: "Time",
             accessor: "time",
             minWidth: '10%',
           },
           {
               Header: "Total   Value",
               accessor: "totalValue",
               minWidth: '10%',
               getProps: (state,row,column)=>{
                if(row)
                return {
                  style: {color: row.row.totalValue>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
             },
           {
               Header: "Cash",
               accessor: "cash",
               minWidth: '10%',
               getProps: (state,row,column)=>{
                if(row)
                return {
                  style: {color: row.row.cash>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
           },
           {
               Header: "Unrealized Pnl",
               accessor: "unrealizedPnl",
               minWidth: '10%',
               getProps: (state,row,column)=>{
                if(row)
                return {
                  style: {color: row.row.unrealizedPnl>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
           },
           {
            Header: "Realized Pnl",
            accessor: "realizedPnl",
            minWidth: '10%',
            getProps: (state,row,column)=>{
             if(row)
             return {
               style: {color: row.row.realizedPnl>=0?"#03c03c":"red"}
             }
             else
             return{
               style: { className: "-striped -highlight"}
             } 
           }
        },
           
         ]
       },
     ]}
    
     defaultPageSize={3}
     className="-striped -highlight table border round"
     showPageSizeOptions={false}
     style={{
      height: "190px" // This will force the table body to overflow and scroll, since there is not enough room
    }}
   />
     
      </div>

    );

  }
}
export default PorfolioTable;