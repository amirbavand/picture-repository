import React, { Component } from 'react';
import axios from 'axios';

class ImagePresentation extends Component {
    state = {
        xtoken: null,
        file: ''
    };

    constructor(props) {
        super(props);
        const token = localStorage.getItem('challange_token');
        this.state.xtoken=token;

    
        this.checkLoggedInGetImage = this.checkLoggedInGetImage.bind(this);
    
    }

    async componentDidMount() {
        await this.checkLoggedInGetImage();
    
            
    
    
      }

      async checkLoggedInGetImage() {
        try {
          const product_id = this.props.match.params.product_id;
          const image_id = this.props.match.params.image_id;
          console.log(image_id,"this is imageid");
          console.log(product_id,"this is product id");

          const values = await axios.get('/read/originalphoto',{ headers:{'x-access-token': this.state.xtoken, "productId":product_id,  "imageId":image_id}});

          const imgstr=(values.data.imagestr);
          console.log(values.data);
          const f="data:image/png;base64,"
          const res=f.concat(imgstr);


          

          this.setState({file: res  });

     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          console.log("there is an error");
          return false;
        }
        
      }




    render() {
    //    console.log(this.state.file);


        return (
          <div>
              <h3>Caption</h3>
              <img src={this.state.file } width="400" height="400"/>




          </div>
    
        );

      }




}


export default ImagePresentation;
