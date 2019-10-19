// src/react-auth0-wrapper.js
import React, { useState, useEffect, useContext } from "react";
import {useAuth0} from './end-user-identity'
import {SubProfileAPI}  from './content-discovery-api';
//import jwtDecode from 'jwt-decode';


export const SubProfileContext = React.createContext();
export const useEndUserServices = (token) => useContext(SubProfileContext);

export const EndUserServicesProvider = ({
  children,
  ...initOptions // can be used if using auth0-spa-js
}) => {
  const [subProfile, setSubProfile] = useState();
  const [subProfiles, setSubProfiles] = useState();
  const [subProfileToken, setSubProfileToken] = useState();


  const [subProfileAPI, setSubProfileAPI] = useState();

  const [errorMessage, setErrorMessage ] = useState()
  const [respondMessage, setRespondMessage] = useState();
  const [loading, setLoading] = useState(true);
  const {accessToken } = useAuth0();
  

  useEffect(() => {
    const initEndUserServices = async () => {
      const subProfileFromHook = new SubProfileAPI();
      setSubProfileAPI(subProfileFromHook);
  
      setTimeout(function () {
      // Setting hooks variables
      if (accessToken) {   
        console.log('accesstoken is ok, loading subprofiles')              
          subProfileFromHook.getSubProfiles(accessToken).then(
            result => { console.log('SubProfiles loaded',result.data); setConstant(result.data);setLoading(false)}, // doesn't run
            error => { console.error(error.detail); setErrorMessage(error.detail); setLoading(false) }  
          );   
      }else{ console.log('accesstoken is not loaded')     } 
       // set values if already stored
      
      if(localStorage.getItem('subProfile')!=null){
         setSubProfile(JSON.parse(localStorage.getItem('subProfile')));
         setSubProfileToken(localStorage.getItem('subProfileToken'));
      }
    }, 500) 
      
    };
    initEndUserServices();
    
  }, [accessToken]); // rerun until accestoken is received after login. 



  /** Below are the api's used by the different services */

  function initSubProfile (uid) {
   
     subProfileAPI.getSubProfileToken(accessToken,uid).then(
      result => {  setSubProfileToken(result.subprofileToken); addToLocalStorage(result.subProfileToken) }, 
      error => { console.error(error); setErrorMessage(error) }  
    )  

    subProfileAPI.getSingleSubProfile(accessToken,uid).then(
      result => { console.log(result.data); setSubProfile(result.data[0]); localStorage.setItem('subProfile',JSON.stringify(result.data[0]))}, 
      error => { console.error(error); setErrorMessage(error) }  
    )  
    
  }

  function createSubProfile (body){
    subProfileAPI.createNewSubprofile(accessToken,body).then(
      result => {  console.log(result.data); setSubProfile(result.data[0]);loadSubProfiles()}, 
      error => { console.error(error); setErrorMessage(error) }  
    )
  }

  function deletSubProfile (uid){
    subProfileAPI.deleteSubProfile(accessToken,uid).then(result =>
      {loadSubProfiles();console.log(result)}
     )   
      
  }

  function updateSubProfile (uid,body){
    subProfileAPI.updateSubProfile(accessToken,uid,body).then(
      result => {  loadSubProfiles(); setRespondMessage('Update') }, 
      error => { console.error(error); setErrorMessage(error) }  
    )
  }

  function loadSubProfiles (){
    setLoading(true);
    subProfileAPI.getSubProfiles(accessToken).then(
      result => { setSubProfiles(result.data)}, 
      error => { setErrorMessage(error.detail) }  
    );  
    setLoading(false); 
  }
  



 

/*********** Some Common functions ***********/  
   
    
    function setConstant(result){
      setSubProfiles(result)
    }

    
    function addToLocalStorage  (subProfileToken) {
      localStorage.setItem('subProfileToken',subProfileToken);
    };
  

   

  return (
    <SubProfileContext.Provider
      value={{
        subProfile,
        subProfiles,
        subProfileToken,
        loading,
        errorMessage,
        respondMessage,
        subProfileAPI,
        initSubProfile,
        createSubProfile,
        loadSubProfiles,
        deletSubProfile,
        updateSubProfile
          }}>
      {children}
    </SubProfileContext.Provider>
  );
};








