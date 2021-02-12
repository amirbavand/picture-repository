import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";


class UploadImage extends Component {

    state = {
        file: null,
        files: [],
        fileName: null,
        title: '',
        caption: '',
        xtoken: null,
        isPrivate: false,
        isPrivateeeee: false,
        status: '',
        fileError: '',
        titleError: '',
        captionError: '',
        fileInputKey: Date.now(),


      };
    

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeCaption = this.onChangeCaption.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onResetFiles = this.onResetFiles.bind(this);



        console.log('hi');
        const token = localStorage.getItem('challange_token');
        console.log(token);
        this.state.xtoken=token;

    }


    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        console.log(this.state.files,"hiii");
        let fileError='';
        let titleError='';
        let captionError='';
        let problem=false;

        if (this.state.files.length==0){
            fileError="please choose some pictures";
            problem=true;
          }
        if(this.state.title==''){
            titleError="Please enter a title";
            problem=true;
          }
        if(this.state.caption==''){
            captionError="Please write a caption";
            problem=true;
        }
        this.setState({fileError:fileError, titleError:titleError, captionError:captionError});

        if(problem==true){
            return;
        }

        for (let i = 0; i < this.state.files.length; i++) {
            console.log("hiiiiiii");
            formData.append(`myImage`, this.state.files[i]);
    }
    
        formData.append('imageTitle',this.state.title);
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
            this.setState({status:"uploaded"})
        }).catch((error) => {
            this.setState({status:"error accourd"})

    });




    }
    onChange(e) {
        this.setState({ files: [...this.state.files, ...e.target.files] })


        console.log(this.state.files);

    }

    onChangeCaption(e) {
        this.state.caption=e.target.value;
        console.log(this.state.isPrivate);


  
    }
    onChangeTitle(e) {
        this.state.title=e.target.value;
        console.log(this.state.isPrivate);
  
    }   
    onChangeCheck(e) {
        this.state.isPrivate=!this.state.isPrivate;

    }
    onResetFiles(e) {
        this.setState({files:[], fileInputKey: Date.now()})
        this.state.files=[];

    }

    render() {
        if(this.state.status=="uploaded"){
            return <Redirect to="/home" />;

        }
        return (

         <div className="uploadForm">
            <div>
                <h1>Upload</h1>
            </div>

            <form onSubmit={this.onFormSubmit}>
                <div>
                <input className="custom-file-input" type="file" multiple name="myImage" onChange= {this.onChange} key={this.state.fileInputKey} />

                </div>
                    <span style={{color: "red" }}>{this.state.fileError}</span>
                <br/>

                <div>
                <button className="resetUploadedFiles" onClick={this.onResetFiles}>Reset files</button>


                </div>

                <div>
                <input className="uploadName" type="text" placeholder="Title" maxLength="50" onChange= {this.onChangeTitle} />

                </div>    
                <span style={{color: "red" }}>{this.state.titleError}</span>
                <br/>


                <div>
                <textarea className="uploadCaption" placeholder="Write the caption with maximum 200 character here" maxLength="500" rows="15" name="caption" onChange={this.onChangeCaption} />

                </div>
                <span style={{color: "red" }}>{this.state.captionError}</span>
                <br/>
                <br/>

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