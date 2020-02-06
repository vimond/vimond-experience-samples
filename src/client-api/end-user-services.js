// src/react-auth0-wrapper.js
import React, { useState, useEffect, useContext } from 'react';
import {useAuth0} from './end-user-identity';
import ContentDiscoveryAPI,{SubProfileAPI, PlaylistAPI}  from './content-discovery-api';
//import jwtDecode from 'jwt-decode';


export const SubProfileContext = React.createContext();
export const useEndUserServices = (token) => useContext(SubProfileContext);

export const EndUserServicesProvider = ({
  children,
  ...initOptions // can be used if using auth0-spa-js
}) => {
  const [subProfileAPI, setSubProfileAPI] = useState();
  const [subProfile, setSubProfile] = useState();
  const [subProfiles, setSubProfiles] = useState();
  const [subProfileToken, setSubProfileToken] = useState();

  const [playlistAPI, setPlaylistAPI] = useState();
  const [playlist, setPlaylist] = useState();

  const [contentDiscoveryAPI, setContentDiscoveryAPI] = useState();

  const [errorMessage, setErrorMessage ] = useState();
  const [respondMessage, setRespondMessage] = useState();
  const [loading, setLoading] = useState(true);
  const {accessToken } = useAuth0();
  const playlistApiFromHook = new PlaylistAPI();

  useEffect(() => {
    const initEndUserServices = async () => {
      const subProfileFromHook = new SubProfileAPI();
      setSubProfileAPI(subProfileFromHook);

      setPlaylistAPI(playlistApiFromHook);
      const contentDiscoveryAPIFromHook = new ContentDiscoveryAPI();
      setContentDiscoveryAPI(contentDiscoveryAPIFromHook);

      setTimeout(function () {
      // Setting hooks variables
        if (accessToken && !subProfiles) {

          subProfileFromHook.getSubProfiles(accessToken).then(
            result => { setConstant(result.data);setLoading(false);}, // doesn't run
            error => { console.error(error.detail); setErrorMessage(error.detail); setLoading(false); }
          );
        }
        // set values if already stored

        if(localStorage.getItem('subProfile')!=null){
          setSubProfile(JSON.parse(localStorage.getItem('subProfile')));
          setSubProfileToken(localStorage.getItem('subProfileToken'));
          setPlaylist(JSON.parse(localStorage.getItem('playlist')));


        }
      }, 500);

    };
    initEndUserServices();
    // eslint-disable-next-line
  }, [accessToken,subProfileToken]); // rerun until accestoken is received after login.

  /** Below are the api's used by the different services */
  function initSubProfile (uid) {

    subProfileAPI.getSubProfileToken(accessToken,uid).then(
      result => {  setSubProfileToken(result.subprofileToken); addToLocalStorage(result.subProfileToken);initPlaylist(result.subProfileToken); },
      error => { console.error(error); setErrorMessage(error); }
    );

    subProfileAPI.getSingleSubProfile(accessToken,uid).then(
      result => { console.log('Subprofile',result.data); setSubProfile(result.data[0]); localStorage.setItem('subProfile',JSON.stringify(result.data[0]));},
      error => { console.error(error); setErrorMessage(error); }
    );

  }

  function createSubProfile (body){
    subProfileAPI.createNewSubprofile(accessToken,body).then(
      result => {  console.log(result.data); setSubProfile(result.data[0]);loadSubProfiles();},
      error => { console.error(error); setErrorMessage(error); }
    );
  }

  function deletSubProfile (uid){
    subProfileAPI.deleteSubProfile(accessToken,uid).then(result =>
    {loadSubProfiles();console.log(result);}
    );

  }

  function updateSubProfile (uid,body){
    subProfileAPI.updateSubProfile(accessToken,uid,body).then(
      result => {  loadSubProfiles(); setRespondMessage('Update'); },
      error => { console.error(error); setErrorMessage(error); }
    );
  }

  function loadSubProfiles (){
    setLoading(true);
    subProfileAPI.getSubProfiles(accessToken).then(
      result => { setSubProfiles(result.data);},
      error => { setErrorMessage(error.detail); }
    );
    setLoading(false);
  }

  /*********** Playlist API's  ****************/
  function initPlaylist(pSubProfileToken){

    playlistAPI.getAllPlaylists(accessToken,pSubProfileToken).then(
      result => {
        if(result.data.length===0){
          playlistAPI.createPlaylist(accessToken,JSON.stringify({ name: 'My Playlist', assetIds: []}),pSubProfileToken);
          localStorage.setItem('playlist','')
            .then(createdlist => {
              setPlaylist(createdlist.data[0]);
              localStorage.setItem('playlist',JSON.stringify(createdlist.data[0]));
            });
        }else{
          setPlaylist(result.data[0]);
          localStorage.setItem('playlist',JSON.stringify(result.data[0]));
        }
      },

      error => { console.error(error); setErrorMessage(error); }

    );
  }

  /** Playlist */
  function addAssetToPlaylist(playListId,assetId){

    playlistAPI.addAssetToPlaylist(accessToken, playListId,assetId,subProfileToken).then(
      result => {  setPlaylist(result.data[0]);},
      error => { console.error(error); setErrorMessage(error); }
    );
  }

  function removeAssetFromPlaylist(playListId,assetId){

    playlistAPI.removeAssetFromPlaylist(accessToken, playListId,assetId,subProfileToken).then(
      result => {  setPlaylist(result.data[0]);},
      error => { console.error(error); setErrorMessage(error); }
    );
  }

  /*********** Some Common functions ***********/
  function setConstant(result){
    setSubProfiles(result);
  }

  function addToLocalStorage  (subProfileToken) {
    localStorage.setItem('subProfileToken',subProfileToken);
  }

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
        updateSubProfile,
        playlist,
        addAssetToPlaylist,
        removeAssetFromPlaylist,
        contentDiscoveryAPI
      }}>
      {children}
    </SubProfileContext.Provider>
  );
};








