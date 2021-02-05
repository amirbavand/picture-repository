import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'



class Profile extends Component {
    state = {
        xtoken: null,
        ownProfile: false,
        checkStatus: false,
        file: null,
        previewImagesList:[],
        previewImagesKeyList:[],
        productRoute: '',
        clicked:false,
        isPrivateAccount:''




    };

    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;

    
        this.checkLoggedIn = this.checkLoggedIn.bind(this);

    
    }
    
    async componentDidMount() {
        await this.checkLoggedIn();
    
        
        console.log("I am checking");
        console.log("whaaaaaaaaaaaat",this.state.xtoken);
        this.setState({ checkStatus: true });
    
    
    
      }

      async checkLoggedIn() {
        try {
          const images_array=[];
          const user_name = this.props.match.params.user_name;
          console.log(user_name,"this is username");
          console.log(this.state.xtoken);

          const values = await axios.get('/read/profile',{ headers:{'x-access-token': this.state.xtoken, "profileUserName":user_name}});
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

     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          return false;
        }
        
      }



    render() {

        const arraying=this.state.previewImagesList;
        console.log("this is arraying",arraying);

        if(!this.state.checkStatus){
            return <h4>loading the page</h4>
          }



        return (
          <div>
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