import React, { Component } from "react";
import ReactTable from "react-table";
export default class OrderTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
           storeorder:[],
            
        };
          this.storeorderarr= [];
        
      }
      componentWillMount(){
        if(this.props.type.length!==0){
        this.storeorderarr.unshift(this.props.type);
        this.setState({
            storeorder:this.storeorderarr,
        })
        }
      }
    
   
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
            this.storeorderarr=[];
            this.setState({
                storeorderarr:[],
            })
          }
        var pt = this.storeorderarr.findIndex(i => i.clientOrderId === nextProps.type.clientOrderId); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
            this.storeorderarr.splice(pt, 1, nextProps.type);
            this.setState({
                storeorder:this.storeorderarr,
            })
          }else if(pt<0){
            console.log("pushorder");
            this.storeorderarr.unshift(nextProps.type);
            this.setState({
                storeorder:this.storeorderarr,
          })
          }
        }
      }
     
      render() {
    return (
        <div  className="col-md-6 small">
            <ReactTable
          data={this.storeorderarr}
    
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
                  Header: "Client Order Id",
                  accessor: "clientOrderId",
                  minWidth: '10%',
                },
                {
                    Header: "State",
                    accessor: "state",
                    minWidth: '10%',
                  },
                {
                    Header: "Symbol",
                    accessor: "order.symbol",
                    minWidth: '10%',
                },
                {
                    Header: "Side",
                    accessor: "order.side",
                    minWidth: '10%',
                },
                {
                    Header: "Quantity",
                    accessor: "order.qty",
                    minWidth: '10%',
                },
                {
                    Header: "Type",
                    accessor: "order.type",
                    minWidth: '10%',
                },
                {
                    Header: "LimitPrice",
                    accessor: "order.limitPrice",
                    minWidth: '10%',
                },
              ]
            },
          ]}
          //pageSizeOptions = {[100]}
          
          defaultPageSize={3}
          showPageSizeOptions={false}
          className="-striped -highlight table border round"
          style={{
            height: "190px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
        </div>
    );
  }
}