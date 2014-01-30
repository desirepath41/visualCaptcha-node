/* jshint node: true */
/* global describe, it, before, beforeEach, after, afterEach */
'use strict';

var serverPath = './../../server.js',
    should = require( 'should' ),
    restify = require( 'restify' );

describe( 'visualCaptcha API Demo', function() {
    var client,
        frontendData;

    beforeEach( function() {
        // Initialize the API Demo
        require( serverPath );
    });

    // Initialize the Test Client
    client = restify.createJsonClient({
        version: '*',
        url: 'http://127.0.0.1:8282'
    });

    describe( '/', function() {
        it( 'should return 404 error when calling a non-existing route', function( done ) {
           client.get( '/', function( err, req, res, data ) {
                err.statusCode.should.equal( 404 );

                done();
            });
        });
    });

    describe( '/start', function() {
        it( 'should return 404 when calling /start without the number of requested images', function( done ) {
            client.get( '/start', function( err, req, res, data ) {
                res.statusCode.should.equal( 404 );

                done();
            });
        });

        it( 'should return 200 when calling /start/5, the image and audio field names, image name, and image values', function( done ) {
            client.get( '/start/5', function( err, req, res, data ) {
                res.statusCode.should.equal( 200 );

                should.exist( data );

                data.should.have.a.property( 'imageName' );
                data.should.have.a.property( 'imageFieldName' );
                data.should.have.a.property( 'audioFieldName' );
                data.should.have.a.property( 'values' );

                data.imageName.length.should.be.above( 0 );
                data.imageFieldName.length.should.be.above( 0 );
                data.audioFieldName.length.should.be.above( 0 );
                data.values.should.be.instanceOf( Array ).and.have.lengthOf( 5 );
                should.exist( data.values[0] );

                frontendData = data;

                done();
            });
        });
    });

    describe( '/audio', function() {
        it( 'should return an mp3 audio file', function( done ) {
            client.get( '/audio', function( err, req, res, data ) {
                res.contentType().should.equal( 'audio/mpeg' );
                
                done();
            });
        });

        it( 'should return an ogg audio file', function( done ) {
            client.get( '/audio/ogg', function( err, req, res, data ) {
                res.contentType().should.equal( 'audio/ogg' );
                
                done();
            });
        });
    });

    describe( '/image', function() {
        it( 'should return 404 when calling /image without the index number', function( done ) {
            client.get( '/image', function( err, req, res, data ) {
                res.statusCode.should.equal( 404 );

                done();
            });
        });

        it( 'should return an image file', function( done ) {
            client.get( '/image/0', function( err, req, res, data ) {
                res.contentType().should.equal( 'image/png' );
                
                done();
            });
        });

        it( 'should return another image file', function( done ) {
            client.get( '/image/1', function( err, req, res, data ) {
                res.contentType().should.equal( 'image/png' );
                
                done();
            });
        });

        it( 'should return a retina image file', function( done ) {
            client.get( '/image/0?retina=1', function( err, req, res, data ) {
                res.contentType().should.equal( 'image/png' );
                
                done();
            });
        });

        it( 'should return 404 when calling /image with a non-existing index number', function( done ) {
            client.get( '/image/100', function( err, req, res, data ) {
                res.statusCode.should.equal( 404 );

                done();
            });
        });
    });

    describe( '/try', function() {
        it( 'should return 405 when calling /image with GET method', function( done ) {
            client.get( '/try', function( err, req, res, data ) {
                res.statusCode.should.equal( 405 );

                done();
            });
        });

        it( 'should return 500 when no data is posted, together with the new data', function( done ) {
            client.post( '/try', {}, function( err, req, res, data ) {
                res.statusCode.should.equal( 500 );

                should.exist( data );

                data.should.have.a.property( 'imageName' );
                data.should.have.a.property( 'imageFieldName' );
                data.should.have.a.property( 'audioFieldName' );
                data.should.have.a.property( 'values' );

                data.imageName.length.should.be.above( 0 );
                data.imageFieldName.length.should.be.above( 0 );
                data.audioFieldName.length.should.be.above( 0 );
                data.values.should.be.instanceOf( Array ).and.have.lengthOf( 5 );
                should.exist( data.values[0] );

                frontendData.imageName.should.not.equal( data.imageName );
                frontendData.imageFieldName.should.not.equal( data.imageFieldName );
                frontendData.audioFieldName.should.not.equal( data.audio );
                frontendData.values.should.not.equal( data.values );

                frontendData = data;

                done();
            });
        });

        it( 'should return 403 when captcha image fails, together with the new data', function( done ) {
            var postObject = {};

            postObject[ frontendData.imageFieldName ] = 'definitely-wrong-image-answer';

            client.post( '/try', postObject, function( err, req, res, data ) {
                res.statusCode.should.equal( 403 );

                data.should.have.a.property( 'imageName' );
                data.should.have.a.property( 'imageFieldName' );
                data.should.have.a.property( 'audioFieldName' );
                data.should.have.a.property( 'values' );

                data.imageName.length.should.be.above( 0 );
                data.imageFieldName.length.should.be.above( 0 );
                data.audioFieldName.length.should.be.above( 0 );
                data.values.should.be.instanceOf( Array ).and.have.lengthOf( 5 );
                should.exist( data.values[0] );

                frontendData.imageName.should.not.equal( data.imageName );
                frontendData.imageFieldName.should.not.equal( data.imageFieldName );
                frontendData.audioFieldName.should.not.equal( data.audioFieldName );
                frontendData.values.should.not.equal( data.values );

                frontendData = data;

                done();
            });
        });

        it( 'should return 403 when captcha audio fails, together with the new data', function( done ) {
            var postObject = {};

            postObject[ frontendData.audioFieldName ] = 'definitely-wrong-audio-answer';

            client.post( '/try', postObject, function( err, req, res, data ) {
                res.statusCode.should.equal( 403 );

                data.should.have.a.property( 'imageName' );
                data.should.have.a.property( 'imageFieldName' );
                data.should.have.a.property( 'audioFieldName' );
                data.should.have.a.property( 'values' );

                data.imageName.length.should.be.above( 0 );
                data.imageFieldName.length.should.be.above( 0 );
                data.audioFieldName.length.should.be.above( 0 );
                data.values.should.be.instanceOf( Array ).and.have.lengthOf( 5 );
                should.exist( data.values[0] );

                frontendData.imageName.should.not.equal( data.imageName );
                frontendData.imageFieldName.should.not.equal( data.imageFieldName );
                frontendData.audioFieldName.should.not.equal( data.audioFieldName );
                frontendData.values.should.not.equal( data.values );

                frontendData = data;

                done();
            });
        });
    });

});