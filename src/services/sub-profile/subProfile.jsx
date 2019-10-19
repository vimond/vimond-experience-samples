import React, { Component } from 'react';
import SubProfiles from '../../components/sub-profile/SubProfiles'
import { EndUserServicesProvider } from "../../client-api/end-user-services";
import { useAuth0 } from "../../client-api/end-user-identity";

// framework hack
export const LoadSubProfiles = (location) => {
  const {accessToken} = useAuth0();
  

 
  return (
    <EndUserServicesProvider>
    <SubProfiles accessToken={accessToken}/>
</EndUserServicesProvider>  
  );
}



class SubProfile extends Component {
  static NO_MENU = false;

  constructor(props) {
    super(props);
    this.state = {
      profiles:[]
    };
   
  }

 


  render() {
    
    
    return (
      <div className='page page-padding'>
      
        <LoadSubProfiles></LoadSubProfiles>
       
      </div>

    );
  }


}

export default SubProfile;
