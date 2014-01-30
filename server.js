/* jshint node: true */
'use strict';

var restify = require( 'restify' ),
    sessions = require( 'client-sessions' ),
    app,
    _getAudio,
    _getImage,
    _startRoute,
    _trySubmission,
    visualCaptcha;

// Initialize API server
app = restify.createServer({
    name: 'visualcaptcha-API',
    version: '0.0.1'
});

app.pre( restify.pre.sanitizePath() );

app.use( restify.bodyParser() );

// Set session information
app.use(
    sessions({
        cookieName: 'session',
        secret: 'someRandomSecret',
        duration: 86400000,// 24h in milliseconds
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            ephemeral: false
        }
    })
);

// Define routes functions
// Fetches and streams an audio file
_getAudio = function( req, res, next ) {
    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( ! visualCaptcha ) {
        res.send( 404, 'Not Found' );
    } else {
        // Default file type is mp3, but we need to support ogg as well
        if ( req.params.type !== 'ogg' ) {
            req.params.type = 'mp3';
        }

        visualCaptcha.streamAudio( res, req.params.type );
    }
};

// Fetches and streams an image file
_getImage = function( req, res, next ) {
    var isRetina = false;

    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( ! visualCaptcha ) {
        res.send( 404, 'Not Found' );
    } else {
        // Default is non-retina
        if ( req.query.retina ) {
            isRetina = true;
        }

        visualCaptcha.streamImage( req.params.index, res, isRetina );
    }
};

// Start and refresh captcha options
_startRoute = function( req, res, next ) {
    // After initializing visualCaptcha, we only need to generate new options
    if ( ! visualCaptcha ) {
        visualCaptcha = require( 'visualcaptcha' )( req.session );
    }

    visualCaptcha.generate( req.params.howmany );

    // We have to send the frontend data to use on POST.
    res.send( 200, visualCaptcha.getFrontendData() );
};

// Try to validate the captcha
// We need to make sure we generate new options after trying to validate, to avoid abuse
_trySubmission = function( req, res, next ) {
    var frontendData,
        howmany,
        responseStatus,
        responseObject;

    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( ! visualCaptcha ) {
        responseStatus = 404;
        responseObject = 'Not Found';
    } else {
        frontendData = visualCaptcha.getFrontendData();

        // If an image field name was submitted, try to validate it
        if ( req.body[frontendData.imageFieldName] ) {
            if ( visualCaptcha.validateImage(req.body[frontendData.imageFieldName]) ) {
                responseStatus = 200;
            } else {
                responseStatus = 403;
            }
        } else if ( req.body[frontendData.audioFieldName] ) {
            if ( visualCaptcha.validateAudio(req.body[frontendData.audioFieldName].toLowerCase()) ) {// We set lowercase to allow case-insensitivity, but it's actually optional
                responseStatus = 200;
            } else {
                responseStatus = 403;
            }
        } else {
            responseStatus = 500;
        }

        // We need to know how many images were generated before, to generate the same number again
        howmany = visualCaptcha.getImageOptions().length;
        visualCaptcha.generate( howmany );

        responseObject = visualCaptcha.getFrontendData();
    }

    res.send( responseStatus, responseObject );
};

// Routes definition

// @param type is optional and defaults to 'mp3', but can also be 'ogg'
app.get( '/audio', _getAudio );
app.get( '/audio/:type', _getAudio );

// @param index is required, the index of the image you wish to get
app.get( '/image/:index', _getImage );

// @param howmany is required, the number of images to generate
app.get( '/start/:howmany', _startRoute );

app.post( '/', _trySubmission );

module.exports = app;

// API Listening Port
app.listen( 8282 );
