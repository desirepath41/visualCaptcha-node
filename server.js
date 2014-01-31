/* jshint node: true */
'use strict';

var express = require( 'express' ),
    sessions = require( 'client-sessions' ),
    app = express(),
    _getAudio,
    _getImage,
    _startRoute,
    _trySubmission,
    visualCaptcha;

app.configure( function() {
    app.use( express.bodyParser() );

    // Set session information
    app.use( express.cookieParser() );
    app.use(
        sessions( {
            cookieName: 'session',
            secret: 'someRandomSecret',
            duration: 86400000,// 24h in milliseconds
            cookie: {
                path: '/',
                httpOnly: true,
                secure: false,
                ephemeral: false
            }
        } )
    );

    // Enable CORS
    app.use( function( req, res, next ) {
        res.header( 'Access-Control-Allow-Origin', '*' );
        next();
    } );

    // Set public path
    app.use( express.static( __dirname + '/public' ) );
} );

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
        imageAnswer,
        audioAnswer,
        redirectPath,
        responseStatus,
        responseObject;

    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( ! visualCaptcha ) {
        redirectPath = '?status=noCaptcha';

        responseStatus = 404;
        responseObject = 'Not Found';
    } else {
        frontendData = visualCaptcha.getFrontendData();

        // If an image field name was submitted, try to validate it
        if ( ( imageAnswer = req.body[ frontendData.imageFieldName ] ) ) {
            if ( visualCaptcha.validateImage( imageAnswer ) ) {
                redirectPath = '?status=validImage';

                responseStatus = 200;
            } else {
                redirectPath = '?status=failedImage';
                responseStatus = 403;
            }
        } else if ( ( audioAnswer = req.body[ frontendData.audioFieldName ] ) ) {
            // We set lowercase to allow case-insensitivity, but it's actually optional
            if ( visualCaptcha.validateAudio( audioAnswer.toLowerCase() ) ) {
                redirectPath = '?status=validAudio';

                responseStatus = 200;
            } else {
                redirectPath = '?status=failedAudio';

                responseStatus = 403;
            }
        } else {
            redirectPath = '?status=failedPost';

            responseStatus = 500;
        }

        // We need to know how many images were generated before, to generate the same number again
        howmany = visualCaptcha.getImageOptions().length;
        visualCaptcha.generate( howmany );

        responseObject = visualCaptcha.getFrontendData();
    }

    if ( req.accepts( 'html' ) !== undefined ) {
        res.header( 'Location', '/' + redirectPath );
        res.send( 302 );
    } else if ( req.accepts( 'json' ) !== undefined ) {
        res.send( responseStatus, responseObject );
    } else {
        res.send( responseStatus );
    }
};

// Routes definition


app.post( '/try', _trySubmission );

// @param type is optional and defaults to 'mp3', but can also be 'ogg'
app.get( '/audio', _getAudio );
app.get( '/audio/:type', _getAudio );

// @param index is required, the index of the image you wish to get
app.get( '/image/:index', _getImage );

// @param howmany is required, the number of images to generate
app.get( '/start/:howmany', _startRoute );

module.exports = app;

// API Listening Port
app.listen( 8282 );