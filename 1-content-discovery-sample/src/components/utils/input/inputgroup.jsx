import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './input';


class InputGroup extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.id,
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const {
      onClickTabItem,
      props: {
        children,
      },
      state: {
        activeTab,
      }
    } = this;

    return (
      <div className="input-group">
        <ol className="input-list">
          {children.map((child) => {
            const { label,defaultValue, onChange,type,placeholder} = child.props;
            if (child.type==='input'){
              return <Input activeTab={activeTab} id={child.key} key={child.key} label={label} onClick={onClickTabItem} defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} type={type}/>
            }else{
             return child
            }
            })}
        </ol>
        
      </div>
    );
  }
}

export default InputGroup;