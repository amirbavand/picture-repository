import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";


class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
  };


  handleSubmit = async (event) => {
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const passwordConfirm=data.get('repeatPassword');
    if(password==passwordConfirm){
        console.log("password_is_valid");
        try {
          const values=await axios.post('api/register',{"userName": username, "password": password} );
    
        } catch (err) {
          console.log("the username already exists")
    
    
        
        }   
    }
    else{
        console.log("repeat_password");
    }




  };


 


  render() {
//    if(this.state.redirectToMainPage){
 //     console.log("salam");
 //     return <Redirect to="/home" />
 //   }
    return (
      <div>
        <form  onSubmit={this.handleSubmit}>
            <div>
                usernme:
                <input type="text" name="username" id="username" />
            </div>
            <div>
                password:
                <input type="password" name="password" id="password" />
            </div>
            <div>
                password:
                <input type="password" name="repeatPassword" id="repeatPassword" />
            </div>

          <input type="submit" value="Submit" />
        </form>
      <div>
          <h1>{this.state.index}</h1>
        </div>
      </div>

    );
  }
}

export default RegisterPage;