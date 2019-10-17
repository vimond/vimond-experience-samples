import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';




export default class Icons extends Component {

    static propTypes = {
        
        name: PropTypes.string,
        onClick : PropTypes.func,
        className : PropTypes.string,
        label:PropTypes.string,
       
    };

 
  renderProvider(name,className,label){
   
    return <span className={className}><SVG src={`/icons/${name}.svg`}/><h1>{label}</h1></span>
    
  }


  render() {
    const { name,className,label} = this.props;
    return name && this.renderProvider(name,className,label) 
    
  }

}
