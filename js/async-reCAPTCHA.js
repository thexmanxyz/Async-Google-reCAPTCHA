/******************************************************
*                                                     *
*   Async reCAPTCHA - jQuery Plugin                   *
*                                                     *
*   Purpose: This project contains a simple and       *
*            full configurable jQuery plugin which    *
*            asynchronously loads one or multiple     *
*            Google reCAPTCHA instances located on a  *
*            page. The load is triggered when the     *
*            reCAPTCHA is scrolled into viewport.     *
*                                                     *
*   Author: Andreas Kar (thex) <andreas.kar@gmx.at>   *
*   Repository: https://git.io/JvyqU                  *
*                                                     *
******************************************************/

(function( $ ) {

    // retrieve all reCAPTCHA container(s), check and execute async load
    function checkAndLoadReCAPTCHA(opts) {
        $(opts.containers).each(function () {
            var $container = $(this);

            // only load reCAPTCHA if container is in viewport and 
			// reCAPTCHA container is empty, this prevents double loading
            if (!$.trim($container.html()) && opts.isInViewport.call($container, opts)) {
                
                // async loading of reCAPTCHA library
                jQuery.getScript(opts.libraryUrl);

                // remove a predefined spinner if enabled
                if(opts.spinner.remove) {
                    opts.removeSpinner.call($container, opts);
                }

                // callback after load initiated
                opts.afterLoad.call($container, opts);
            }
       });
    }

    // initialize plugin and create events(s)
    $.fn.asyncReCAPTCHA = function(options) {
        var opts = $.extend(true, {}, $.fn.asyncReCAPTCHA.defaults, options);

        // set containers containing maps
        opts.containers = this;

        // add trigger event (scroll, resize)
        opts.triggerAsyncLoad(opts);

        // initial check, if already in viewport
        opts.checkAndLoad(opts); 
    };

   /* default values
    *
    * offset: Offset in pixel. A negative offset will trigger loading earlier, a postive value later.
	* libraryUrl: URL to the Google reCAPTCHA library. If the default URL changes, it can be customized here.
    * spinner.remove: Defines whether a spinner should be removed automatically after load.
    * spinner.selector: CSS selector used to find the spinner container (starting at reCAPTCHA parent element). 
    * spinner.delay: Time in milliseconds waited before the spinner is removed.
    * isInViewport: Custom function to determine if container is in viewport (callback).
    * removeSpinner: Custom function to control and define the default spinner removal behavior (callback).
    * triggerAsyncLoad: Custom function to define when the async load check is performed (callback).
    * checkAndLoad: Custom function which calls the async load and check routine (callback).
    * beforeLoad: Custom function called before the async load was initiated (callback).
    * afterLoad: Custom function called after the async load was initiated (callback).
    *
    */
    $.fn.asyncReCAPTCHA.defaults = {
        offset: 0,
		libraryUrl: 'https://www.google.com/recaptcha/api.js',
        spinner: {
            remove: false,
            selector: '.spinner-border',
            delay: 10000
        },

        // determine if container is in viewport - can be user customized
        // credits @ https://stackoverflow.com/a/33979503/2379196
        isInViewport: function (opts) {
            
            // container bounds
            var containerTop = $(this).offset().top;
            var containerBottom = containerTop + $(this).outerHeight();

            // viewport bounds
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            // detect if container is in viewport
            return containerBottom > viewportTop && containerTop + opts.offset < viewportBottom;
        },

        // remove a predefined spinner from the parent container of the reCAPTCHA - can be user customized
        removeSpinner: function(opts) {

            // remove spinner within parent container
            var hFunc = function() { 
                $(this).parent().find(opts.spinner.selector).remove();
            };

            // wait a specific time in milliseconds before removing spinner
            setTimeout(hFunc.bind(this), opts.spinner.delay);
        },

        // append trigger event - can be user customized
        triggerAsyncLoad: function (opts) {
            $(window).on('resize scroll', function() { opts.checkAndLoad(opts) });
        },

        // check and load reCAPTCHA(s) - can be user customized
        checkAndLoad: function(opts) { checkAndLoadReCAPTCHA(opts) },

        // before load initiated - can be user customized
        beforeLoad: function(opts) {},

        // after load initiated - can be user customized
        afterLoad: function(opts) {}
    };
 
})( jQuery );

// attach plugin to Google reCAPTCHA containers, basic example
// $('.g-recaptcha').asyncReCAPTCHA({});