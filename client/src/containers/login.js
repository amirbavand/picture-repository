import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";


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
    return <Redirect to="/home" />;



    
  };


 


  render() {

    if(this.state.redirectToHome){
    


      return <Redirect to="/home" />;
    }
    return (
      <div className="form">
        <div>
          <h1>login</h1>
        </div>

        <form  onSubmit={this.handleSubmit}>
          <div>
          <input className="input_text" type="text" name="username" placeholder="username" id="username" />

          </div>
          <div>
          <input className="input_text" type="password" name="password" placeholder="password" id="password" />

          </div>
          <div>
          <button type="submit" className="submitButton">submit</button>

          </div>
          <div>
            <h2>Not registered yet, Rigister Now</h2>
            <br/>
            

          </div>
          <div>
            <Link to="/register">
          <button  className="register" >register</button>
          </Link>


          </div>
        </form>
      <div>
          <h1>{this.state.index}</h1>
        </div>
      </div>

    );
  }
}

export default Login;