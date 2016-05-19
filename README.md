# passport-sceneid

[Passport](http://passportjs.org/) strategy for authenticating with [SceneID](https://id.scene.org/)
using the OAuth 2.0 API.

This module lets you authenticate using SceneID in your Node.js applications.
By plugging into Passport, SceneID authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-sceneid

## Usage

#### Create an Application

Before using `passport-sceneid`, you must register an application with
SceneID. See [SceneID API Docs] for how to apply for credentials.
You will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to apply for a redirect URI which
matches the route in your application.

#### Configure Strategy

The SceneID authentication strategy authenticates users using a SceneID account
and OAuth 2.0 tokens.  The client ID and secret obtained are supplied as options 
when creating the strategy.  The strategy also requires a `verify` callback, 
which receives the access token and optional refresh token, as well as `profile` 
which contains the authenticated user's SceneID profile.  
The `verify` callback must call `cb` providing a user to
complete authentication.

    var SceneidStrategy = require('passport-sceneid').Strategy;

    passport.use(new SceneidStrategy({
        clientID: SCENEID_CLIENT_ID,
        clientSecret: SCENEID_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/sceneid/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ sceneId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'sceneid'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/sceneid',
      passport.authenticate('sceneid', { scope: 'basic', state: 'el barto was here' }));

    app.get('/auth/sceneid/callback', 
      passport.authenticate('sceneid', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and SceneID
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to SceneID.

## License

[The MIT License](http://opensource.org/licenses/MIT)

This strategy has been based in part on [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2)

Copyright (c) 2016 Bartman/Abyss
