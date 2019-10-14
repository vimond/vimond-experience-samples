import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icons from '../utils/icons/Icons'






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



export default class InlinePlay extends Component {

  static propTypes = { 
    item: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {asset:this.props.item};
  }

 
  

  
  
  render() {
    const { asset } = this.state;
    
    return (
     
        <Container url={`url('${asset.images.defaultUrl}?location=carousel')`}>    
          <Content>
              <h2>{(asset && asset.title) || 'Untitled'} </h2> 
              <h4>{asset && 'id : '+asset.id}</h4> 
              <p>{asset && asset.description}</p>
              <h4>{asset && asset.genre}</h4>
              <div>          
                <IconGradient onClick={this.onPlay}>
                  
                  <Icons name='play' label='PLAY' className=''/>

                </IconGradient>                         
              </div> 
          </Content>
          <Gradient/>
        </Container>
   
    );
  }

}
