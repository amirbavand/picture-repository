import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect  } from 'react-router-dom';




class  RegisterSuccessful extends Component {









    render() {


        return (
          <div >
              <h2>You have successfuly registerd</h2>

            <Link to='/login'>
              <button type="button" >Go to login page </button>
            </Link>


          </div>

        );
      }

}
export default RegisterSuccessful;