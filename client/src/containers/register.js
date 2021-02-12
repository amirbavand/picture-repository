import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import RegisterSuccessful from './registerSuccessful'


class RegisterPage extends Component {
  state = {
    isPublic: true,
    registered: false,
    userError: '',
    passError: '',
    repeatPassError:'',
    generalError:'',



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
    let usernameError='';
    let passwordError='';
    let repeatPasswordError='';
    let generalError='';
    let problem=false;
    if(username==''){
      usernameError="Please enter a username";
      problem=true;
    }
    if(password==''){
      passwordError="Please enter a password";
      problem=true;
    }
    if(passwordConfirm==''){
      repeatPasswordError="Please repeat the password";
      problem=true;
    }
    if(password!=passwordConfirm){
      generalError="Password is not match with the repeated password";
      problem=true;
    
    }

    this.setState({userError:usernameError, passError:passwordError, repeatPassError:repeatPasswordError, generalError:generalError});

    if(problem==true){
      return;
    }
    
    console.log("password_is_valid");
    try {
      const values=await axios.post('api/register',{"userName": username, "password": password, "isPublic":this.state.isPublic} );
      this.setState({registered:true})

  } catch (err) {
      console.log("the username already exists")
      this.setState({generalError:"username already exists"})



  };
  }

  onChangeCheck(e) {
    this.state.isPublic=!this.state.isPublic;

}



  render() {
    if(this.state.registered==true){
      return(
        <div>
          <RegisterSuccessful>
            
          </RegisterSuccessful>

        </div>



      );
    }
    return (
      <div className="form">



        <form  onSubmit={this.handleSubmit}>
            <div>
                <input className="input_text" type="text" name="username" placeholder="username" id="username" />
                <span style={{color: "red" }}>{this.state.userError}</span>
                  <br/>
                  <br/>
                  <br/>
            </div>
            <div>
                <input  className="input_text" type="password" name="password" placeholder="password" id="password" />
                <span style={{color: "red" }}>{this.state.passError}</span>
                  <br/>
                  <br/>
                  <br/>

            </div>
            <div>
                <input className="input_text" type="password" name="repeatPassword" placeholder="repeat password" id="repeatPassword" />
                <span style={{color: "red" }}>{this.state.repeatPassError}</span>
                  <br/>
                  <br/>
                  <br/>

            </div>
                <span style={{color: "red" }}>{this.state.generalError}</span>
                  <br/>
                  <br/>

            <div >
            <label className="label">Is it a private account?</label>

            <input id='myLabel'  name="isPublic" type="checkbox" label="fdkm"  onChange= {this.onChangeCheck} />

            </div>
            <br/>

          <div>
          <button type="submit" className="submitButton">submit</button>

          </div>
                  </form>
        <div>
            <h2>Already have an acoount, Login now</h2>
            <br/>
            

          </div>
          <div>
            <Link to="/login">
          <button  className="register" >Login</button>
          </Link>


          </div>
      <div>
        <h1>{this.state.status}</h1>
        </div>
      </div>

    );
  }
}

export default RegisterPage;