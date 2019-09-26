import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';




export default class Icons extends Component {

    static propTypes = {
        
        name: PropTypes.string,
        onClick : PropTypes.func,
        className : PropTypes.string
       
    };

 
  renderProvider(name,className){
   
    return <span className={className}><SVG src={`/icons/${name}.svg`}  /></span>
    
  }


  render() {
    const { name,className} = this.props;
    return name && this.renderProvider(name,className) 
    
  }

}
