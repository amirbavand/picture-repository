import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'



class ProfileHeader extends Component {
    state = {
        xtoken: null,
        buttonText:''




    };

    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;
        this.onChangeState=this.onChangeState.bind(this);


    

    
    }
    componentDidMount(){
        const status=this.props.status
        if(status=="following"){
            this.setState({buttonText:"Unfollow"})
        }
        else if(status=="not Following"){
            this.setState({buttonText:"Follow"})
        }
        else if(status=="requested"){
            this.setState({buttonText:"Requested"})
        }
        if(status=="user does not exist"){
            this.setState({buttonText:"Not Exist"})
        }
        if(status=="yourself"){
            this.setState({buttonText:"edit password"})
        }
    }


    async onChangeState(e) {

        const status=this.state.buttonText

        if(status=="Follow"){
            console.log("this is follow");

            try {
                
                const values = await axios.post('/write/follow',{},{ headers:{'x-access-token': this.state.xtoken, "userToFollow":this.props.userName}});
                const responseStatus=values.data.status;
                if(responseStatus=="followd"){
                    this.setState({buttonText:"Unfollow"});

                }
                else if(responseStatus=="requested"){
                    this.setState({buttonText:"Requested"});

                }                
            } catch (error) {
                console.log("something went wrong");
                
            }


        }
        else if(status=="Unfollow"){
            console.log("this is onfollow");
            try {
                
                const values = await axios.post('/write/unfollow',{},{ headers:{'x-access-token': this.state.xtoken, "userToUnfollow":this.props.userName}});
                const responseStatus=values.data.status;
                if(responseStatus=="unfollowd"){
                    this.setState({buttonText:"Follow"});

                }                
            } catch (error) {
                console.log("something went wrong");
                
            }
        }
        else if(status=="Requested"){
            try {
                
                const values = await axios.post('/write/unfollow',{},{ headers:{'x-access-token': this.state.xtoken, "userToUnfollow":this.props.userName}});
                const responseStatus=values.data.status;
                if(responseStatus=="unfollowd"){
                    this.setState({buttonText:"Follow"});

                }                
            } catch (error) {
                console.log("something went wrong");
                
            }        }
        if(status=="Not Exist"){
            return;
        }
        if(status=="edit password"){
            this.setState({buttonText:"edit password"})
        }
    }

    
    



    render() {
        const status=this.props.status;
        const text=status;




    return (
        <div>
            <button onClick={this.onChangeState}>{this.state.buttonText} </button>
            <h2>{this.props.userName}</h2>
     


        </div>
    
        );
      }
    }
export default ProfileHeader;