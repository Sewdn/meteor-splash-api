# splash-api

#### Limited api for building splash pages in front of Meteor apps

It is a good practice to place a static splash page on your domain's homepage in front of your meteor app to reduce loadtime for firsttime visitors. This page typically adds links to the login or signup routes in your app and tells what your app is all about.

This package publishes the user info of the current session (json/jsonp) so you can change the login button with something like 'Welcome back. Open the app.'

This package also publishes the location of the two most important assets of your app: the bundled .js and .css file. This way you can preload these assets in the background of your splash page.

## Installation

```
meteor add sewdn:splash-api
```

## Usage

### user info
You can request the user info of the current session on following (server-side) routes:
    /session.json
    /session.jsonp

To control what data is being published on that endpoint, you can add a fields configuration object on the Meteor.users collection like so:

```js
Meteor.users.fields = {
  public: {
    profile: 1,
    username: 1
  }
};
```

Or you can override the `publishuserFields` function in the exported Splash namespace:

```js
Splash.publishUserFields = function(u) {
  return _.pick(u, ['profile', 'username']);
}
```

Example implementation in your static splash page (using jQuery):
```js
  $.ajax({
      url: "http://your.domain.tld/session.jsonp",
      jsonp: "callback",
      dataType: "jsonp",
      success: function( response ) {
        if(response.response !== "not logged in"){
          _createWelcomeBack(response);
        }
      }
    });
```

### assets preloader
You can request the location of your app's assets on following (server-side) routes:
    /app.json
    /app.jsonp

Example implementation in your static splash page (using jQuery):
```js
  $.ajax({
      url: "http://your.domain.tld/app.jsonp",
      jsonp: "callback",
      dataType: "jsonp",
      success: function( app ) {
        _preload([app.js, app.css + '?meteor_css_resource=true']);
      }
    });
```
