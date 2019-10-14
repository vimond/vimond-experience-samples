import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import cx from 'classnames/bind';
import Icons  from '../utils/icons/Icons';



const Section2 = styled.section`
position: relative;
margin-bottom: -30%;
  h2 {
    margin-bottom: 0.75rem;
    //position: relative;
  }
  .covers2 {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
  .cover2 {
    display: block;
    object-fit: cover;
    flex-shrink: 0;
   
    cursor: pointer;
    opacity: 0.9;
    transition: all 50ms ease-in-out;
    max-height: 78rem;
    width:100%;
    margin-left:1rem;
    cursor: pointer;
    &:hover {
      opacity: 1.2;
      box-shadow: 0 0 3rem black;
      transform: scale(1.01);
      z-index: 1;
  }
`;

const Container2=styled.div`
  position: relative;
`;

const Gradient = styled.div`

position: absolute;
height: 100%;
width: 100%;
display: block;
bottom: 0rem;
left: 0px;
background: linear-gradient(to top, rgba(0,0,0,1) 10%,rgba(0,0,0,.3) 50%,rgba(0,0,0,.1) 100%);
transition: all .3s ease-in;
transition-delay: .25s;
opacity: 1;
z-index:1;
`;



const ContentGradient = styled.div`

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
top: 10rem;
left: 100px;
width: 360px;
min-height: 60%;
display: flex;
flex-direction: column;
transition: all .3s ease-in;
transition-delay: .25s;

`;
let requestLoop;

export default class Slider extends Component {

    static propTypes = {
        className: PropTypes.string,
        items: PropTypes.array,
        onClick: PropTypes.func,
        trailerSource: PropTypes.string
      };

    constructor(props) {
      super(props)
  
      this.state = {
        currentIndex: 0,
        translateValue: 0
      }
    }

    componentDidMount() {
        var that = this;
        
        requestLoop = setInterval(function(){
            if(that.state.currentIndex === that.props.items.length - 1) {
                return that.setState({
                  currentIndex: 0,
                  translateValue: 0
                })
              }
              
              // This will not run if we met the if condition above
              that.setState(prevState => ({
                currentIndex: prevState.currentIndex + 1,
                translateValue: prevState.translateValue + -(that.slideWidth())
              }));
            
        }, 10000); 
      }
      componentWillUnmount(){

        clearInterval(requestLoop);
    }
    onClick = e => {
        const { onClick, items } = this.props;
        const item = items.find(item => item.id === e.currentTarget.dataset.id);
    
        if (onClick) {
          onClick(e, item);
        }
      };

   
  
    goToPrevSlide = () => {
      if(this.state.currentIndex === 0)
        return;
      
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex - 1,
        translateValue: prevState.translateValue + this.slideWidth()
      }))
    }
  
    goToNextSlide = () => {
      // Exiting the method early if we are at the end of the images array.
      // We also want to reset currentIndex and translateValue, so we return
      // to the first image in the array.
      if(this.state.currentIndex === this.props.items.length - 1) {
        return this.setState({
          currentIndex: 0,
          translateValue: 0
        })
      }
      
      // This will not run if we met the if condition above
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex + 1,
        translateValue: prevState.translateValue + -(this.slideWidth())
      }));
    }
  
    slideWidth = () => {
       return document.querySelector('.slide').clientWidth
    }
  
    render() {
        
        const { className,items } = this.props;
        const {currentIndex} = this.state;
        let item = items[currentIndex];
      return (
       
        <Section2 className={cx('', className)}>
             <div className="covers2">
             <Container2 
            style={{
              transform: `translateX(${this.state.translateValue}px)`,
              transition: 'transform ease-out 0.45s'
            }}>
              {
                items.map((item, i) => (
                  <Slide key={i} image={item.content.images.defaultUrl+'?location=carousel'} />
                ))
              }
            
           
            </Container2>
            
             <ContentGradient/>
             {item && <Content>
                  
                
             {/* <p><Icons className="play-icon" name="arrow-left" onClick={this.goToPrevSlide}/><Icons className="play-icon"  name="arrow-right" onClick={this.goToNextSlide}/></p>  */ }
                 <h2> {(item && item.content.title) || 'Untitled'}     </h2> 
                 <h4>{item && 'id : '+item.id}</h4> 
                 <h4>{item && item.content.genre}</h4> 
                 <div className="info-text">{item && (item.content.description || item.content['description-short'])}</div>
                 <div>
                 
                   <IconGradient onClick={this.onClick} data-id={item.id}>
                     <Icons className="icons" name="info" /> <h4 className="icons icons-text">More Info</h4>                   
                   </IconGradient>
                   
                 
                 </div> 
                
             </Content>}
        
          
          </div>
          
        </Section2>
       
      );
    }
  }
  
  const Slide = ({ image }) => {
    const styles = {
      //backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '80% 60%'
    }
    return <div className="slide" style={styles}>
     
         <img className="cover2"  src={image} alt="dd" />
         <Gradient />
        

    </div>
  }
  
  
  
  