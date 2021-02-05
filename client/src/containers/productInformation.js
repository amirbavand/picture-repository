import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'





class Product extends Component {
    state = {
        xtoken: null,
        caption: '',
        ownProfile: false,
        checkStatus: false,
        previewImagesList:[],
        previewImagesKeyList:[]




    };

    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;

    
        this.checkLoggedInGetProductInformation = this.checkLoggedInGetProductInformation.bind(this);
    
    }
    
    async componentDidMount() {
        await this.checkLoggedInGetProductInformation();
    
        


        this.setState({ checkStatus: true });
    
    
    
      }

      async checkLoggedInGetProductInformation() {
        try {
          const images_array=[];
          const product_id = this.props.match.params.product_id;


          const values = await axios.get('/read/productprofile',{ headers:{'x-access-token': this.state.xtoken, "productId":product_id}});
          console.log(values.data);



          
          const images=values.data.image_preview_list;
          const f="data:image/png;base64,"
          for(const image in images){

            const res=f.concat(images[image]);
            images_array.push(res)



          }

          
          const keys=values.data.image_keys;
          const caption=values.data.product_caption;
          console.log(caption,"this is caption");

          

          this.setState({previewImagesList: images_array, previewImagesKeyList:  keys, caption:caption });

     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          return false;
        }
        
      }

      handleClick(event){
        event.preventDefault();

    }
    handleClick(){
      console.log("hi");
    }
    


    render() {

        const arraying=this.state.previewImagesList;

        
        if(!this.state.checkStatus){
            return <h4>loading the page</h4>
          }


        return (
          <div>
              <h3>Caption</h3>

            <p>{this.state.caption}</p>

        <ul className="list-group">
            {arraying.map((arraying,index) => (
               < Link to={"/"+this.props.match.params.user_name+"/"+this.props.match.params.product_id+"/"+this.state.previewImagesKeyList[index]} key={this.state.previewImagesKeyList[index]}>

                <button onClick={this.handleClick}>
                  <img src={arraying } width="400" height="400"/>

                </button>
                </Link>


            ) )},
        </ul>





          </div>
    
        );
      }

}
export default Product;