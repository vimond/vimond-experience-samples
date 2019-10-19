// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../../client-api/end-user-identity";
import Icon from '../utils/icons/Icons'



const ProfileBar = ({onClick,showProfile,showCustomLogin}) => {
  const { isAuthenticated, universalLoginSDK, user, logoutSDK,loading,isEmailVerified,loginLock } = useAuth0();

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
        <button onClick={onClick}>
          {!isAuthenticated ?<Icon name='user' label='Login' className='profile-login-logo'/> :<img src={user.picture} alt="Profile"  width="50"/>}
        </button>
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
            <div  onMouseUp={showProfile} onClick={onClick}><Icon name='edit' label='Profile' className=''/></div>
          </li>
        </>
      )}
      
    </ul>  
    </nav>
   </>
        
    
  );
 
};

export default ProfileBar;