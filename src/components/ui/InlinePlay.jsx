import React from 'react';

import styled from 'styled-components';
import Icons from '../utils/icons/Icons'

import { useEndUserServices } from "../../client-api/end-user-services";
import { useAuth0 } from "../../client-api/end-user-identity";



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



const InlinePlay = ({asset}) =>{

  const { playlist, addAssetToPlaylist, removeAssetFromPlaylist } = useEndUserServices();
  const { isAuthenticated } = useAuth0();

 
  function onPlay(){}
  function onAddAssetToPlaylist(){  addAssetToPlaylist(playlist.id,asset.id) }
  function onRemoveAssetFromPlaylist(){  removeAssetFromPlaylist(playlist.id,asset.id) }
 
  
  function checkIfAssetInlist(Id) {
    return Id === asset.id?true:false;
  }
  
  const isInlist = playlist && playlist.assetIds.length > 0 ?playlist.assetIds.find(checkIfAssetInlist):false;  
    return (
     
        <Container url={`url('${asset.images.defaultUrl}?location=carousel')`}>    
          <Content>
              <h2>{(asset && asset.title) || 'Untitled'} </h2> 
              <h4>{asset && 'id : '+asset.id}</h4> 
              <p>{asset && asset.description}</p>
              <h4>{asset && asset.genre}</h4>
              <div>          
                <IconGradient onClick={onPlay}>  
                  <Icons name='play' label='PLAY' className='icons'/>
                </IconGradient>                         
               {isAuthenticated && (
                   <IconGradient onClick={isInlist?onRemoveAssetFromPlaylist:onAddAssetToPlaylist}>  
                    { isInlist?<Icons name='delete' label='Playlist' className='icons'/>:<Icons name='add' label='Playlist' className='icons'/>}
                  </IconGradient>                         
               )} 
              </div> 
          </Content>
          <Gradient/>
        </Container>
   
    );
  }

export default InlinePlay
