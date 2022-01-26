import React, { Component } from 'react'
import "./Leaders.css";
import axios from "axios";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css" 

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      loading:true
    }
  }
  async getUsersData(){
    const res = await axios.get('http://localhost:8080')
    console.log(res.data)
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
      Header: 'Score',  
      accessor: 'score',
      },
  ]
    return (
      <ReactTable  
      data={this.state.users}  
      columns={columns}  
   />
    )
  }
}
