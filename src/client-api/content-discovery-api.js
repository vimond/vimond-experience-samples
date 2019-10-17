const CD_SERVICE_URL = process.env.REACT_APP_CD_API_HOST;
const fetchOptionsGET = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'get', 
};            


export default class ContentDiscoveryAPI {
 
 
    request(url,fetchOptions){
      return new Promise((resolve, reject) => { fetch(`${url}`,fetchOptions)
        .then(response => 
          {
            if (response.ok){
              const resp = response.json()
              resolve (resp);
            }else{
              reject (response)
            }
          })
        .catch(err => console.error('An error occurred while fetching ', err));
      })
    }

/* ASSETS */

    /**
     * Returns the metadata for a single asset
     * @param {*} assetId 
     */

     getSingleAsset(assetId) {
        const url = `${CD_SERVICE_URL}/assets/${assetId}`;
        return this.request(url,fetchOptionsGET);
      }
    
      /**
       * Returns assets from a specified category with pagination
       * See documentation for more options. 
       * Use assetType=" main" to filter out child/version and return the metadata placeholder if you are using source versions.
       *  
       * @param {*} categoryId 
       */
      getAssetsFromCategoryId(categoryId) {

        const url = `${CD_SERVICE_URL}/assets/?query=category.id:${categoryId} AND assetType:" main"&sort=id`;         
        return this.request(url,fetchOptionsGET);
      }


/* CATEGRIES */

   /**
       * Returns a category from a specified categoryId
       * See documentation for more options. 
       *  
       * @param {*} categoryId 
       */
      getSingleCategory(categoryId,param) {

        const url = `${CD_SERVICE_URL}/categories/${categoryId}${param}`;
        return this.request(url,fetchOptionsGET);
      }

        /**
       * Returns a category from a specified categoryId
       * See documentation for more options. 
       *  
       * @param {*} categoryId 
       */
      getSubCategories(categoryId,param) {

        const url = `${CD_SERVICE_URL}/categories/?query=parentId:${categoryId}${param}`;
        return this.request(url,fetchOptionsGET);
         
      }


      /** CONTEN CURATOR LISTS */

      getContentCurationListByID(ccId) {

        const url = `${CD_SERVICE_URL}/lists/${ccId}`;
        return this.request(url,fetchOptionsGET);
      }


}