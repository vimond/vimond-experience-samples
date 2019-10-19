# vimond-experience-samples
Vimond Experience samples is a collection of brances of a single page create react app that covers the services provided in the
Vimond End USer Experience API's.
All Service API's, Terminolgy and concepts, guides and tutorials are documented in the
[Vimond Experience Developer Hub](https://vimond-experience-api.readme.io/)

This Version
1. [Content Discovery service](https://vimond-experience-api.readme.io/docs/content-discovery) On github [v1.0-content-discovery-service](https://github.com/vimond/vimond-experience-samples/tree/v1.0-content-discovery-service)
2. Vimond End-User Identity (authentication and authorization) On github []()

Next versions 

3. [Sub-profile Service](https://vimond-experience-api.readme.io/docs/sub-profile-service) 
4. [Playlist Service](https://vimond-experience-api.readme.io/docs/playlist-service)
5. [Video playback services](https://vimond-experience-api.readme.io/docs/video-playback) with [Replay open source player](https://vimond.github.io/replay/)
6. [User viewing history](https://vimond-experience-api.readme.io/docs/resume-playback) 



# Login sample app using Auth0 Single Page App SDK

### Intro
Before we start using the personalized services in the experience API's we need to authenticate and retreive a JWT user token.


## Claims
The JWT has two purposes:

- Identifies the user, the user's tenant in a safe manner
Contains extra information about the users.
- To be compatible with the Vimond Platform, the token has to contain several claims. Claims are statements about an entity (typically, the user) and additional metadata. There are three types of claims: registered, public, and private claims. The Vimond platform requires both some registered and private claims (custom claims).

You can read more about Authentication, Open ID Connect and JWT tokens in the [Vimond Experience doc](https://vimond-experience-api.readme.io/docs/authentication)

## Vimond End-user Identity Service

Vimond can deliver an optional "out of the box" service for authentication that is built upon [Auth0], the worlds leading authentication service. 
In addition to authentication, the service also delivers a entitlment service that handles custom claims from the Vimond platform such as subscription (svod) claims,  and automatic migration of users from the the legacy user profile service in the vimond platform.

You can use your own authentication system, but to be able to use our peronilized services it needs to support the open ID connect standard using JWT tokens containing custom/private vimond claims
Read more about **Vimond End-user Identity service** [here](https://vimond-experience-api.readme.io/docs)

## Prerequisit
>Contact sales or your account manager to get access to Vimond End-User Identity and Vimond Experience services. 
All Customization and configuration in the Auth0 management system must be done by Vimond



## What will be covered in this sample

There are 5 different methodes you can use to login. In this sample We will cover 3 types.

1. [Auth0 Universal login](https://manage.vimond.auth0.com/docs/universal-login) using the [Auth0 SDK for Web](https://auth0.com/docs/libraries/auth0js/v9) auth0.js
2. Customized login, design you own login page using the auth0.js library. 
3. [Lock for web](https://auth0.com/docs/libraries/lock/v11) is an embeddable login form, configurable to your needs, and recommended for use in single-page apps. It enables you to easily add social identity providers, so that your users can login seamlessly using any provider they want.
It is possible to do some UI modifications directly in the client by using the [Lock config options](https://auth0.com/docs/libraries/lock/v11/configuration). In this sample we have changed the default logo and some messages.  

The other methodes not covered in this sample are

4. Using the [Auth0 authentication API](https://auth0.com/docs/api/info). It does more or less the same as the auth0.js library, but if you for some reason are not able to use any of the [Libraries](https://auth0.com/docs/libraries) when developing clients you can use the API directly. Typical usage is for smart TV, set-top boxes etc. In these cases you might want to consider to use Device Authorization Flow. 

5. [Device Authorization Flow](https://auth0.com/docs/flows/concepts/device-auth). The device asks the user to go to a link on their computer or smartphone and authorize the device. This avoids a poor user experience for devices that do not have an easy way to enter text. 
Even though it is not intended for a web application, we will make a single page sample using device flow in a later version of the sample app. 

>This sample are using Efect Hooks which are a new addition in React 16.8. They let you use state and other React features without writing a class.
See [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)


In addition to this sample app, Auth0 also have several client tutorials you can follow, using Auth-lock, Auth0 SDK or the API:
- [Auth0 libraries](https://manage.vimond.auth0.com/docs/libraries)
- [Quickstart tutorial](https://manage.vimond.auth0.com/docs/quickstarts)
- [Auth0 APIs](https://auth0.com/docs/api/info)

Also, in [this article](https://auth0.com/docs/libraries/when-to-use-lock) you can read about when to consider to use Universal login or when to create a custom login page. 

## Type of tokens. 
1. ID Token -> Contains user profile attributes represented in the form of claims. The ID Token is consumed by the application and used to get user information like the user's name, email, and so forth, typically used for UI display. In this sample we do not use the ID token, but it has been decoded to a JSON object to and stored tp local stporage as userProfile
2. Access Token -> The Access Token is a credential that can be used by an application to access an API. In this case The Vimond experience services. The token contains custom vimond claims to ensure access to our servces. See more about the vimond custom claims here - > [Authentication in vimond](https://vimond-experience-api.readme.io/docs/authentication)
3. Management token -> this is needed to update the user metadata back to the identity provider. See the methodes `retreiveManagementToken` and `patchUserMetadata` in `end-user-identity.js`  for how to retreive the management token and update user metadata. For more info see [Auth0 User management](https://auth0.com/docs/libraries/auth0js/v9#user-management) 

4. SubProfile token -> In the next sample version we will also introduce the subprofile token. see [Sub Profile Service ](https://vimond-experience-api.readme.io/docs/sub-profile-service). 


> Notice that we use local storage to store information about the user and tokens in the browsers localstorage. 

## Get started
Just download the sample directory

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


# INIT OPTIONS AUTH (see end-user-identity.js)
# Contact sales for values below. 

VEID_AUTH_DOMAIN = '<your tenant here>.vimond.auth0.com'
VEID_AUTH_CLIENT_ID = '<your client ID >'
VEID_AUTH_AUDIENCE = 'https://<your tenant here>.singleapp.vimond.com/'
VEID_AUTH_MANA_AUDIENCE = 'https://<your tenant here>.vimond.auth0.com/api/v2/'
VEID_AUTH_SCOPE = 'openid profile email phone user_metadata update:current_user_metadata read:current_user'
VEID_AUTH_CALLBACK_URL = 'http://local.sample-app.vim:3000/callback'

VEID_AUTH_REDIRECT_PATH = '/' 

```


> When updating user_metadata (editProfile.jsx) you need to retreive a management token. The consent needed to achieve this is not allowed through localhost. 

> A workaround is to use 
HOST=local.sample-app.vim instead. 


### install
Install and run the app locally.
```shell
$ npm install
$ npm start
```

Open [http://local.sample-app.vim:3000](http://local.sample-app.vim:3000) in your favorite browser.  

### New Files
Some changes since branch [v1.0-content-discovery-service](https://github.com/vimond/vimond-experience-samples/tree/v1.0-content-discovery-service).

1. [src/client-api/end-user-identity.js](src/client-api/end-user-identity.js) -  This is the auth0 connection. We have made some modifications from the [Auth0 react sample](https://manage.vimond.auth0.com/docs/quickstart/spa/react#install-the-auth0-react-wrapper).
2. [src/index.js](src/index.js) - This files is modified to wrap the Auth0 library. Here you can also redirect the callback after login. 
3. [src/components/end-user-identity/ProfileBar.jsx](src/components/end-user-identity/ProfileBar.jsx) - ProfileBar in the right upper corner. 
4. [src/components/end-user-identity/Profile.jsx](src/components/end-user-identity/Profile.jsx) - Profile component showing the user with id profile and decoded accesstoken. This also shows you have to update a users metadata. 
5. [src/components/end-user-identity/customLogin.jsx](src/components/end-user-identity/customLogin.jsx) - Profile component for a custom login page
6. [src/app.jsx](src/components/end-user-identity/Profile.jsx) - Added profilebar and profile modal. 
7. [src/service/end-user-identity/callback.jsx](src/service/end-user-identity/callback.jsx) - after login you will be redirected to this page. this will then handle the callback values. 

 








