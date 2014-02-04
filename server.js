/* jshint node: true */
'use strict';

var express = require( 'express' ),
    sessions = require( 'client-sessions' ),
    visualCaptcha = require( 'visualcaptcha' ),
    app = express(),
    _getAudio,
    _getImage,
    _startRoute,
    _trySubmission;

app.configure( function() {
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

    app.use( express.bodyParser() );

    // Set public path
    app.use( express.static( __dirname + '/public' ) );
} );

// Define routes functions
// Fetches and streams an audio file
_getAudio = function( req, res, next ) {
    var captcha;

    // Default file type is mp3, but we need to support ogg as well
    if ( req.params.type !== 'ogg' ) {
        req.params.type = 'mp3';
    }

    captcha = visualCaptcha( req.session, req.query.namespace );
    captcha.streamAudio( res, req.params.type );
};

// Fetches and streams an image file
_getImage = function( req, res, next ) {
    var captcha,
        isRetina = false;

    // Default is non-retina
    if ( req.query.retina ) {
        isRetina = true;
    }

    captcha = visualCaptcha( req.session, req.query.namespace );
    captcha.streamImage( req.params.index, res, isRetina );
};

// Start and refresh captcha options
_startRoute = function( req, res, next ) {
    var captcha;

    // After initializing visualCaptcha, we only need to generate new options
    captcha = visualCaptcha( req.session, req.query.namespace );
    captcha.generate( req.params.howmany );

    // We have to send the frontend data to use on POST.
    res.send( 200, captcha.getFrontendData() );
};

// Try to validate the captcha
// We need to make sure we generate new options after trying to validate, to avoid abuse
_trySubmission = function( req, res, next ) {
    var namespace = req.query.namespace,
        captcha,
        frontendData,
        queryParams = [],
        imageAnswer,
        audioAnswer,
        responseStatus,
        responseObject;

    captcha = visualCaptcha( req.session, namespace );
    frontendData = captcha.getFrontendData();

    // Add namespace to query params, if present
    if ( namespace && namespace.length !== 0 ) {
        queryParams.push( 'namespace=' + namespace );
    }

    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( typeof frontendData === 'undefined' ) {
        queryParams.push( 'status=noCaptcha' );

        responseStatus = 404;
        responseObject = 'Not Found';
    } else {
        // If an image field name was submitted, try to validate it
        if ( ( imageAnswer = req.body[ frontendData.imageFieldName ] ) ) {
            if ( captcha.validateImage( imageAnswer ) ) {
                queryParams.push( 'status=validImage' );

                responseStatus = 200;
            } else {
                queryParams.push( 'status=failedImage' );

                responseStatus = 403;
            }
        } else if ( ( audioAnswer = req.body[ frontendData.audioFieldName ] ) ) {
            // We set lowercase to allow case-insensitivity, but it's actually optional
            if ( captcha.validateAudio( audioAnswer.toLowerCase() ) ) {
                queryParams.push( 'status=validAudio' );

                responseStatus = 200;
            } else {
                queryParams.push( 'status=failedAudio' );

                responseStatus = 403;
            }
        } else {
            queryParams.push( 'status=failedPost' );

            responseStatus = 500;
        }
    }

    if ( req.accepts( 'html' ) !== undefined ) {
        res.header( 'Location', '/?' + queryParams.join( '&' ) );
        res.send( 302 );
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