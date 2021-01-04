import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect  } from 'react-router-dom';
import axios from 'axios';




class home extends Component {
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

      if(!this.state.checkLoginStatus){
        return (<h4>loading the page</h4>);
      }
      if(!this.state.loggedIn){
        return (<Redirect to="/reglogin" />);
      }
        return (
          <div>

            <Link to='/uploadimage'>
              <button type="button" className="btn btn-info">Add a new image </button>
            </Link>


          </div>

        );
      }

}
export default home;