import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";


class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    isPublic: true,
    status: ''


  };

  constructor(props) {
    super(props);

    this.onChangeCheck = this.onChangeCheck.bind(this);


 
}



  handleSubmit = async (event) => {
    event.preventDefault();
    const data=new FormData(event.target);
    const username=data.get('username');
    const password=data.get('password');
    const passwordConfirm=data.get('repeatPassword');
    console.log(this.state.isPublic);
    
    if(password==passwordConfirm){
        console.log("password_is_valid");
        try {
          const values=await axios.post('api/register',{"userName": username, "password": password, "isPublic":this.state.isPublic} );
          this.setState({status:"successful"})

    
        } catch (err) {
          console.log("the username already exists")
          this.setState({status:"some information was wrong or error accourd"})

    
    
        
        }   
    }
    else{
        console.log("repeat_password");
    }




  };


  onChangeCheck(e) {
    this.state.isPublic=!this.state.isPublic;

}



  render() {

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
            is it a private account?
                <input name="isPublic" type="checkbox"  onChange= {this.onChangeCheck} />


          <input type="submit" value="Submit" />
        </form>
      <div>
        <h1>{this.state.status}</h1>
        </div>
      </div>

    );
  }
}

export default RegisterPage;