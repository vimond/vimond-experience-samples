import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    placeholder:PropTypes.string,
    defaultValue:PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'text',
    label:''

  };

  onClick = () => {
    const { id, onClick } = this.props;
    onClick(id);
  }

  onChange = (e) => {
    const {onChange} = this.props;
    onChange(e);
  }

  render() {
    const { 
      onClick,
      onChange,
      props: {
        activeTab,
        label,
        defaultValue,
        type,
        placeholder,
        id
        
      },
    } = this;
     var trimedLabel = label.replace("oidc-"," " );
     trimedLabel = trimedLabel.replace('_',' ');

    let className = 'input-item';

    if (activeTab === id) {
      className += ' input-item-active';
    }

    return (
      <div className={className} onClick={onClick}> 
        <input type={type} defaultValue={defaultValue} className='input'  key={id}  data-id={id} onChange={onChange} placeholder={placeholder} onFocus={onClick} /> 
        { label &&<label>{trimedLabel}</label> }
      </div>
    );
  }
}


export default Input;