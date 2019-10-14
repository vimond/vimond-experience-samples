# Content Discovery service sample

### Intro
The Content discovery are API's for retreiving and searching trough content metadata such as assets, categories and curated lists. 
These services does not require an jwt token to retreive information. The content has been set up to retrive sample data from our sales and demo setup, so be aware that content can change. 
Most of the sample metadata is retreived from [The Movie database](https://www.themoviedb.org/). They are credited on the page right corner. 

## Get started

### install
Install and run the app locally from the content-discovery-sample root folder.
```shell
$ npm install
$ npm start
```
Open [http://localhost:3000](http://localhost:3000) in your favorite browser.

### Specific content discovery components

 All files in the src/services folder will be picked up and given a route context defined in the src/RouteBuilder.js file
 
 If you look at the files src/services/content-discovery/*
 ```
  static CONFIG_PAGE = false; //ignore
  static NO_MENU = false; // false = will appear in the menu
  static TITLE = "Asset Sample"; // menu title.
```











