import React, { Component } from "react";
import ReactTable from "react-table";
export default class CommentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
           storecomment:[],
            
        };
        
        this.storecommentarr= [];
      }
      componentWillMount(){
        if(this.props.type.length!==0){
        this.storecommentarr.unshift(this.props.type);
        this.setState({
            storecomment:this.storecommentarr,
        })
      }
      }
    
   
      componentWillReceiveProps(nextProps){
        if(this.props.currentStrat!==nextProps.currentStrat){
          this.storecommentarr=[];
          this.setState({
            storecomment:[],
          })
        }
        var pt = this.storecommentarr.findIndex(i => i.time === nextProps.type.time); 
        if(this.props.type!==nextProps.type){
          if(pt!==-1){
            this.storecommentarr.splice(pt, 1, nextProps.type);
            this.setState({
                storecomment:this.storecommentarr,
            })
          }else if(pt<0){
            console.log("pushcomment");
            this.storecommentarr.unshift(nextProps.type);
            this.setState({
              storecomment:this.storecommentarr,
          })
          }
        }
      }
     
      render() {
     //console.log("comment"+this.props.type);  
   // console.log(this.storecommentarr);
    return (
      <div  className="col-md-3 small">
       <ReactTable
     data={this.storecommentarr}
     //pageSize={this.storecommentarr.length}
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
             maxWidth: '10%',
           },
           {
             Header: "Comment",
             accessor: "comment",
             maxWidth: '90%',
           },
           
           ]}
     ]}
   
     className="-striped -highlight table border round"
     showPageSizeOptions={false}
     defaultPageSize={3}
     style={{
      height: "190px" // This will force the table body to overflow and scroll, since there is not enough room
    }}
   />
   </div>
    );
  }
}