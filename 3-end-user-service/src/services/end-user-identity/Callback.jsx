import React, { Component } from 'react';
import { Redirect } from 'react-router'







export const Redirecter = (location) => {
 
  
    if (/access_token|id_token|error/.test(window.location.hash)) { 
      setTimeout(() => {
      // Just waiting for localstorage to settle in end-user-identity-auth0-js before redirecting.
      }, 500);
    }
 
  return (
    <div>
    <Redirect to='/?showSubProfile=true'/>
   </div>
  );
}


class Callback extends Component {
  static NO_MENU = true;

  constructor(props) {
    super(props);
    this.state = {
      loadRedirect:false
    };
   
  }

  componentDidMount(){
    this.handleAuthentication(this.props);
  }

  handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
     
      setTimeout(() => {
        this.setState({ redirect: <Redirecter to='/'/>,loadRedirect:true });  
      }, 500);
  
    }else{
      this.setState({ redirect: <Redirecter to='/'/>,loadRedirect:true });  
    }
  }
 




  render() {
    const {redirect,loadRedirect} = this.state;
    
    return (
      <div>
        {loadRedirect && redirect}
      </div>

    );
  }


}

export default Callback;
