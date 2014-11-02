/* jshint node: true */
/* global describe, it, before, beforeEach, after, afterEach */
'use strict';

var app = require( './../../server.js' ),
    should = require( 'should' ),
    request = require( 'supertest' );

describe( 'visualCaptcha API Demo', function() {

    describe( '/test', function() {
        it( 'should return 404 error when calling a non-existing route', function( done ) {
            request( app ).get( '/test' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 404 );
    
                    done();
                });
        });
    });

    describe( '/start', function() {
        it( 'should return 404 when calling /start without the number of requested images', function( done ) {
            request( app ).get( '/start' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 404 );
    
                    done();
                });
        });

        it( 'should return 200 when calling /start/5, the image and audio field names, image name, and image values', function( done ) {
            request( app ).get( '/start/5' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    var data = res.body;

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
    
                    done();
                });
        });
    });

    describe( '/audio', function() {
        var agent = request.agent( app );

        beforeEach( function( done ) {
            // Start the session
            agent.get( '/start/5' ).end( done );
        });

        it( 'should return an mp3 audio file', function( done ) {
            agent.get( '/audio' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 200 );
                    res.headers[ 'content-type' ].should.equal( 'audio/mpeg' );

                    done();
                });
        });

        it( 'should return an ogg audio file', function( done ) {
            agent.get( '/audio/ogg' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 200 );
                    res.headers[ 'content-type' ].should.equal( 'audio/ogg' );
                    
                    done();
                });
        });
    });

    describe( '/image', function() {
        var agent = request.agent( app );

        beforeEach( function( done ) {
            // Start the session
            agent.get( '/start/5' ).end( done );
        });

        it( 'should return 404 when calling /image without the index number', function( done ) {
            agent.get( '/image' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 404 );
    
                    done();
                });
        });

        it( 'should return an image file', function( done ) {
            agent.get( '/image/0' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 200 );
                    res.headers[ 'content-type' ].should.equal( 'image/png' );
                    
                    done();
                });
        });

        it( 'should return another image file', function( done ) {
            agent.get( '/image/1' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 200 );
                    res.headers[ 'content-type' ].should.equal( 'image/png' );
                    
                    done();
                });
        });

        it( 'should return a retina image file', function( done ) {
            agent.get( '/image/0?retina=1' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 200 );
                    res.headers[ 'content-type' ].should.equal( 'image/png' );
    
                    done();
                });
        });

        it( 'should return 404 when calling /image with a non-existing index number', function( done ) {
            agent.get( '/image/100' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 404 );
    
                    done();
                });
        });
    });

    describe( '/try', function() {
        var agent = request.agent( app ),
            frontendData;

        beforeEach( function( done ) {
            // Start the session
            agent.get( '/start/5' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    frontendData = res.body;

                    done();
                });
        });

        it( 'should return 404 when calling /try with GET method', function( done ) {
            agent.get( '/try' )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 404 );
    
                    done();
                });
        });

        it( 'should redirect to /?status=failedPost when no data is posted', function( done ) {
            agent.post( '/try' )
                .send( {} )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 302 );
                    res.headers['location'].should.equal( '/?status=failedPost' );
    
                    done();
                });
        });

        it( 'should redirect to /?status=failedImage when captcha image fails', function( done ) {
            var postObject = {};

            postObject[ frontendData.imageFieldName ] = 'definitely-wrong-image-answer';

            agent.post( '/try' )
                .send( postObject )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 302 );
                    res.headers['location'].should.equal( '/?status=failedImage' );
    
                    done();
                });
        });

        it( 'should redirect to /?status=failedAudio when captcha audio fails', function( done ) {
            var postObject = {};

            postObject[ frontendData.audioFieldName ] = 'definitely-wrong-audio-answer';

            agent.post( '/try' )
                .send( postObject )
                .end( function( err, res ) {
                    if ( err ) {
                        return done( err );
                    }

                    res.statusCode.should.equal( 302 );
                    res.headers['location'].should.equal( '/?status=failedAudio' );
    
                    done();
                });
        });
    });

});
