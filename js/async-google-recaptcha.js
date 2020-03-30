/******************************************************
*                                                     *
*   Async reCAPTCHA - jQuery Plugin                   *
*                                                     *
*   Purpose: This project contains a simple and       *
*            full configurable jQuery plugin which    *
*            asynchronously loads one or multiple     *
*            Google reCAPTCHA v2 instances located    *
*            on a page. The load is triggered when    *
*            the reCAPTCHA is scrolled into viewport. *
*                                                     *
*   Author: Andreas Kar (thex) <andreas.kar@gmx.at>   *
*   Repository: https://git.io/JvyqU                  *
*                                                     *
******************************************************/

(function( $ ) {

    // retrieve all reCAPTCHA container(s), check and execute async load
    function checkAndLoadReCAPTCHA(opts) {

        // iterate over all reCAPTCHA containers
        $(opts.containers).each(function () {
            var $container = $(this);

            // only load reCAPTCHA if reCAPTCHA container is empty and 
            // container is in viewport, this prevents double loading
            if (!$.trim($(this).html()) && opts.isInViewport.call($container, opts)) {

                // callback before load initiated
                opts.beforeLoad.call($container, opts);

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

        // set containers containing reCAPTCHA
        opts.containers = this;

        // attach inline min-height
        opts.setHeight(opts);

        // attach spinner if necessary
        opts.attachSpinner(opts);

        // add trigger event (scroll, resize)
        opts.triggerAsyncLoad(opts);

        // initial check, if already in viewport
        opts.checkAndLoad(opts); 
    };

   /* default values
    *
    * offset: Offset in pixel. A negative offset will trigger loading earlier, a postive value later.
    * libraryUrl: URL to the Google reCAPTCHA library. If the default URL changes, it can be customized here.
    * fixHeight: Fix height of Google reCAPTCHA container to default size which is 78px.
    * spinner.attach: Defines whether a spinner should be attached automatically.
    * spinner.remove: Defines whether a spinner should be removed automatically after load.
    * spinner.type: The spinner type which should be used. The following values are supported:
    *  - 'included': simple build-in CSS spinner
    *  - 'bootstrap': Bootstrap spinner, requires version >= 4.2
    *  - 'custom': any custom spinner or library
    * spinner.spinnerClass: CSS class added to the actual spinner element within the spinner container.
    * spinner.spinnerCtnClass: CSS class added to the spinner container or used for removal.
    * spinner.bsSpinnerClass: The Bootstrap spinner class. Either 'spinner-border' or 'spinner-grow'.
    * spinner.customSpinner: Any custom spinner container passed as HTML can be used here.
    * spinner.delay: Time in milliseconds waited before the spinner is removed.
    * isInViewport: Custom function to determine if container is in viewport (callback).
    * setHeight: Custom function that sets the min-height for the Google reCAPTCHA container (callback).
    * attachSpinner: Custom function to define the spinner attach behavior (callback).
    * removeSpinner: Custom function to define the spinner removal behavior (callback).
    * triggerAsyncLoad: Custom function to define when the reCAPTCHAs should be loaded (callback).
    * checkAndLoad: Custom function which calls the async load and check routine (callback).
    * beforeLoad: Custom function called before the async load was initiated (callback).
    * afterLoad: Custom function called after the async load was initiated (callback).
    *
    */
    $.fn.asyncReCAPTCHA.defaults = {
        offset: 0,
        libraryUrl: 'https://www.google.com/recaptcha/api.js',
        fixHeight: false,
        spinner: {
            attach: false,
            remove: false,
            type: 'included',
            spinnerClass: 'async-recaptcha-spinner',
            spinnerCtnClass: 'async-recaptcha-spinner-ctn',
            bsSpinnerClass: 'spinner-border',
            customSpinner: '',
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

        // automatically attach inline min-height to prevent reflow - can be user customized
        setHeight: function(opts) {

            // only if height should be fixed inline
            if(opts.fixHeight) {

                // iterate over all reCAPTCHA containers
                $(opts.containers).each(function () {
                    
                    // apply default height of 78px
                    $(this).attr('style', 'min-height:78px;');
                });
            }
        },

        // remove a predefined spinner from the container of reCAPTCHA - can be user customized
        removeSpinner: function(opts) {

            // remove spinner within parent container
            var hFunc = function() { 
                $(this).parent().find('.' + opts.spinner.spinnerCtnClass).remove();
            };

            // wait a specific time in milliseconds before removing spinner
            setTimeout(hFunc.bind(this), opts.spinner.delay);
        },

        // attach a predefined spinner to the container of reCAPTCHA - can be user customized
        attachSpinner: function(opts) {
            var spinner = opts.spinner;
            var $spinnerDiv, $spinnerCtn;

            // if spinner should be attached
            if(spinner.attach) {

                // iterate over all reCAPTCHA containers
                $(opts.containers).each(function () {

                    // create bootstrap spinner
                    if(spinner.type == 'bootstrap') {

                        // create spinner container
                        $spinnerDiv = $('<div>').addClass(spinner.bsSpinnerClass + ' ' + spinner.spinnerClass).attr('role', 'status');
                        $spinnerDiv.prepend($('<span>').addClass('sr-only').html('Loading...'));

                    // create included spinner
                    }else if(spinner.type == 'included') {

                        // create spinner container
                        $spinnerDiv = $('<div>').addClass('simple-spinner' + ' ' + spinner.spinnerClass).attr('role', 'status');

                    // create custom spinner
                    }else if (spinner.type == 'custom') {

                        // create custom spinner element by passed HTML
                        $spinnerDiv = $(spinner.customSpinner).addClass(spinner.spinnerClass);
                    }

                    // create spinner container and prepend to parent container
                    $spinnerCtn = $('<div>').addClass(spinner.spinnerCtnClass).prepend($spinnerDiv);
                    $(this).parent().prepend($spinnerCtn);
                });
            }
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