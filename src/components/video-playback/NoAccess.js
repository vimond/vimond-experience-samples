import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;



const NoAccess = ({ asset, onExit, error, kickResult }) => {
  console.log('No Access ',error);
  if (error && (error.status == 401 || error.status == 403)) {   // eslint-disable-line eqeqeq
    const errorCode = error.details && error.details.errors[0] && error.details.errors[0].code;
  
    if (errorCode === "3006") {
      return (
        <Message>
          <h2>Device limit exceeded.</h2>
          <p><a href="/MyDevices">Manage devices</a>.</p>
          <button className="primary play" onClick={onExit}>
            Go back
          </button>
        </Message>
      );
    } else {
      let uri ="/payment?categoryId=";
      if(asset.content){
        uri = "/payment?categoryId=" + asset.content.category.id;
      }else{
         uri = "/payment?categoryId=" + asset.category.id;
      }
      
      return (
        <Message>
          <h2>No access</h2>
          <p>Please log in or purchase <a href={uri}>access</a> to this content.</p>
          <button className="primary play" onClick={onExit}>
            Go back
          </button>
        </Message>
      );
    }
  } else if (kickResult) {
    return (
      <Message>
        <h2>Playback shutdown</h2>
        <p>Multiple playbacks for this user account detected. Only NNN devices can play this content at the same time.</p>
        <button className="primary play" onClick={onExit}>
          Go back
        </button>
      </Message>
    );
  } else {
    return (
      <Message>
        <h2>Playback error</h2>
        <p>Playback could not start due to an error.</p>
        <button className="primary play" onClick={onExit}>
          Go back
        </button>
      </Message>
    );
  }
};

NoAccess.propTypes = {
  asset: PropTypes.object,
  onExit: PropTypes.func,
  playRequestError: PropTypes.object,
  kickResult: PropTypes.object
};

export default NoAccess;
