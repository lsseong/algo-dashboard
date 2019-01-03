import React, { Component } from "react";
import ReactTable from "react-table";
export default class QuoteTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
           storequote:[],
            
        };
        this.storequotearr=[];
      }
      componentWillMount(){
        if(this.props.type.length!==0){
          this.storequotearr.unshift(this.props.type);
          this.setState({
              storequote:this.storequotearr,
          })
        }
      
      }
    
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
          this.storequotearr=[];
          this.setState({
              storequote:[],
          })
        }
        var pt = this.storequotearr.findIndex(i => i.security === nextProps.type.security); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
       
            this.storequotearr.splice(pt, 1, nextProps.type);
            this.setState({
                storequote:this.storequotearr,
            })
          }else if(pt<0){
    
            this.storequotearr.unshift(nextProps.type);
            this.setState({
              storequote:this.storequotearr,
          })
          }
        }
      }
     
      render() {
     //console.log("comment"+this.props.type);  
   // console.log(this.storequotearr);
    return (
      
      <div  className="col-md-6 small ">
       <ReactTable
     data={this.storequotearr}
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
             Header: "Status",
             accessor: "status",
             minWidth: '10%',
           },
           {
            Header: "Security",
            accessor: "security",
            minWidth: '10%'
          },
           {
               Header: "Bid Price",
               accessor: "bidPrice",
               minWidth: '30%',
               getProps: (state,rowInfo,column)=>{
                if(rowInfo)
                return {
                  style: {color: rowInfo.row.bidPrice>=0?"#03c03c":"red"}
                }
                else
                return{
                  style: { className: "-striped -highlight"}
                } 
              }
             },
           {
               Header: "Ask Price",
               accessor: "askPrice",
               minWidth: '30%',
               getProps: (state,rowInfo,column)=>{
                if(rowInfo&&rowInfo.row)
                return {
                  style: {color: rowInfo.row.askPrice>=0?"#03c03c":"red"}
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