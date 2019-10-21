const getPlaybackService = (configuration,version) => {
  const {playApiHost = '', streamContentType} = configuration;

  const performPlayRequest = (asset, authentication, deviceInformation) => {
    const { accessToken, subProfileToken } = authentication;
    if (asset && asset.id) {
      //TODO: The part /api/v1/asset/ is in the apiHost. Needs evaluation. Is e.g. the version part a matter of the client?
      // if version is "main" use default defined as main in the platform,and skip versions parameter 
      const playbackUri = `${playApiHost}${asset.id}/play?contentType=${encodeURIComponent(streamContentType)}${version!=='main'?'&versions='+version:''}`;
      //playbackUri = playbackUri+version?`&version=${version}`:'';
     // const playbackUri = `${playApiHost}${asset.id}/play`;
      const fetchOptions = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };
      if(accessToken){
        fetchOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      if(subProfileToken){
        fetchOptions.headers['X-Vimond-Subprofile'] = subProfileToken;
      }
      if (deviceInformation) {
        fetchOptions.method = 'POST';
        fetchOptions.body = window.localStorage.getItem('deviceInfo');
      }
      return fetch(playbackUri, fetchOptions).then(response => {
        if (response.ok) {

          if(response.status === 200){
            return response.json();
          }else if(response.status === 204){
            throw new Error(`The Play service responded with status ${response.status} The assset contains no stream`); 
          }
        } else {
          return response.json().then(errorDetails => {
            const errorMessage = Array.isArray(errorDetails.errors) ? `: ${errorDetails.errors.map(e => e.detail).join(', ')}.` : '.';
            const error = new Error(`The Play service responded with status ${response.status}${errorMessage}`);
            error.response = response;
            error.status = response.status;
            error.details = errorDetails;
            throw error;
          });

        }
      });
    } else {
      return Promise.reject(new Error('An asset object with an ID property must be supplied in order to fetch the playback details.'));
    }
  };
  return {
    fetch: performPlayRequest
  };
};

export default getPlaybackService;
