import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import styled from 'styled-components'
import Cover from './Cover';
import InlinePlay from './InlinePlay'

const Section = styled.section`
  h2 {
    margin-bottom: 0.75rem;
  }
  .covers {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
  .cover {
    display: block;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    cursor: pointer;
    opacity: 0.7;
    transition: all 50ms ease-in-out;
    max-height: 28rem;
    margin-left:1rem;
    cursor: pointer;
    &:hover {
      opacity: 1;
      box-shadow: 0 0 3rem black;
      transform: scale(1.01);
      z-index: 1;
  }
`;

const Container=styled.div`
  position: relative;
`;

export default class Strip extends Component {

  static propTypes = {
    className: PropTypes.string,
    details: PropTypes.object,
    items: PropTypes.array,
    title: PropTypes.string,
    onClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onClick = e => {
    const { onClick, items } = this.props;
    const item = items.find(item => item.id === e.currentTarget.dataset.id);
    this.setState({ asset: item,showSingle: false });
    if (onClick) {
      onClick(e, item);
    }
  };

  render() {
    const { className, items, title } = this.props;
    const { asset, showSingle } = this.state;
    let details;

    return (
      <div >
        { showSingle && <div className='single'><InlinePlay title="Single asset sample" key={asset.id} item={asset} id={asset.id}/></div> }
        <Section className={cx('strip', className)}>
          <h2>{ title }</h2>
          <div className="covers">
            { !items || items.length === 0 ? 'No items found' : undefined }
            {
              items && items.map(item => (
                <Container key={item.title+item.id}>
                  <Cover key={item.title} item={item}  onClick={this.onClick}/>
                  <div>{item.title}</div>
                </Container>
              ))
            }
          </div>
          { details }
        </Section>
      </div>
    );
  }
}
