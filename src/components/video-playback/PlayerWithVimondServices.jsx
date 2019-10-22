import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NoAccess from "./NoAccess";

import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
//import HlsjsVideoStreamer from 'vimond-replay/video-streamer/hlsjs';
//import ShakaVideoStreamer from 'vimond-replay/video-streamer/shaka-player';
import CompoundVideoStreamer from 'vimond-replay/video-streamer/resolver';

import getPlaybackService from '../../client-api/playback-api/playback';
import getPlayerSessionService from '../../client-api/playback-api/player-session';
import getDeviceInformationService from '../../client-api/playback-api/device-information';

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const mapPlayResponseToPlayerSource = (result,startPosition,subtitles) => {
  // TODO: Expand with DRM, subtitles, and resume position.
  // TODO: If DRM, different stream types must be selected according to the browser in use.
  // TODO: And parts of this hydration should perhaps be placed in the playback client.
  const recommendedStream = Array.isArray(result.data) && result.data[0].recommendedStream;

  if (recommendedStream && startPosition && subtitles) {  
    return { streamUrl: recommendedStream.manifest.uri, contentType: recommendedStream.mimeType,startPosition:startPosition, textTracks:subtitles };
  } else if (recommendedStream && subtitles) {  
    return { streamUrl: recommendedStream.manifest.uri, contentType: recommendedStream.mimeType,textTracks:subtitles };
  }else if (recommendedStream && startPosition) {  
    return { streamUrl: recommendedStream.manifest.uri, contentType: recommendedStream.mimeType,startPosition:startPosition };
  } else if (recommendedStream){
    return { streamUrl: recommendedStream.manifest.uri, contentType: recommendedStream.mimeType };
  }else{
    return null;
  }
};


class PlayerWithVimondServices extends Component {
  static propTypes = {
    asset: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    authentication: PropTypes.shape({
      token: PropTypes.string,
      subProfileToken: PropTypes.string
    }),
    configuration: PropTypes.shape({
      playbackService: PropTypes.shape({
        playApiHost: PropTypes.string,
        streamContentType: PropTypes.string
      }),
      playerSessionService: PropTypes.shape({
        updateIntervalSecs: PropTypes.number
      })
    }),
    onExit: PropTypes.func,
    startPosition: PropTypes.number,
    version: PropTypes.string 
    
  }

  static defaultProps = {
    logsession : true,
    options : {controls: {
      includeControls: [
        'playPauseButton',
        'timeline',
        'timeDisplay',
        'volume',
        'fullscreenButton',
        'subtitlesSelector',
      ],
    }}
  };


  constructor(props) {
    super(props);
    this.state = {
      source: null,
      error: null,
      kickResult: null,
      isStarted: false,
     
    };
    this.services = {
      playback: getPlaybackService(this.props.configuration.playbackService,this.props.version),
      deviceInformation: getDeviceInformationService(this.props.configuration),
      playerSession: this.props.logsession? getPlayerSessionService(this.props.configuration.playerSessionService, this.getPlayerState, this.kickPlayback) : null
      
    };
  }

  componentDidMount() {
    this.onAssetChange(this.props.asset);
  }

  componentWillUnmount() {
    if (this.services.playerSession) {
      this.services.playerSession.endSession();
    }
  }

  componentDidUpdate(prevProps) {
    const prevAssetId = (prevProps.asset && prevProps.asset.id) || null;
    const nextAssetId = (this.props.asset && this.props.asset.id) || null;
    if (prevAssetId !== nextAssetId && !(nextAssetId == null && prevAssetId == null)) {
      this.onAssetChange(this.props.asset);
    }
  }

  onSubtitles(subtitles){
    let textTracks =[];

   subtitles && subtitles.forEach(element => {


      if(element.contentType.indexOf('application/ttml+xml') === 0  && element.locale!=='*' ) {
        
        textTracks.push(  {
            src: element.url,
            kind: 'subtitles',
            language: element.locale,
            label: element.name,
            contentType: 'application/ttml+xml',
          }
        )
      }
    })
    return textTracks;

  }

  onAssetChange = (asset) => {
    if (this.services.playerSession) {
      this.services.playerSession.endSession();
    }
    if (asset) {
      this.services.deviceInformation.get().then(deviceInfo => {
        return this.services.playback.fetch(asset, this.props.authentication, deviceInfo).then(playback => {
          const subtitles = Array.isArray(playback.data) && playback.data[0].subtitles;

          this.setState({ source: mapPlayResponseToPlayerSource(playback,this.props.startPosition,this.onSubtitles(subtitles)), error: null });
          if (this.services.playerSession) {
            this.services.playerSession.createSession(playback, this.props.authentication);
          }
        });
      }).catch(playRequestError => {
        this.setState({ source: null, error: playRequestError });
        console.error('Play request was not successful.', playRequestError);
      });
    } else {
      this.setState({ source: null, error: null });
    }
  }

  onStreamStateChange = (streamStateProps) => {
    const { playerSession } = this.services;

    // Registering start and end of playback can be done by monitoring the playState property updates.
    if ('playState' in streamStateProps) {
      const { playState } = streamStateProps; // 'inactive' | 'starting' | 'playing' | 'paused' | 'seeking' | 'buffering'
      if (!this.state.isStarted && (playState === 'playing' || playState === 'paused')) {
        if (playerSession) {
          playerSession.notifyPlaybackStart();
        }
        this.setState({ isStarted: true });
      }
      if (this.state.isStarted && playState === 'inactive') {
        // TODO: Consider invoking this.props.onExit() in order to shutdown player.
        if (playerSession) {
          this.services.playerSession.notifyPlaybackEnd();
        }
        this.setState({ isStarted: false });
      }
    }
  }

  onPlaybackActionsReady = playerMethods => {
    this.services.playerMethods = playerMethods;
  };

  getPlayerState = () => {
    if (this.services.playerMethods) {
      return this.services.playerMethods.inspect();
    } else {
      return {};
    }
  };

  kickPlayback = (kickResult) => {
    this.setState({ kickResult });
  };

  onPlaybackError = error => {
    if (this.services.playerSession) {
      this.services.playerSession.notifyError(error);
    }
    console.error(`Playback error ${error.code}: ${error.message}`, error);
  };

  render() {
    const { onStreamStateChange, onPlaybackActionsReady, onPlaybackError } = this;
    const { source, error, kickResult } = this.state;
    const { onExit, asset,startPosition } = this.props;
    const replayProps = { source, onStreamStateChange, onPlaybackActionsReady, onPlaybackError, onExit,startPosition };
    if (kickResult) {
      return <NoAccess asset={asset} onExit={onExit} kickResult={kickResult}/>;
    } else if (source) {
      return (
        <Replay {...replayProps}>
          <CompoundVideoStreamer/>
        </Replay>
      );
    } else if (error) {
      return <NoAccess asset={asset} onExit={onExit} error={error}/>;
    } else {
      return <Centered><p>Loading...</p></Centered>;
    }
  }
}

export default PlayerWithVimondServices;
