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



## Get started



In this react-app sample we use the auth0-spa-js sdk ( "@auth0/auth0-spa-js": "^1.2.4") to show how you can Use the [Auth0 Universal login](https://manage.vimond.auth0.com/docs/universal-login)

This sample are using Hooks which are a new addition in React 16.8. They let you use state and other React features without writing a class.


Auth0 also have several client tutorials you can follow, using Auth-lock or Auth0 SDK :
- [Auth0 libraries](https://manage.vimond.auth0.com/docs/libraries)
- [Quickstart tutorial](https://manage.vimond.auth0.com/docs/quickstarts)

Also, in [this article](https://auth0.com/docs/libraries/when-to-use-lock) you can read about when to consider to use Universal login or when to create a csutom login page. 


### install
Install and run the app locally.
```shell
$ npm install
$ npm start
```
Open [http://localhost:3000](http://localhost:3000) in your favorite browser.

### New Files
Some changes since sample 1.

1. src/client-api/end-user-identity.js -  This is the auth0 connection. We have made some modifications from the [Auth0 react sample](https://manage.vimond.auth0.com/docs/quickstart/spa/react#install-the-auth0-react-wrapper).
2. src/index.js - This files is modified to wrap the Auth0 library. Here you can also redirect the callback after login. 
3. src/components/end-user-identity/ProfileBar.jsx - ProfileBar in the right upper corner. 
4. src/components/end-user-identity/Profile.jsx - Profile component showing the user with id profile and decoded accesstoken. 
5. src/app.jsx - Added profilebar and profile modal. 
6. src/service/end-user-identity/callback.jsx 










