# Content Discovery service sample

### Intro
The Content discovery are API's for retreiving and searching trough content metadata such as assets, categories and curated lists. 
These services does not require an jwt token to retreive information. The content has been set up to retrive sample data from our sales and demo setup, so be aware that content can change. 
Most of the sample metadata is retreived from [The Movie database](https://www.themoviedb.org/). They are credited on the page right corner. 

## Get started

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

> Note that we are using local.sample-app.vim:3000 instead of just localhost:3000. This is due to the next sample using Vimond Identity service that in some cases do not allow using localhost. Swithcing between the two hosts might confise the broswer CORS restrictions when calling the content delivery services. So please stick to local.sample-app.vim

### Specific content discovery components

 All files in the src/services folder will be picked up and given a route context defined in the src/RouteBuilder.js file
 > src/services/content-discovery/

 If you look at the files src/services/content-discovery/*
 ```
  static CONFIG_PAGE = false; //ignore
  static NO_MENU = false; // false = will appear in the menu
  static TITLE = "Asset Sample"; // menu title.
```
> src/client-api/*

This folder will contain the services request API's.

 > src/components/* 

 Reusable components 










