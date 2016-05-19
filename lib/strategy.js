// Load modules.
var OAuth2Strategy = require('passport-oauth2')
    , util = require('util')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

// based on passport-google-oauth20

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://id.scene.org/oauth/authorize/';
    options.tokenURL = options.tokenURL || 'https://id.scene.org/oauth/token/';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'sceneid';
    this._userProfileURL = options.userProfileURL || 'https://id.scene.org/api/3.0/me/';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from SceneID.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `sceneid`
 *   - `id`
 *   - `givenName` = first_name
 *   - `familyName` = last_name
 *   - `displayName` = display_name
 *   - `email` (array) = email
 *   - `photos` (array) empty
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    var self = this;
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
        var json;

        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) { }
            }

            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = {};
        // parse
        if ('string' == typeof json) {
            json = JSON.parse(json);
        } 
        profile.id = json.user.id;
        profile.givenName = json.user.first_name;
        profile.familyName = json.user.last_name;
        profile.displayName = json.user.display_name;
        profile.emails = [{ value: json.user.email }];
        profile.photos = [{}];

        profile.provider = 'sceneid';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
}

// Expose Strategy.
module.exports = Strategy;