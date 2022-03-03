import React, { Component } from 'react'
import "./Leaders.css";
import axios from "axios";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css" 
import { Link } from "react-router-dom";

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      loading:true
    }
  }
  async getUsersData(){
    const res = await axios.get("https://backsteen.herokuapp.com/db")
    this.setState({loading:false, users: res.data})
  }
  componentDidMount(){
    this.getUsersData()
  }
  render() {
    const columns = [{  
      Header: 'Username',  
      accessor: 'name' ,
      },
      {  
        Footer: <Link to="/">
        <h3 className="ret" >New Game</h3>
        </Link> 
        },
     {  
      Header: 'Score',  
      accessor: 'score',
      }
      
  ]
    return (
      <ReactTable  
      data={this.state.users}  
      columns={columns}  
   />
    )
    
  }
};
