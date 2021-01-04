import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Login from './login'
import RegisterPage from './register'





class registerLogin extends Component {


    state = {

      LoginMode: true,
      buttonString: 'register',
      xtoken: null


    };

    constructor(props) {
      super(props);

      this.onChange = this.onChange.bind(this);
      

  }



    onChange(e) {
      e.preventDefault();
      if(this.state.LoginMode){
        this.setState({LoginMode: false, buttonString: 'login'});
      }
      else{
        this.setState({LoginMode: true, buttonString: 'register'});

      }

  }



    render() {
        console.log(this.state.LoginMode);
        console.log("hiiiiiii");


      



        return (
          <div>
            <div>
        <button onClick={this.onChange}>{this.state.buttonString}</button>

                
                {this.state.LoginMode && <Login></Login>}
                {!this.state.LoginMode && <RegisterPage></RegisterPage>}

            </div>
          </div>
    
        );
      }

    

}

export default registerLogin;
