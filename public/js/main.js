( function( window, visualCaptcha ) {
    visualCaptcha( 'sample-captcha', {
        imgPath: '/img/',
        captcha: {
            url: window.location.origin,
            numberOfImages: 5
        }
    } );
}( window, visualCaptcha ) );