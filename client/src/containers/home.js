import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import ProfileHeader from './profileHeader'



class home extends Component {
    state = {
        notLogin: false,
        xtoken: null,
        ownProfile: false,
        checkStatus: false,
        file: null,
        previewImagesList:[],
        previewImagesKeyList:[],
        imageTitle:[],
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

    
    }
    
    async componentDidMount() {
        await this.checkLoggedIn();
    
        
        console.log("I am checking");
        console.log("whaaaaaaaaaaaat",this.state.xtoken);
        this.setState({ checkStatus: true, user_name: this.props.match.params.user_name});
    
    
    
      }

    async checkLoggedIn() {
      try {
        const images_array=[];
        console.log(this.state.xtoken);

        const values = await axios.get('/read/feed',{ headers:{'x-access-token': this.state.xtoken}});
        console.log(values.data,"this is it")

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
        const titles=[]=values.data.image_title

        console.log("this is image",images);


        this.setState({previewImagesList: images_array, previewImagesKeyList:  keys, imageTitle: titles });


  
        return true;
    } catch (error) {
      console.log("error accourddd");
      this.setState({notLogin: true});
      
      }
      
    }



    render() {
      const arraying=this.state.previewImagesList;
      console.log("this is arraying",arraying);



        return (
          <div>
            <ProfileHeader status={this.state.followStatus} userName={this.state.user_name} />
        <ul className="list-group">
            {arraying.map((arraying,index) => (
              <div>
                <h2>{this.state.imageTitle[index]}</h2>



               <Link to={"/"+this.props.match.params.user_name+"/"+this.state.previewImagesKeyList[index]} key={this.state.previewImagesKeyList[index]}>

                <button onClick={this.handleClick} >

        <           img src={arraying } width="400" height="400"/>
            </button>
            </Link>
            </div>


            ) )},
        </ul>

        <div>
              {this.state.isPrivateAccount}
        </div>





          </div>
    
        );
      }

}
export default home;