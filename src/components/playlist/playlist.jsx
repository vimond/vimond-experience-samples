import React, { useState,useEffect } from "react";
import { useEndUserServices } from "../../client-api/end-user-services";
import Strip from '../ui/Strip'


const Playlist =({onCoverClick})=>{

    const { playlist,contentDiscoveryAPI } = useEndUserServices();

    const [playlistWMetada,setPlaylistWMetada] = useState([]);

    useEffect(() => {

        if(playlist && playlist.assetIds.length>0){
            let query = "query=id:"+playlist.assetIds[0];
            for (var i = 1; i < playlist.assetIds.length; i++) {
                query = query + " OR id:"+playlist.assetIds[i];
            }
            
            contentDiscoveryAPI.getAssetsFromQuery(query)
            .then(result => { setPlaylistWMetada(result.data)}, 
            error => { console.error(error); }  ) 
        }else{setPlaylistWMetada([])}
      
   // eslint-disable-next-line
    },[playlist]);

   const onClick = (e,item) => {
       
         
          onCoverClick(e, item);
       
      };
    

return (

   playlist? <Strip key={playlist.id}  title={playlist.name} items={playlistWMetada} onClick={onClick}/>:<></>

    );

};
export default Playlist;