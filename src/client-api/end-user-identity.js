// src/react-auth0-wrapper.js
import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from 'auth0-js';
import Auth0Lock  from 'auth0-lock';
import jwtDecode from 'jwt-decode';


const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, process.env.REACT_APP_VEID_AUTH_REDIRECT_PATH);

export const InitOptions = {
  domain: process.env.REACT_APP_VEID_AUTH_DOMAIN,
  clientID: process.env.REACT_APP_VEID_AUTH_CLIENT_ID,
  redirectUri: process.env.REACT_APP_VEID_AUTH_CALLBACK_URL,
  responseType: 'id_token token',
  audience: process.env.REACT_APP_VEID_AUTH_AUDIENCE,
  mana_audience:process.env.REACT_APP_VEID_AUTH_MANA_AUDIENCE,
  scope: process.env.REACT_APP_VEID_AUTH_SCOPE,
}

export const OIDCMetadata = {
  "oidc-address-country":' ',
  'oidc-address-locality':' ',
  "oidc-address-postal_code":' ',
  "oidc-address-region":' ',
  "oidc-address-street_address":' ',
  "oidc-birthdate":' ',
  "oidc-family_name":' ',
  "oidc-given_name":' ',
  "oidc-locale":' ',
  "oidc-name":' ',
  "oidc-nickname":' ',
  "oidc-phone_number":' ',
  "oidc-preferred_username":' ',
  "oidc-zoneinfo":' ',
  "oidc-gender":' '
}

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions // can be used if using auth0-spa-js
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [isEmailVerified, setIsEmailverified] = useState();
  const [user, setUser] = useState();
  const [userProfile, setUserProfile] = useState();
  const [accessToken, setAccessToken] = useState();
  const [accessTokenDecoded, setAccessTokenDecoded] = useState();
  const [userManagementToken, setUserManagementToken] = useState();
  const [auth0SDKClient, setAuth0SDK] = useState();
  const [auth0LockClient, setAuth0Lock] = useState();
  const [respondMessage, setRespondMessage] = useState();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = new createAuth0Client.WebAuth({
        domain: process.env.REACT_APP_VEID_AUTH_DOMAIN,
        clientID: process.env.REACT_APP_VEID_AUTH_CLIENT_ID,
        redirectUri: process.env.REACT_APP_VEID_AUTH_CALLBACK_URL,
        responseType: 'id_token token',
        audience: process.env.REACT_APP_VEID_AUTH_AUDIENCE,
        scope: process.env.REACT_APP_VEID_AUTH_SCOPE
      });


     const auth0LockFromHook = new Auth0Lock(process.env.REACT_APP_VEID_AUTH_CLIENT_ID,process.env.REACT_APP_VEID_AUTH_DOMAIN, {

        auth: {
          redirectUrl: process.env.REACT_APP_VEID_AUTH_CALLBACK_URL,
          audience: process.env.REACT_APP_VEID_AUTH_AUDIENCE,
          responseType: 'token id_token',
          params: {
            scope: process.env.REACT_APP_VEID_AUTH_SCOPE,
           // prompt: 'consent'
          }  
        },
        theme : {
          logo : '/vimond.png',
           primaryColor: '#1f2532'
        },    
        languageDictionary: {
          emailInputPlaceholder: "something@youremail.com",
          title: "Vimond Demo Portal",
          forgotPasswordAction: "Oh man, I forgot my password again!",
        },
       /* additionalSignUpFields: [{
          name: "oidc-nickname",
          placeholder: "enter nick name",
          /* The following properties are optional
          validator: function(address) {
            return {
               valid: address.length >= 10,
               hint: "Must have 10 or more chars" // optional
            };
          }
        },
        {
          name: "oidc-given_name",
          placeholder: "Enter your first name"
        },
        {
          name: "oidc-family_name",
          placeholder: "Enter your family name"
        }
      ]*/
    
      });


      setAuth0SDK(auth0FromHook);
      setAuth0Lock(auth0LockFromHook);
      
      // Setting hooks if values comes from callback after login.
      if (localStorage.getItem('accessToken')===null && window.location.hash.includes("access_token")) {
        auth0FromHook.parseHash((err, authResult) => {
          if (err) {
            return console.log(err);
          }
          console.log('authResults succesfully retreived and stored to local storage');
          addToLocalStorage(authResult); // adding auth result to localstorage.
          setConstantsFromAuthResult(authResult);
          retreiveManagementToken(auth0FromHook);
                
        });      
        
      }  // set values if already stored
      else if(localStorage.getItem('accessToken')!=null){
         setConstantFromLocalStorage();
      }
      
      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);



  /** Below are the methodes used by the different libraries */




/*************** auth0-js ***************/

    // logging in users via hosted Universal Login, or via social connections
    const universalLoginSDK = () => {
      auth0SDKClient.authorize();
    }
    
    // The login method is used for a custom made loginpage with connection to a userdatabase (not for social connections)
    function customLoginSDK  (login)  {   
      let options = {
        realm: 'VimondCustomDB',
        username: login.username,
        password: login.password,
      };
     return new Promise((resolve, reject) => { 
        auth0SDKClient.login(options, err => {  
          if(err){setRespondMessage(err.description)}
          console.error(err)
          reject(err)} ) 
        }); 
    };

// The login method is used for a custom made loginpage with connection to a userdatabase (not for social connections)
function signUpSDK  (option)  {   
  
  return new Promise((resolve, reject) => { 
     auth0SDKClient.signup({
       connection: 'VimondCustomDB',
       email: option.email,
       password:option.password,
     },function (err, resp) { 
       if(err){
         setRespondMessage(err.description);
         reject(err)} 
         else{
           setRespondMessage(resp);
           resolve(resp)
         }
       }) 
     }); 
 };


 // The login method is used for a custom made loginpage with connection to a userdatabase (not for social connections)
 function resetPasswordSDK  (option)  {   
  
  return new Promise((resolve, reject) => { 
      auth0SDKClient.changePassword({
        connection: 'VimondCustomDB',
        email: option.email,
      },function (err, resp) { 
        if(err){
          setRespondMessage(err.description);
          reject(err)} 
          else{
            setRespondMessage(resp);
            resolve(resp)
          }
        }) 
    }); 
  };


    // just logout and clean up you s..torage.
    const logoutSDK = async () => {
      cleanupOnLogout();
      auth0SDKClient.logout();
    }; 

   // refreshes your token when close to expire, after purchase or user updates
   const refreshTokensSDK = () => {
    auth0SDKClient.checkSession({}, (err, result) => {
      if (err) { 
        console.error('Refresh Error',err)
      } else {
        addToLocalStorage(result); // adding auth result to localstorage.
        setConstantsFromAuthResult(result);
        retreiveManagementToken(auth0SDKClient);
      }
    });
   }

   const retreiveManagementToken = (client) =>{
     // specify the managment api audience and scope, to retreive a management token to update the user metadata.
      client.checkSession({audience: InitOptions.mana_audience,scope: 'read:current_user update:current_user_metadata'}, (err, result) => {
        if (err) { 
          console.error('Retrieved Managment token Error',err)
        } else {
          console.log('Retrieved Managment token');
          setUserManagementToken(result.accessToken)
          localStorage.setItem('userManagementToken',result.accessToken);
          getUserProfile(result.accessToken,result.idTokenPayload.sub).then(profile => setUserProfile(profile) )
        }
      });
   }

   const  patchUserMetadata = (userManagementToken,userId,userMetadata) =>{ 
      var auth0Manage = new createAuth0Client.Management({domain: InitOptions.domain,token: userManagementToken});
      auth0Manage.patchUserMetadata(userId, userMetadata, (err, profile) => {
        if (profile) {
          console.log('user metadata successfully updated !')
        }else if(err){
            console.error("ERROR Patching user",err,profile);
        }
      });   
   }

    // eslint-disable-next-line
   const  getUserProfile = (userManagementToken,userId) =>{ 
    var auth0Manage = new createAuth0Client.Management({domain: InitOptions.domain,token: userManagementToken});
    
    return new Promise((resolve, reject) => { 
      auth0Manage.getUser(userId, (err, profile) => {
        if (profile) {
          console.log('userProfile retreived')
          setUserProfile(profile);
          localStorage.setItem('userProfile',JSON.stringify(profile));
          resolve(profile)
        }else if(err){
            reject(err)
            console.error("ERROR retreiving userProfile",err,profile);
        }
      }); 
    })
 }




/*********** Authlock ************/
 
const loginLock =() =>{
  auth0LockClient.show();
};


 

/*********** Some Common functions ***********/  
    function setConstantsFromAuthResult(authResult){
      setAccessToken(authResult.accessToken);
      setUser(authResult.idTokenPayload);
      setIsEmailverified(authResult.idTokenPayload.email_verified)
      setAccessTokenDecoded(jwtDecode(authResult.accessToken));
      setIsAuthenticated(true);   
    }

    function setConstantFromLocalStorage(){
      setAccessToken(localStorage.getItem('accessToken'));
      setUser(JSON.parse(localStorage.getItem('user')));
      setIsEmailverified(JSON.parse(localStorage.getItem('user')).email_verified);
      setUserProfile(JSON.parse(localStorage.getItem('userProfile')));
      setAccessTokenDecoded(JSON.parse(localStorage.getItem('accessTokenDecoded')));
      setUserManagementToken(localStorage.getItem('userManagementToken'));
      setIsAuthenticated(true);
    }

    function cleanupOnLogout(){
      localStorage.clear();
      setIsAuthenticated(false);
    }
    
    function addToLocalStorage  (authResult) {
      localStorage.setItem('accessToken',authResult.accessToken);
      localStorage.setItem('accessTokenDecoded',JSON.stringify(jwtDecode(authResult.accessToken)));
      localStorage.setItem('user',JSON.stringify(authResult.idTokenPayload));
      localStorage.setItem('expire',JSON.stringify(authResult.expiresIn));
      localStorage.setItem('expire_at',JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
    };
  

   

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        userProfile,
        isEmailVerified,
        loading,
        accessToken,
        accessTokenDecoded,
        userManagementToken,
        loginLock,
        customLoginSDK,
        signUpSDK,
        universalLoginSDK,
        logoutSDK,
        resetPasswordSDK,
        respondMessage,
        patchUserMetadata,
        refreshTokensSDK,}}>
      {children}
    </Auth0Context.Provider>
  );
};








