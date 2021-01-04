import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";


class main extends Component {
  state = {
    loggedIn: false,
    xtoken: null,
    checkLoginStatus: false
    
  };
  
  constructor(props) {
    super(props);
    const token = localStorage.getItem('challange_token');

    this.state.xtoken=token;
    this.checkLoggedIn = this.checkLoggedIn.bind(this);




    

}




  async componentDidMount() {
    await this.checkLoggedIn();
    console.log(this.state.loggedIn,"yessssss");

    
    console.log("I am checking");
    console.log("whaaaaaaaaaaaat",this.state.loggedIn);
    this.setState({ checkLoginStatus: true });



  }


  async checkLoggedIn() {
    try {
      const values = await axios.get('/api/',{ headers:{'x-access-token': this.state.xtoken}});
      this.state.loggedIn=true;

      return true;
  } catch (error) {
      return false;
    }
    
  }




  render() {
    console.log(this.state.loggedIn);
    if(!this.state.checkLoginStatus){
      return <h4>loading the page</h4>
    }
    if(this.state.loggedIn){
      return <Redirect to="/home" />
    }
    console.log("salam");

    return <Redirect to="/reglogin" />


  }
}

export default main;