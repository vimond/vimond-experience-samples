import React, {useState} from 'react';

import styled from 'styled-components';
import Icons from '../utils/icons/Icons'
import PlayerWithVimondServices from '../video-playback/PlayerWithVimondServices'; 

import { useEndUserServices } from "../../client-api/end-user-services";
import { useAuth0 } from "../../client-api/end-user-identity";


const Inline = styled.div`
  background-color: black;
  height: 100%;
  width: 100%;
`;
const Container = styled.div`
  position: absolute;
  color: white;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  overflow-y: hidden;
  background: ${props => props.url ? props.url : '#000'};
  background-size: cover;
  
`;

const Gradient = styled.div`

position: absolute;
height: 100%;
width: 100%;
display: block;
top: 0;
left: 0px;
width: 460px;
background: linear-gradient(to right, rgba(0,0,0,1) 0%,rgba(0,0,0,.6) 50%,rgba(0,0,0,.2) 100%);
transition: all .3s ease-in;
transition-delay: .25s;
opacity: 1;
`;


const IconGradient = styled.div`

flex-direction: column;
justify-content: center;
height: 3rem;
display: block;
top: 0;
left: 0px;
width: 160px;
background: rgba(0,0,0,.6);
transition: all .3s ease-in;
transition-delay: .25s;
opacity: 1;
margin-bottom: 1rem;


`;

const Content = styled.div`
position: absolute;
top: 3rem;
left: 100px;
z-index: 2;
width: 360px;
min-height: 100%;
display: flex;
flex-direction: column;
transition: all .3s ease-in;
transition-delay: .25s;
`;

const PlayerContainer = styled.div`
  position:absolute;
  height: 100%;
  width: 100%;
  background: black;
  left: 0;
  top: 0rem;
  bottom: 0rem;
  z-index: 100;
`;

const PLAY_SERVICE_HOST = process.env.REACT_APP_PLAY_SERVICE_HOST

const InlinePlay = ({asset}) =>{

  console.log('Loading Asset ',asset);

  const { playlist, addAssetToPlaylist, removeAssetFromPlaylist, subProfileToken } = useEndUserServices();
  const { isAuthenticated,accessToken,checkIfTokenNeedsRenewal } = useAuth0();

  const [play,setPlay ] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [version, setVersion] = useState();
  const [logSession, setLogSession] = useState();
  
  checkIfTokenNeedsRenewal();
  let config = { configuration: {
    playbackService: {
      playApiHost: PLAY_SERVICE_HOST,
      streamContentType: 'hls',
    }
  }}
 
  const onPlay = (e) =>{ 
    
    let version = e.currentTarget.id;//==='main'?undefined:e.currentTarget.id;
    version === 'Trailer'?setLogSession(false):setLogSession(true);
    setStartPosition(0)
    setVersion(version)
    setPlay(!play); 
  }
  function onAddAssetToPlaylist(){  addAssetToPlaylist(playlist.id,asset.id) }
  function onRemoveAssetFromPlaylist(){  removeAssetFromPlaylist(playlist.id,asset.id) }
  const onClose = () => {setPlay(!play)};
  
  function checkIfAssetInlist(Id) {
    return Id === asset.id?true:false;
  }
  
  const isInlist = playlist && playlist.assetIds.length > 0 ?playlist.assetIds.find(checkIfAssetInlist):false;  
    return (
       <Inline>
        <Container url={`url('${asset.images.defaultUrl}?location=carousel')`}>    
          <Content>
              <h2>{(asset && asset.title) || 'Untitled'} </h2> 
              <h4>{asset && 'id : '+asset.id}</h4> 
              <p>{asset && asset.description}</p>
              <h4>{asset && asset.genre}</h4>
              <div>   
              <h2>Versions </h2>  
              { asset.version.available.map(version =>   
                <IconGradient key={version} onClick={onPlay} id={version}  >  
                <div >
                  <Icons name='play' label={'PLAY '+version}  className='icons'/>
                  </div>
                </IconGradient>  
              )
              }                       
               {isAuthenticated && (<>
                  <h2>Playlist</h2>       
                   <IconGradient onClick={isInlist?onRemoveAssetFromPlaylist:onAddAssetToPlaylist}>  
                    { isInlist?<Icons name='delete' label='Remove' className='icons'/>:<Icons name='add' label='Add' className='icons'/>}
                  </IconGradient>     
                  </>                    
               )} 
              </div> 
          </Content>
          <Gradient/>
        </Container>
         {
          play &&
          <PlayerContainer>
            <PlayerWithVimondServices
              asset={asset}
              authentication={{accessToken, subProfileToken }}
              onExit={onClose}
              configuration={config.configuration}
              startPosition={startPosition}
              version={version}
              logsession={logSession}
            />
          </PlayerContainer>
        }
        </Inline> 
   
    );
  }

export default InlinePlay
