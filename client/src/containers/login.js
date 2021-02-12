import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";


class Login extends Component {
  state = {
    username: '',
    password: '',
    redirectToHome: false,
    userError: '',
    passError: '',
    generalError:''

  };


  handleSubmit = async (event) => {

    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    let usernameError='';
    let passwordError='';
    this.state.generalError='';
    if (username==''){
      usernameError="Username is empty"
    }
    if(password==''){
      passwordError="Password is empty"
    }
    this.setState({userError:usernameError, passError:passwordError});

    if(username==''|| password==''){
      return;
    }
    console.log(password);
    console.log(username);


    try {
      const values=await axios.post('api/login',{},{
        auth: {
          username: username,
          password: password 
        }}
      );
      console.log(values.data);
      localStorage.setItem('challange_token', values.data.token);
      this.setState({redirectToHome: true});
      return <Redirect to="/home" />;
      
    } catch (error) {
      this.setState({generalError:"username or password is incorect"})
      
    }




    
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
            <span style={{color: "red" }}>{this.state.userError}</span>
          <br/>
          <br/>
          <br/>



          </div>
          <div>
          <input className="input_text" type="password" name="password" placeholder="password" id="password" />
          <span style={{color: "red" }}>{this.state.passError}</span>
          <br/>
          <span style={{color: "red" }}>{this.state.generalError}</span>

          <br/>
          <br/>
          <br/>

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