import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import ProfileHeader from './profileHeader'



class Profile extends Component {
    state = {
        notLogin: false,
        xtoken: null,
        ownProfile: false,
        checkStatus: false,
        file: null,
        previewImagesList:[],
        previewImagesKeyList:[],
        productRoute: '',
        clicked:false,
        isPrivateAccount:'',
        followStatus:'',
        user_name:'admin'




    };

    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;

    
        this.checkLoggedIn = this.checkLoggedIn.bind(this);
        this.getStatus=this.getStatus.bind(this)

    
    }
    
    async componentDidMount() {
        await this.checkLoggedIn();
        await this.getStatus();
    
        
        console.log("I am checking");
        console.log("whaaaaaaaaaaaat",this.state.xtoken);
        this.setState({ checkStatus: true, user_name: this.props.match.params.user_name});
    
    
    
      }

    async checkLoggedIn() {
      try {
        const images_array=[];
        const user_name = this.props.match.params.user_name;
        console.log(user_name,"this is username");
        console.log(this.state.xtoken);

        const values = await axios.get('/read/profile',{ headers:{'x-access-token': this.state.xtoken, "profileUserName":user_name}});
        console.log(values.data,"this is it")
        if(values.data.massage=='this account is private'){
          this.setState({isPrivateAccount:"this account is protected"});
          return
        }
        console.log(values.data.product_keys);
        console.log(values.data.image_preview_list);
        const images=values.data.image_preview_list;
        const f="data:image/png;base64,"
        for(const image in images){
          console.log(images[image]);
          const res=f.concat(images[image]);
          images_array.push(res)

        }

        
        const keys=values.data.product_keys;
        console.log("this is image",images);


        this.setState({previewImagesList: images_array, previewImagesKeyList:  keys });


  
        return true;
    } catch (error) {
      console.log("error accourddd");
      this.setState({notLogin: true});
      
      }
      
    }

    async getStatus(){
      try {
        const user_name = this.props.match.params.user_name;

        const values = await axios.get('/write/followstatus',{ headers:{'x-access-token': this.state.xtoken, "userToFollow":user_name}});
        const status=values.data.status
        this.setState({followStatus:status})

        
      } catch (error) {
        console.log("error accourddd");


        
      }

    }



    render() {

        const arraying=this.state.previewImagesList;
        console.log("this is arraying",arraying);

        if(!this.state.checkStatus){
            return <h4>loading the page</h4>
          }
        if(this.state.notLogin){
          return <Redirect to="/login" />

        }




        return (
          <div>
            <ProfileHeader status={this.state.followStatus} userName={this.state.user_name} />
        <ul className="list-group">
            {arraying.map((arraying,index) => (

               <Link to={"/"+this.props.match.params.user_name+"/"+this.state.previewImagesKeyList[index]} key={this.state.previewImagesKeyList[index]}>

                <button onClick={this.handleClick} >

        <           img src={arraying } width="400" height="400"/>
            </button>
            </Link>


            ) )},
        </ul>

        <div>
              {this.state.isPrivateAccount}
        </div>





          </div>
    
        );
      }

}
export default Profile;