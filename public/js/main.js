( function( window, visualCaptcha ) {
    visualCaptcha( 'sample-captcha', {
        imgPath: '/img/',
        captcha: {
            url: window.location.protocol.origin,
            numberOfImages: 5
        }
    } );
}( window, visualCaptcha ) );