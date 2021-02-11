import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";


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
      <div className="form">

        <div>
          <h1>Register</h1>
        </div>

        <form  onSubmit={this.handleSubmit}>
            <div>
                <input className="input_text" type="text" name="username" placeholder="username" id="username" />
            </div>
            <div>
                <input  className="input_text" type="password" name="password" placeholder="password" id="password" />
            </div>
            <div>
                <input className="input_text" type="password" name="repeatPassword" placeholder="repeat password" id="repeatPassword" />
            </div>


            <div >
            <label className="label">Is it a private account?</label>

            <input id='myLabel'  name="isPublic" type="checkbox" label="fdkm"  onChange= {this.onChangeCheck} />



            </div>
            



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