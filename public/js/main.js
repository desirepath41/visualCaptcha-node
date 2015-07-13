( function( window, visualCaptcha ) {
    var captcha = visualCaptcha( 'sample-captcha', {
        imgPath: 'img/',
        captcha: {
            numberOfImages: 5,
            callbacks: {
                loaded: function( captcha ) {
                    // Avoid adding the hashtag to the URL when clicking/selecting visualCaptcha options
                    var anchorOptions = document.getElementById( 'sample-captcha' ).getElementsByTagName( 'a' );
                    var anchorList = Array.prototype.slice.call( anchorOptions );// .getElementsByTagName does not return an actual array
                    anchorList.forEach( function( anchorItem ) {
                        _bindClick( anchorItem, function( event ) {
                            event.preventDefault();
                        });
                    });
                }
            }
        }
    } );

    var statusElement = document.getElementById( 'status-message' ),
        queryString = window.location.search;
    // Show success/error messages
    if ( queryString.indexOf('status=noCaptcha') !== -1 ) {
        statusElement.innerHTML = '<div class="status"> <div class="icon-no"></div> <p>visualCaptcha was not started!</p> </div>' + statusElement.innerHTML;
    } else if ( queryString.indexOf('status=validImage') !== -1 ) {
        statusElement.innerHTML = '<div class="status valid"> <div class="icon-yes"></div> <p>Image was valid!</p> </div>' + statusElement.innerHTML;
    } else if ( queryString.indexOf('status=failedImage') !== -1 ) {
        statusElement.innerHTML = '<div class="status"> <div class="icon-no"></div> <p>Image was NOT valid!</p> </div>' + statusElement.innerHTML;
    } else if ( queryString.indexOf('status=validAudio') !== -1 ) {
        statusElement.innerHTML = '<div class="status valid"> <div class="icon-yes"></div> <p>Accessibility answer was valid!</p> </div>' + statusElement.innerHTML;
    } else if ( queryString.indexOf('status=failedAudio') !== -1 ) {
        statusElement.innerHTML = '<div class="status"> <div class="icon-no"></div> <p>Accessibility answer was NOT valid!</p> </div>' + statusElement.innerHTML;
    } else if ( queryString.indexOf('status=failedPost') !== -1 ) {
        statusElement.innerHTML = '<div class="status"> <div class="icon-no"></div> <p>No visualCaptcha answer was given!</p> </div>' + statusElement.innerHTML;
    }


    // Binds an element to callback on click
    // @param element object like document.getElementById() (has to be a single element)
    // @param callback function to run when the element is clicked
    var _bindClick = function( element, callback ) {
        if ( element.addEventListener ) {
            element.addEventListener( 'click', callback, false );
        } else {
            element.attachEvent( 'onclick', callback );
        }
    };

    // Show an alert saying if visualCaptcha is filled or not
    var _sayIsVisualCaptchaFilled = function( event ) {
        event.preventDefault();

        if ( captcha.getCaptchaData().valid ) {
            window.alert( 'visualCaptcha is filled!' );
        } else {
            window.alert( 'visualCaptcha is NOT filled!' );
        }
    };

    // Bind that function to the appropriate link
    var isFilledElement = document.getElementById( 'check-is-filled' );
    _bindClick( isFilledElement, _sayIsVisualCaptchaFilled );
}( window, visualCaptcha ) );