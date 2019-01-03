import React, { Component } from "react";
import ReactTable from "react-table";
export default class SignalTable extends Component {
    constructor(props) {
        super(props);
        //state and variable initalisation
        this.state = {
           storesignal:[],
            
        };
           this.storesignalarr= [];
      }
      //when component 1st mount store the var in the array and set the state of the storesignal
      componentWillMount(){
        if(this.props.type.length!==0){
        this.storesignalarr.unshift(this.props.type);
        this.setState({
            storesignal:this.storesignalarr,
        })
        }
      }
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
            this.storesignalarr=[];
            this.setState({
                storesignal:[],
            })
          }
        var pt = this.storesignalarr.findIndex(i => i.symbol === nextProps.type.symbol); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
            this.storesignalarr.splice(pt, 1, nextProps.type);
            this.setState({
                storesignal:this.storesignalarr,
            })
          }else if(pt<0){
            console.log("pushsignal");
            this.storesignalarr.unshift(nextProps.type);
            this.setState({
              storesignal:this.storesignalarr,
          })
          }
        }
      }
     
      render() {
     //console.log("comment"+this.props.type);  
   // console.log(this.storesignalarr);
    return (
      <div  className="col-md-3 small">
       <ReactTable
     data={this.storesignalarr}
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
             minWidth: '30%',
           },
           {
             Header: "Symbol",
             accessor: "symbol",
             minWidth: '10%',
           },
           {
               Header: "Signal",
               accessor: "signal",
               minWidth: '20%',
               getProps: (state,rowInfo,column)=>{
                if(rowInfo)
                return {
                  style: {color: rowInfo.row.signal>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
             },
           {
               Header: "SMA 10",
               id:'sma10',
               accessor: "analytics.sma10",
               minWidth: '20%',
               getProps: (state,rowInfo,column)=>{
                if(rowInfo&&rowInfo.row)
                return {
                  style: {color: rowInfo.row.sma10>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
           },
           {
               Header: "SMA 20",
               id:'sma20',
               accessor: "analytics.sma20",
               minWidth: '20%',
               getProps: (state,rowInfo,column)=>{
                if(rowInfo)
                return {
                  style: {color: rowInfo.row.sma20>=0?"#03c03c":"red"}
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