import React, { Component } from 'react';
import styled from 'styled-components'
import Icons from '../utils/icons/Icons'
import ContentDiscoveryAPI from '../../client-api/content-discovery-api'



import PropTypes from 'prop-types';


const contentDiscoveryAPI = new ContentDiscoveryAPI();

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
width: 190px;
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
z-index: 1;
width: 360px;
min-height: 100%;
display: flex;
flex-direction: column;
transition: all .3s ease-in;
transition-delay: .25s;
`;



/*const PlayerContainer = styled.div`
  height: 0;
  transition: all 200ms cubic-bezier(.78,.02,.58,1);
  overflow-y: hidden;

  &.expanded {
    height: 600px;
  }
`;*/

export default class InlineCategory extends Component{


static propTypes = {
    className: PropTypes.string,
    categoryId:PropTypes.string,
    onClose: PropTypes.func,
    categoryItem: PropTypes.object
    };


    constructor(props) {
        super(props);
        this.state = {
            
        };
      }
    






loadSeasonAssets= e => {
  let season = JSON.parse(e.currentTarget.dataset.item);
  contentDiscoveryAPI.getAssetsFromCategoryId(season.id)
  .then(result => {this.setState({seasonAssets:result.data,season:season}); console.log('calling getAssetsFromCategoryId ',result) });

}

onChangeTab = (e, index, name) => {
  window.showAppInfo(`${name} tab`);
  this.setState({ selected: index });
  console.log("Click på tabben",index)
};

onChange = e => {
  this.setState(e.target.value)
  
 
};

onPlay = e =>{ console.log('Play item',e.currentTarget.dataset.id)}

render(){


const {seasonAssets,season} = this.state;
const {categoryItem} = this.props;



return(
    
          
            <Container url={`url('${categoryItem.images.defaultUrl}?location=carousel')`}>            
              
              <Content>
             
                <h2>{(categoryItem.title) || 'Untitled'} </h2> 
                <h4>{categoryItem && 'id : '+categoryItem.id}</h4> 
                <p>{categoryItem['description-long']}</p>
                <div>
                  {categoryItem.children && categoryItem.children.map(item => (
                    <IconGradient key={item.id} onClick={this.loadSeasonAssets} data-item={JSON.stringify(item)}>
                     <Icons className="icons" name="play" /> <h4 className="icons icons-text"> SEASON  {item.season} </h4>
                    </IconGradient>
                  ))}
                </div>
              </Content>
              <Gradient/>
            
              <div className='category-episodes'>
                {season && <div><h2>{season.title} </h2> 
                <h4>{season && 'id : '+season.id}</h4> 
                <p>{season['description-long']}</p>
                </div>}
                <div>
                  {seasonAssets && seasonAssets.map(item => (
                    <div className='seasons-gradient' key={item.id} onClick={this.onPlay} data-id={item.id} >
                      <Icons name='play' label={item.episode+' '+item.title} className=''/>            
                    </div>
                     
                  ))}
                </div>              
              </div>
           
            </Container>
           
            
       
    );



}

}