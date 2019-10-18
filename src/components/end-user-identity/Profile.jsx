import React from "react";
import {useAuth0} from '../../client-api/end-user-identity';
import Tabs from '../utils/tabs/tabs'
import EditProfile from './editProfile'


import PrettyJSON from '../utils/PrettyJSON'





const  AuthProfile  = () => {
    const { loading, user,accessToken, accessTokenDecoded, patchUserMetadata,userManagementToken,refreshTokensSDK,userProfile } = useAuth0();
    //const decodedAccesToken = JSON.parse(localStorage.getItem('accessTokenPayload'));
   
    
   // Check if you are authenticated. 
   
    if (loading || !user ) {
      
      return (
        <div>Loading...</div>
      );
    }
    
    
    
    return (
    
     <div className="profile">
        
        <div className="profile-info">
          <div className="profile-img">
            <span><img src={user.picture} alt="Profile" /></span>
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          {user['https://vimond/user_metadata'] && Object.entries(user['https://vimond/user_metadata']).map(([key, value]) =>  
            <p key={value}> {value}</p>
          )}
          
        </div>
        
        <div className={'profile-content'}>
          <Tabs>
          <div label="Edit Profile">
              <EditProfile user={user} patchUserMetadata={patchUserMetadata} userManagementToken={userManagementToken} refreshTokensSDK={refreshTokensSDK}/>
            </div>
            <div label="Json objects">
              <div className='pretty-container'>
                <PrettyJSON jsonData={user} title='User token decoded'/>
                <PrettyJSON jsonData={userProfile} title='User Profile'/>
                <PrettyJSON jsonData={{accessToken}} title='Access token' expanded={true}/>
                <PrettyJSON jsonData={accessTokenDecoded} title='Access Token decoded' expanded={true} />
              </div> 
            </div>
           
            <div label="Sarcosuchus">
              Nothing to see here, this tab is <em>extinct</em>!
            </div>
          </Tabs> 
          </div>
        
     
         
    
      </div>
    
    );
  };
  export default AuthProfile