// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../../client-api/end-user-identity";
import { useEndUserServices } from "../../client-api/end-user-services";
import Icon from '../utils/icons/Icons'



const ProfileBar = ({onClick,showProfile,showCustomLogin,showSubProfile}) => {
  const { isAuthenticated, universalLoginSDK, user, logoutSDK,loading,isEmailVerified,loginLock ,refreshTokensSDK} = useAuth0();
  const { subProfile,loadSubProfiles } = useEndUserServices();
  const refreshToken = () => refreshTokensSDK();

  if (loading) {
    return (
      <ul>
        <li>
          <div>Loading menu...</div>
        </li>
      </ul>
    );
  }

  return (
    <>
     <div className='profile-menu-icon' >
      
        <button onClick={() => {onClick()}}>
       
{!isAuthenticated ?<Icon name='user' label='Login' className='profile-login-logo'/> :<img src={user.picture} alt="Profile"  width="50" onClick={refreshToken}/>}
          
        </button>
        {subProfile && <div className="profile-subprofile-header" onClick={() => {onClick(); refreshToken()}}><h2>{subProfile.subProfileName}</h2></div>}
       
      </div>
      <div className="profile-menu-glasspane" onClick={onClick} />

      <nav className="profile-menu" onClick={onClick} >
      <ul>
        {!isAuthenticated && (
        <>
          <li>
            <div onClick={() => universalLoginSDK()}> <Icon name='lock-open' label='Universal login' className=''/></div>
          </li>
          <li>
            <div onClick={showCustomLogin}><Icon name='lock-open' label='Custom login' className=''/></div>
          </li>
          <li>
            <div onClick={() => loginLock()}><Icon name='lock-open' label='Lock login' className=''/></div>
          </li>
        </>
        )}

        {isAuthenticated && (
          <>
          {!isEmailVerified && <li>
            <div>Email not verified !</div>
          </li>}
          <li>
            <div onClick={() => logoutSDK()}><Icon name='lock' label='Logout' className=''/></div>
          </li>
    
          <li>
            <div  onMouseUp={showProfile} onClick={onClick}><Icon name='user' label='My Account' className=''/></div>
          </li>
          <li>
            <div  onClick={() => {showSubProfile();loadSubProfiles()}}><Icon name='users' label='Switch profile' className=''/></div>
          </li>

          
        </>
      )}
      
    </ul>  
    </nav>
   </>
        
    
  );
 
};

export default ProfileBar;