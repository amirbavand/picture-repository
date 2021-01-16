import React, { Component } from 'react';
import axios from 'axios';




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

    
        this.checkLoggedIn = this.checkLoggedIn.bind(this);
    
    }
    
    async componentDidMount() {
        await this.checkLoggedIn();
    
        


        this.setState({ checkStatus: true });
    
    
    
      }

      async checkLoggedIn() {
        try {
          const images_array=[];
          const product_id = this.props.match.params.product_id;


          const values = await axios.get('/api/productprofile',{ headers:{'x-access-token': this.state.xtoken, "productId":product_id}});
          console.log(values.data);



          
          const images=values.data.image_preview_list;
          const f="data:image/png;base64,"
          for(const image in images){

            const res=f.concat(images[image]);
            images_array.push(res)



          }

          
          const keys=values.data.product_keys;

          

          this.setState({previewImagesList: images_array, previewImagesKeyList:  keys });

     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          return false;
        }
        
      }

      handleClick(event){
        event.preventDefault();

    }
    


    render() {

        const arraying=this.state.previewImagesList;

        
        if(!this.state.checkStatus){
            return <h4>loading the page</h4>
          }
  //        <img src={res} />

  <           img src={arraying } width="400" height="400"/>

        return (
          <div>
              <h3>Caption</h3>

            <p>{this.state.caption}</p>

        <ul className="list-group">
            {arraying.map((arraying,index) => (
                <button onClick={this.handleClick} key={this.state.previewImagesKeyList[index]}>
            </button>

            ) )},
        </ul>





          </div>
    
        );
      }

}
export default Product;