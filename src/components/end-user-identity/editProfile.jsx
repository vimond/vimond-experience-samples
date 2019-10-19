import React from 'react';
import InputGroup from '../utils/input/inputgroup'
import {OIDCMetadata} from '../../client-api/end-user-identity'


 const EditProfile = ({user,patchUserMetadata,userManagementToken,refreshTokensSDK}) => {
 
  const userMetadata = metadata();
  
  // you can only update oidc compliant metadata fields. see documentation
  function filterOIDCOnly(user){
    return user[0].indexOf("oidc-") > -1 ;

  }
  
  function metadata () {
    let InputData = OIDCMetadata;
    if(user['https://vimond/user_metadata']){
       Object.entries(user['https://vimond/user_metadata']).filter(filterOIDCOnly).map(([key, value]) => InputData[key] = value);
    }
    return InputData;
  }

  const update = () =>{patchUserMetadata(userManagementToken,user.sub ,userMetadata);refreshTokensSDK()}

 
  const onChange = (e) => { 
      let value = e.target.value;
      let valueKey = e.target.dataset.id;
      userMetadata[valueKey] = value;
  };
    
  return (
        <div className="edit-profile-form">
          <div className='edit-profile-info'> 
            <InputGroup>
              { Object.entries(userMetadata).map(([key, value]) => 
                <input label={key} id={key} key={key} defaultValue={value} onChange={onChange}/>  
              )}                     
            </InputGroup>
            </div>
            <div className='edit-profile-actions'>
              <div className='edit-action-group'>
                
                {user.email_verified?<button onClick={update} >Update</button> : <p> Verify your email to update user!</p>}
              </div>
            </div>
          </div>
    );

  }

  export default EditProfile;
