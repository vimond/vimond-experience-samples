import jwtDecode from 'jwt-decode';


const SUB_PROFILE_SERVICE_HOST = process.env.REACT_APP_SUB_PROFILE_SERVICE_HOST;
const CD_SERVICE_HOST = process.env.REACT_APP_CD_API_HOST;
const DEVICE_SERVICE_HOST = 'TODO';
const PLAYLIST_SERVICE_HOST = 'TODO'


let fetchOptions = (method, accesToken=undefined , body=undefined , subProfileToken=undefined  )=> {
  let option = { headers: {
      'Content-Type': 'application/json',
    },
      method: method,
    };

    if(accesToken){
      option.headers['Authorization'] = `Bearer  ${accesToken}`
    }
    if(subProfileToken){
      option.headers['X-Vimond-Subprofile'] = subProfileToken;
    }
    if(body){
      option['body'] = body;
    }
    return option;
  }

  const request = (url,fetchOptions) =>{
    return new Promise((resolve, reject) => { fetch(`${url}`,fetchOptions)
      .then(response => 
        {
          if(response.status === 204){
              resolve('No data');
          }else
          if (response.ok){
            const resp = response.json()
            resolve (resp);
          }else{
            reject (response.json())
          }
        })
      .catch(err => console.error('An error occurred while fetching ', err));
    })
  }


export default class ContentDiscoveryAPI {
 

/* ASSETS */

    /**
     * Returns the metadata for a single asset
     * @param {*} assetId 
     */

     getSingleAsset(assetId) {
        const url = `${CD_SERVICE_HOST}/assets/${assetId}`;
        return request(url,fetchOptions('get'));
      }
    
      /**
       * Returns assets from a specified category with pagination
       * See documentation for more options. 
       * Use assetType=" main" to filter out child/version and return the metadata placeholder if you are using source versions.
       *  
       * @param {*} categoryId 
       */
      getAssetsFromCategoryId(categoryId) {

        const url = `${CD_SERVICE_HOST}/assets/?query=category.id:${categoryId} AND assetType:" main"&sort=id`;         
        return request(url,fetchOptions('get'));
      }

    /* CATEGRIES */

   /**
       * Returns a category from a specified categoryId
       * See documentation for more options. 
       *  
       * @param {*} categoryId 
       */
      getSingleCategory(categoryId,param) {

        const url = `${CD_SERVICE_HOST}/categories/${categoryId}${param}`;
        return request(url,fetchOptions('get'));
      }

        /**
       * Returns a category from a specified categoryId
       * See documentation for more options. 
       *  
       * @param {*} categoryId 
       */
      getSubCategories(categoryId,param) {

        const url = `${CD_SERVICE_HOST}/categories/?query=parentId:${categoryId}${param}`;
        return request(url,fetchOptions('get'));
         
      }


      /** CONTEN CURATOR LISTS */

      getContentCurationListByID(ccId) {

        const url = `${CD_SERVICE_HOST}/lists/${ccId}`;
        return request(url,fetchOptions('get'));
      }


}

// TODO Remove
export const SearchAssetAPI =(query) => {
  const url = `${CD_SERVICE_HOST}/assets/${query}`;
  return request(url,fetchOptions('get'));  
}



export class SubProfileAPI  {     
      
  getSubProfiles (accessToken) {
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles`;
    return request(url,fetchOptions('get',accessToken));
  }
  
 getSingleSubProfile (accessToken,euid) {
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles/${euid}`;
    return request(url,fetchOptions('get',accessToken));
  }

  getSubProfileToken (accessToken,euid){
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles/${euid}/token`;
    return new Promise((resolve, reject) => { fetch(`${url}`,fetchOptions('get',accessToken))
    .then(response => 
      {
        if (response.ok){
          const resp = {subProfileToken : response.headers.get("X-Vimond-Subprofile"),subProfileTokenPayload:jwtDecode(response.headers.get("X-Vimond-Subprofile"))};
          localStorage.setItem('subProfileToken', JSON.stringify(resp.subprofileToken))
          // the subprofile token will be picked up by useAuth0. 
          resolve (resp);
        }else{
          reject (response)
        }
      })
    .catch(err => console.error('An error occurred while fetching ', err));
  })
  }

  createNewSubprofile (accessToken, options){
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles/`;
    return request(url,fetchOptions('post',accessToken,JSON.stringify(options)));
  }

  updateSubProfile (accessToken, euid,options){
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles/${euid}`;
    return request(url,fetchOptions('put',accessToken,JSON.stringify(options)));
  }
  deleteSubProfile (accessToken, euid){
    const url = `${SUB_PROFILE_SERVICE_HOST}/subprofiles/${euid}`;
    return request(url,fetchOptions('delete',accessToken));
  }

}


export class DeviceApi {

  deleteDevice(accessToken,deviceUdid,ruleName) {
    const url = `${DEVICE_SERVICE_HOST}/usages/${ruleName}/${deviceUdid}`;
    return request(url,fetchOptions('delete',accessToken));
  }

  getDeviceUsages(accessToken){
    const url = `${DEVICE_SERVICE_HOST}/usages`;
    return request(url,fetchOptions('get',accessToken));
  };

}


export  class PlaylistAPI {
 
 
  
  getAllPlaylists(accessToken, subProfileToken=undefined){
    return this.request(PLAYLIST_SERVICE_HOST,fetchOptions('get',accessToken,undefined,subProfileToken));
  }

  getPlaylist(accessToken, playlistId, subProfileToken=undefined){
    const url = `${DEVICE_SERVICE_HOST}/${playlistId}`;
    return request(url,fetchOptions('get',accessToken,undefined,subProfileToken));
  }
  

  createPlaylist(accessToken, body, subProfileToken=undefined){     
      return this.request(PLAYLIST_SERVICE_HOST,fetchOptions('post',accessToken,body,subProfileToken));
  }

  updatePlaylist( accessToken, playListId, body, subProfileToken=undefined){
    const url = `${DEVICE_SERVICE_HOST}/${playListId}`;
    return request(url,fetchOptions('put',accessToken,body,subProfileToken));
  }

  addAssetToPlaylist(accessToken, playListId,assetId,subProfileToken=undefined){
    const url = `${DEVICE_SERVICE_HOST}/${playListId}/assets/${assetId}`;
    return request(url,fetchOptions('post',accessToken,undefined,subProfileToken));
  }


  removeAssetFromPlaylist(accessToken, playListId,assetId,subProfileToken=undefined){
    const url = `${DEVICE_SERVICE_HOST}/${playListId}/assets/${assetId}`;
    return request(url,fetchOptions('delete',accessToken,undefined,subProfileToken));
  }

  getPlaylistWithMetadata(accessToken, playlistId, subProfileToken=undefined){

   return this.getPlaylist(accessToken, playlistId, subProfileToken)
    .then(playlist =>{
      let assets = [];
      for (let index = 0; index < playlist.data[0].assetIds.length; index++) {
         assets.push({id:playlist.data[0].assetIds[index]});
      }
      return assets;
    }).then(assetIds =>{
      if (assetIds.length===0){
        return Promise.resolve([]);
      }
    
        let query = "?query=id:"+assetIds[0].id;
        for (var i = 1; i < assetIds.length; i++) {
          query = query + " OR id:"+assetIds[i].id;
        }
        const url = `${CD_SERVICE_HOST}/assets/${query}`;
        return request(url,fetchOptions('get'));
      })
    //return Promise.resolve(assets);
  }
}


