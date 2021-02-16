import React, { Component } from 'react';
import './Navbar.css'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';

class Navbar extends Component {
    state = { 
        clicked: false ,
        signouted: false,
        profileLink:''
    
    }
    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;


        this.handleSignout = this.handleSignout.bind(this);
    
    }
    async componentDidMount() {
        try {
            const values = await axios.get('/read/username',{ headers:{'x-access-token': this.state.xtoken}});
            const link='/'+values.data["username"];
            this.setState({profileLink:link});

            
        } catch (error) {
            console.log("error accured");
            
        }
        
    
    
    
      }


    handleClick = () => {


        this.setState({ clicked: !this.state.clicked })
    }



    async handleSignout() {
        try {
            console.log("thus is signout")

          const values = await axios.delete('/api/logout',{ headers:{'x-access-token': this.state.xtoken}});
          this.setState({signouted: true  });

     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          console.log("could not sign out");
          return false;
        }
        
      }



    render() {
        
        if(this.state.signouted){
            return <Redirect to="/login" />

        }
        return(
            <nav className="NavbarItems">
                <h2 className="navbar-logo">React<i className="fab fa-react"></i></h2>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>


                <li key="1">
                        <Link className="nav-links" to="/home">Home</Link>



                    </li>
                    <li key="2">
                        <Link className="nav-links" to={this.state.profileLink}>Profile</Link>



                    </li>
                    
                    <li key="3">
                        <button className="nav-links-mobile" onClick={this.handleSignout}>Sign out</button>


                    </li>

                </ul>
                <button className={`btn  btn--medium btn--primary signout-button`} onClick={this.handleSignout}>
            Sign out
        </button>            
        </nav>
        )
    }
}

export default Navbar