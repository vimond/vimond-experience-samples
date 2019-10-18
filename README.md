# vimond-experience-samples
Vimond Experience samples is a collection of brances of a single page create react app that covers the services provided in the
Vimond End USer Experience API's.
All Service API's, Terminolgy and concepts, guides and tutorials are documented in the
[Vimond Experience Developer Hub](https://vimond-experience-api.readme.io/)

This Version
1. [Content Discovery service](https://vimond-experience-api.readme.io/docs/content-discovery) On github [v1.0-content-discovery-service](https://github.com/vimond/vimond-experience-samples/tree/v1.0-content-discovery-service)

Next version 

2. Vimond End-User Identity (authentication and authorization)
3. [Sub-profile Service](https://vimond-experience-api.readme.io/docs/sub-profile-service)
4. [Video playback services](https://vimond-experience-api.readme.io/docs/video-playback) with [Replay open source player](https://vimond.github.io/replay/)
5. [User viewing history](https://vimond-experience-api.readme.io/docs/resume-playback) for history lists and cross platform resume api's
6. [Playlist Service](https://vimond-experience-api.readme.io/docs/playlist-service)

### Config
Create a .env.developmet file in the root directory an add these values :

```
#local host alternative
HOST=local.sample-app.vim


# Content delivery API
CD_API_HOST='https://expo.content-discovery.cf.eu-north-1-stage.vmnd.tv/api/v1'

CD_API_FRONT_PAGE='OpzjLDGWmmyg'
CD_API_CURATION_ROOT_PANEL='EKkzG3Zyjrl1'

CD_API_SAMPLE_ASSET_CATEGORYROOT = '4631'
CD_API_SAMPLE_CATEGORYROOT = '4632'

IMAGE_BACKDROP_LOCATION='carousel'


```

### install
Install and run the app locally from the content-discovery-sample root folder.
```shell
$ npm install
$ npm start
```
[http://local.sample-app.vim:3000](http://local.sample-app.vim:3000) in your favorite browser.  

> Note that we are using local.sample-app.vim:3000 instead of just localhost:3000. This is due to the next sample version using Vimond Identity service that in some cases do not allow using localhost. Swithcing between the two hosts might confuse the browser CORS restrictions when calling the content delivery services. So please stick to local.sample-app.vim. Easier. 

### folder structure

/client-api -> this is where all requests to our services APIs is defined

/components -> different components for the single page.

/services -> if any of the services needs a url context, this is where you find them. These are picked up by the RouteBuilder.js in the root folder.

Easy. 