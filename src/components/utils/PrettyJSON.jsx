import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components'
import Icon from './icons/Icons'

const Section = styled.section`

background: #f1f2f2; 
color: black; 
fontSize: 14px;
`;

const Header = styled.div`
background: #1f2532; 
padding: 5px 10px; 
fontFamily: monospace; 
svg {
  height: 2rem;
  width: 2rem;
  fill: white;
  float: left;
}
`;

const Print = styled.pre`
display: block; 
padding: 10px 30px; 
margin: 0; 
overflow: scroll;
`;




export default class PrettyJSON extends Component  {

  static propTypes = {
        jsonData: PropTypes.object,
        title: PropTypes.string
      };
      static defaultProps = {
        expanded:false
      };

  constructor(props) {
    super(props)
   
    this.state = {
      show: this.props.expanded,
    }
  }    

  

  toggle = () => this.setState({show: !this.state.show});

  render() {
    return (
      <Section>
        <Header onClick={this.toggle}>
         
          <Icon name={this.state.show?'dropdown':'arrow-right'} label={this.props.title} className=''/>
        </Header>
        {this.state.show 
          ? (
            <Print>
              {JSON.stringify(this.props.jsonData, null, 2) }
            </Print>
          )
          : null
        }
      </Section>
    )
  }
}