import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";


class Login extends Component {
  state = {
    username: '',
    password: '',
    redirectToHome: false
  };


  handleSubmit = async (event) => {
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');


    const values=await axios.post('api/login',{},{
      auth: {
        username: username,
        password: password 
      }}
    );
    console.log(values);
    localStorage.setItem('challange_token', values.data.token);

    this.setState({redirectToHome: true});
  };


 


  render() {

    if(this.state.redirectToHome){
    


      return <Redirect to="/home" />
    }
    return (
      <div>
        <form  onSubmit={this.handleSubmit}>
          <input type="text" name="username" id="username" />
          <input type="password" name="password" id="password" />
          <input type="submit" value="Submit" />
        </form>
      <div>
          <h1>{this.state.index}</h1>
        </div>
      </div>

    );
  }
}

export default Login;