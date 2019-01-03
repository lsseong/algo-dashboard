import React, { Component } from "react";
import ReactTable from "react-table";
export default class BarTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
           storebar:[],
            
        };
        
          this.storebararr= [];
      }
      componentWillMount(){
        if(this.props.type.length!==0){
      
        this.storebararr.unshift(this.props.type);
        this.setState({
            storebar:this.storebararr,
        })
      }
      }
    
   
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
          this.storebararr=[];
          this.setState({
            storebar:[],
          })
        }
        var pt = this.storebararr.findIndex(i => i.symbol === nextProps.type.symbol); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
            this.storebararr.splice(pt, 1, nextProps.type);
            this.setState({
                storebar:this.storebararr,
            })
          }else if(pt<0){
            console.log("pushbar");
            this.storebararr.push(nextProps.type);
            this.setState({
              storebar:this.storebararr,
          })
          }
        }
      }
     
      render() {
     //console.log("comment"+this.props.type);  
   // console.log(this.storebararr);
    return (
      <div  className="col-md-4 small">
       <ReactTable
     data={this.storebararr}
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
               Header: "Open",
               accessor: "open",
               minWidth: '10%',
             },
           {
               Header: "High",
               accessor: "high",
               minWidth: '10%',
           },
           {
               Header: "Low",
               accessor: "low",
               minWidth: '10%',
           },
           {
               Header: "Close",
               accessor: "close",
               minWidth: '10%',
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