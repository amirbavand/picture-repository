import React, { Component } from 'react';
import axios from 'axios';



class Profile extends Component {
    state = {
        xtoken: null,
        ownProfile: false,
        checkStatus: false,
        file: null,



    };

    constructor(props) {
        super(props);
    
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
          const values = await axios.get('/api/profile',{ headers:{'x-access-token': this.state.xtoken}});
          console.log(values.data.massage[0]);
          this.setState({file: values.data.massage[0]});
     //     this.state.checkStatus=true;

    
          return true;
      } catch (error) {
          return false;
        }
        
      }

      myfunction(){
          return true;
      }
    


    render() {
   //     const d="iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
        const d= this.state.file;

        console.log(d);
        const user_name = this.props.match.params.user_name;
        const f="data:image/png;base64,"
        const res=f.concat(d);
        const arraying=[res,res];

        if(!this.state.checkStatus){
            return <h4>loading the page</h4>
          }


        return (
          <div>
        <img src={res} />
        <ul className="list-group">
            {arraying.map(arraying => (
                <button onClick={this.myfunction} key={arraying}>
 //               <li className="list-group-item list-group-item-primary">
  //      <           img src={arraying} />
    //        </li>
            </button>

            ) )},
        </ul>





          </div>
    
        );
      }

}
export default Profile;