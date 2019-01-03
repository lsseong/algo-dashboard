import React, { Component } from "react";
import ReactTable from "react-table";
export default class PositionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
           storepos:[],
            
        };
         this.storeposarr= [];
      }
      componentWillMount(){
        if(this.props.type.length!==0){
        this.storeposarr.unshift(this.props.type);
        this.setState({
            storepos:this.storeposarr,
        })
      }
      }
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
          this.storeposarr=[];
          this.setState({
            storepos:[],
          })
        }
        var pt = this.storeposarr.findIndex(i => i.symbol === nextProps.type.symbol); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
            this.storeposarr.splice(pt, 1, nextProps.type);
            this.setState({
                storepos:this.storeposarr,
            })
          }else if(pt<0){
            console.log("pushposition");
            this.storeposarr.unshift(nextProps.type);
            this.setState({
              storepos:this.storeposarr,
          })
          }
        }
      }
     
      render() {
     //console.log("comment"+this.props.type);  
   // console.log(this.storeposarr);
    return (
      <div  className="col-md-6 small">
       <ReactTable
     data={this.storeposarr}
     columns={[
       {
        Header: this.props.children.toUpperCase(),
        getHeaderProps: (state, rowInfo, column, instance) => ({
                style: {
                fontWeight:'600',
                textAlign: 'center'
            }
          }),
         columns: [
           {
             Header: "Time",
             accessor: "time",
             minWidth: '10%',
           },
           {
             Header: "Symbol",
             accessor: "symbol",
             minWidth: '10%',
           },
           {
               Header: "Position",
               accessor: "position",
               minWidth: '10%',
               getProps: (state,row,column)=>{
                if(row)
                return {
                  style: {color: row.row.position>=0?"#03c03c":"red"}
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
               Header: "RealizedPnl",
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