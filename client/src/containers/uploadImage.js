import React, { Component } from 'react';
import axios from 'axios';


class UploadImage extends Component {

    state = {
        file: null,
        files: [],
        fileName: null,
        caption: null,
        name: null,
        xtoken: null,
        isPrivate: false,
        isPrivateeeee: false,
        status: ''


      };
    

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeCaption = this.onChangeCaption.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onChangeName = this.onChangeName.bind(this);



        console.log('hi');
        const token = localStorage.getItem('challange_token');
        console.log(token);
        this.state.xtoken=token;

    }


    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        console.log(this.state.files,"hiii");

        for (let i = 0; i < this.state.files.length; i++) {
            console.log("hiiiiiii");
            formData.append(`myImage`, this.state.files[i]);
    }
    

        formData.append('imageCaption',this.state.caption);
        formData.append('isPrivate',this.state.isPrivate);



        console.log(formData);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'x-access-token': this.state.xtoken
            }
        };
        axios.post("write/upload",formData,config)
        .then((response) => {
            console.log(response.data)
            this.setState({status:"successfully uploaded"})
        //    alert("The file is successfully uploaded");
        }).catch((error) => {
            this.setState({status:"error accourd"})

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
    onChangeName(e) {
        this.state.name=e.target.value;
        console.log(this.state.isPrivate);
  
    }   
    onChangeCheck(e) {
        this.state.isPrivate=!this.state.isPrivate;

    }

    render() {
        return (

         <div className="uploadForm">
            <div>
                <h1>Upload</h1>
            </div>

            <form onSubmit={this.onFormSubmit}>
                <div>
                <input className="custom-file-input" type="file" multiple name="myImage" onChange= {this.onChange} />

                </div>
                <div>
                <button className="resetUploadedFiles">Reset files</button>


                </div>

                <div>
                <input className="uploadName" type="text" placeholder="Name" maxLength="50" onChange= {this.onChangeName} />

                </div>                
                <div>
                <textarea className="uploadCaption" placeholder="Write the caption with maximum 200 character here" maxLength="500" rows="15" name="caption" onChange={this.onChangeCaption} />

                </div>

                <div>
                    Is it a private image?
                    <input name="isPublic" type="checkbox"  onChange= {this.onChangeCheck} />
                </div>
                <div>
                <button type="submit">Upload</button>


                </div>



            </form>
            <h1>{this.state.status}</h1>
          </div> 
        )
    }
}

export default UploadImage