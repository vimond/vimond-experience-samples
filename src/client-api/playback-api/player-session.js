/**
 * Fills an player event object template with actual values.
 *
 * @param template The player event template passed from the play response, containing placeholders like "${client_stream_url}".
 * @param parameters Flat object with keys matching the placeholder names, e.g. client_stream_url, and the values to be filled in.
 */
import uuid from 'uuid';

function fillParameters(template, parameters) {
  const regex = /(?:\$\{)(.*?)(?:\})/g;
  const resultObject = {};
  Object.entries(template).forEach(([key, value]) => {
    if (value != null && value.constructor === {}.constructor) {
      resultObject[key] = fillParameters(value, parameters);
    } else {
      resultObject[key] = value;
      let parameterMatch;
      while ((parameterMatch = regex.exec(value)) != null) {
        const parameterName = parameterMatch[1];
        if (parameterName && parameterName in parameters) {
          const replaceRegex = new RegExp(`\\$\\{${parameterName}\\}`, 'g');
          if ((typeof parameters[parameterName] === 'number' || typeof parameters[parameterName] === 'boolean') && resultObject[key] === `$\{${parameterName}}`) {
            // Number in, number out.
            resultObject[key] = parameters[parameterName];
          } else {
            resultObject[key] = resultObject[key].replace(replaceRegex, parameters[parameterName]);
          }
        }
      }
    }
  });
  return resultObject;
}

/**
 * Hydrates actual values for player event template value placeholders and returns a complete event data object.
 */
function fillTemplate(template, { eventNumber, playerEvent, playerState, currentStream, viewingSession }) {
  const { position, absolutePosition, isPaused, playState, isAtLiveEdge } = playerState;
  // The properties above come from the player used in this example web app. Adjustments might be needed for other players.
  // position is the current playback position relative to the start of the stream.
  // playState can be one of 'inactive', 'starting', 'playing', 'paused', 'seeking', 'buffering'.
  // isAtLiveEdge is false if a live stream is playing timeshifted, or true, if it is playing on the live edge.
  // absolutePosition is a Date object containing a timestamp for the currently playing position in a live stream.

  const { mimeType, manifest } = currentStream;
  const streamUrl = manifest && manifest.uri;
  const pageUrl = document.location.href;
  const clientDate = new Date().toISOString();

  // TODO: Refine or replace dummy data below.
  const parameters = {
    client_build_name: 'sample-web-app',
    client_build_version: '1.2.3',
    client_env_platform: 'Chrome',
    client_env_version: '1.2.3.4.5',
    client_page_url: pageUrl,
    client_drm: '',
    client_stream_url: streamUrl,
    video_mime_type: mimeType,
    video_protocol: streamUrl.substring(0, streamUrl.indexOf(':')),
    viewing_session: viewingSession,
    player_event: playerEvent,
    player_state: playState === 'inactive' ? 'stop' : (isPaused ? 'pause' : 'play'),
    originator: 'Web player',
    client_date: clientDate,
    vod_stream_position: Math.round(position * 100)/ 100, // rounding to 2 decimals since the event only allows max 5 decimals. 
    live_stream_position: absolutePosition instanceof Date ? absolutePosition.toISOString() : new Date().toISOString(),
    is_on_live_edge: isAtLiveEdge
  };

  const eventData = fillParameters(template, parameters);
  eventData.progress.eventNumber = eventNumber;
  return eventData;
}

const getPlayerSessionService = (configuration = {}, getPlayerState, kickPlayback) => {
  let { updateIntervalSecs } = configuration;
  let intervalId;
  let eventTemplate;
  let currentStream;
  let eventNumber;
  let eventPostUrl;
  let viewingSession;
  let authentication;

  function postEvent(playerEvent) {
    if (eventTemplate && eventPostUrl) {
      const playerState = getPlayerState();
      eventNumber++;

      const completeEventData = fillTemplate(eventTemplate, {
        eventNumber,
        playerEvent,
        playerState,
        currentStream,
        viewingSession
      });

      // console.log('Player session client: Posting event data', completeEventData, authentication);
      // TODO: Make a fetch here. Pass token and subProfileToken in configuration object, see further up.
      //const fakeRequest = Promise.resolve({});
      // Invoke processPostResult() asynchronously after posting.
      const fetchOptions = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authentication.accessToken}`,
        },
        method: 'POST', 
        body: JSON.stringify(completeEventData),
      };
      if(authentication.subProfileToken){
        fetchOptions.headers['X-Vimond-Subprofile'] = authentication.subProfileToken;
      } 

      return fetch(eventPostUrl,fetchOptions)
        .then(response => {
          if(response.status===200) // if status 200 you will get a json response with kick info. 
          {response.json().then(data => processPostResult(data));}
          else if(response.status===204) 
          {/**  if status 204 all is good. There is no kick to process  */}
        })
        .catch(err => console.error('An error occurred while posting a player event.', err));


      
      //return fakeRequest.then(processPostResult).catch(err => console.error('An error occurred while posting a player event.', err));
    }
  }

  function postPeriodicalEvent() {
    postEvent('period');
  }

  function processPostResult(result) {
    // TODO: Implement according to actual responses.
    console.log('Player session client: Process the event POST payload. Invoke kick if status is KICKED and the viewing session matches.',result);
    if (result.status === 'KICKED' && result.kickedSessionIds.indexOf(viewingSession) >= 0) {
      kickPlayback(result);
    }
  }

  function cleanup() {
    clearInterval(intervalId);
    intervalId = null;
    eventTemplate = null;
    currentStream = null;
    eventNumber = 0;
    eventPostUrl = null;
    viewingSession = null;
    authentication = null;
  }

  return {
    createSession: (playback, authDetails) => {
      eventNumber = 0;
      const data = Array.isArray(playback.data) && playback.data[0];
      authentication = authDetails;

      if (data && data.playerEventRequest && data.recommendedStream) {
        // This covers the most basic case where only the "recommended stream" is used.
        // In complex cases with e.g. failover, the stream URL might change during a player session.
        currentStream = data.recommendedStream;

        eventPostUrl = data.playerEventRequest.uri;
        eventTemplate = data.playerEventRequest.body;

        if (!updateIntervalSecs) { // The client configuration overrides the server provided setting.
          updateIntervalSecs = data.playerEventRequest.eventInterval || 15;
        }

        viewingSession = uuid.v4();
        console.log('Player session client: Session start. Creating a GUID for this playback session. Extract data needed for event posting.',
          viewingSession, eventPostUrl, updateIntervalSecs);
      } else {
        console.warn('Player session client: Session start without sufficient playback data for tracking events.');
      }
    },
    endSession: () => {
      if (eventTemplate) {
        console.log('Player session client: Session end.');
        postEvent('period');
      }
      cleanup();
    },
    notifyPlaybackStart: () => {
      console.log('Player session client: Playback has started.');
      intervalId = setInterval(postPeriodicalEvent, updateIntervalSecs * 1000);
      postEvent('str-start');
    },
    notifyPlaybackEnd: () => {
      // A playback might restart after ending. In this example, it is not considered as a new player session.
      // Thus not cleaning up the session variables, which is rather the responsibility for the endSession method.
      console.log('Player session client: Playback has ended.');
      postEvent('str-end');
      clearInterval(intervalId);
    },
    notifyError: error => {
      console.log('Player session client: Playback has reported an error.', error);
      postEvent('error');
      // If the error is always fatal, also invoke the following:
      // clearInterval(intervalId);
    }
  };
};

export default getPlayerSessionService;
