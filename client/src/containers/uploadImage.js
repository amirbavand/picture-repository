import React, { Component } from 'react';
import axios from 'axios';


class UploadImage extends Component {

    state = {
        file: null,
        files: [],
        fileName: null,
        caption: null,
        xtoken: null,
        isPrivate: false,
        isPrivateeeee: false


      };
    

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeCaption = this.onChangeCaption.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);


        console.log('hi');
        const token = localStorage.getItem('challange_token');
        console.log(token);
        this.state.xtoken=token;

    }


    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        console.log(this.state.files,"hiii");

    //    formData.append('myImage',this.state.file);
        for (let i = 0; i < this.state.files.length; i++) {
            console.log("hiiiiiii");
            formData.append(`myImage`, this.state.files[i]);
    }
    
 //       formData.append('myImageName',this.state.isPrivateeeee);

   //     formData.append('imageCaption',this.state.caption);
   //     formData.append('isPrivate',this.state.isPrivate);

  //      console.log(formData.imageCaption);
 //       console.log(formData["imageCaption"]);

 //       console.log(formData.entries());


 //       console.log(this.state.caption,"fdkf;dl;lk");
 //       console.log("hiid;flgk;ldfgk");


        console.log(formData);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'x-access-token': this.state.xtoken
            }
        };
        axios.post("api/upload",formData,config)
        .then((response) => {
            console.log(response.data)
        //    alert("The file is successfully uploaded");
        }).catch((error) => {
    });




    }
    onChange(e) {
    //    this.setState({file:e.target.files[0], fileName:e.target.files[0].name});
        this.setState({ files: [...this.state.files, ...e.target.files] })
 //       this.setState({file:e.target.files});


        console.log(this.state.files);
        
    //    console.log(e.target.files[0].name);

        
    }

    onChangeCaption(e) {
        this.state.caption=e.target.value;
        console.log(this.state.isPrivate);
  //      this.setState({caption:e.target.value});

    }
    onChangeCheck(e) {
        this.state.isPrivate=!this.state.isPrivate;

    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" multiple name="myImage" onChange= {this.onChange} />
                <input type="text" name="caption" onChange= {this.onChangeCaption}/>
                is it a public image?
                <input name="isPublic" type="checkbox"  onChange= {this.onChangeCheck} />


                <button type="submit">Upload</button>
            </form>
        )
    }
}

export default UploadImage