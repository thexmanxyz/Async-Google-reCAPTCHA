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

    // all configurations
    var config;

    // retrieve all reCAPTCHA container(s), check and execute async load
    function checkAndLoadReCAPTCHA() {

        // iterate over all reCAPTCHA containers
        $(config.containers).each(function () {
            var $container = $(this);

            // only load reCAPTCHA if reCAPTCHA container is empty and 
            // container is in viewport, this prevents double loading
            if (!$.trim($(this).html()) && config.isInViewport.call($container)) {

                // callback before load initiated
                config.beforeLoad.call($container);

                // async loading of reCAPTCHA library
                jQuery.getScript(config.libraryUrl);

                // remove a predefined spinner if enabled
                if(config.spinner.remove) {
                    config.removeSpinner.call($container);
                }

                // callback after load initiated
                config.afterLoad.call($container);
            }
       });
    }

    // initialize plugin and create events(s)
    $.fn.asyncReCAPTCHA = function(options) {
        config = $.extend(true, {}, $.fn.asyncReCAPTCHA.defaults, options);

        // set containers containing reCAPTCHA
        config.containers = this;

        // attach inline min-height
        config.setHeight();

        // attach spinner if necessary
        config.attachSpinner();

        // add trigger event (scroll, resize)
        config.triggerAsyncLoad();

        // initial check, if already in viewport
        config.checkAndLoad(); 
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
    * isInViewport: Function to determine if container is in viewport (callback).
    * setHeight: Function that sets min-height for the Google reCAPTCHA container (callback).
    * attachSpinner: Function to define the spinner attach behavior (callback).
    * removeSpinner: Function to define the spinner removal behavior (callback).
    * triggerAsyncLoad: Function to define when the reCAPTCHAs should be loaded (callback).
    * checkAndLoad: Function which calls the async load and check routine (callback).
    * beforeLoad:Function called before the async load was initiated (callback).
    * afterLoad: Function called after the async load was initiated (callback).
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

        // determine if container is in viewport
        // credits @ https://stackoverflow.com/a/33979503/2379196
        isInViewport: function () {

            // container bounds
            var containerTop = $(this).offset().top;
            var containerBottom = containerTop + $(this).outerHeight();

            // viewport bounds
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            // detect if container is in viewport
            return containerBottom > viewportTop && containerTop + config.offset < viewportBottom;
        },

        // automatically attach inline min-height to prevent reflow
        setHeight: function() {

            // only if height should be fixed inline
            if(config.fixHeight) {

                // iterate over all reCAPTCHA containers
                $(config.containers).each(function () {
                    
                    // apply default height of 78px
                    $(this).attr('style', 'min-height:78px;');
                });
            }
        },

        // remove a predefined spinner from the container of reCAPTCHA
        removeSpinner: function() {

            // remove spinner within parent container
            var hFunc = function() { 
                $(this).parent().find('.' + config.spinner.spinnerCtnClass).remove();
            };

            // wait a specific time in milliseconds before removing spinner
            setTimeout(hFunc.bind(this), config.spinner.delay);
        },

        // attach a predefined spinner to the container of reCAPTCHA
        attachSpinner: function() {
            var spinner = config.spinner;
            var $spinnerDiv, $spinnerCtn;

            // if spinner should be attached
            if(spinner.attach) {

                // iterate over all reCAPTCHA containers
                $(config.containers).each(function () {

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

        // append trigger event
        triggerAsyncLoad: function () {
            $(window).on('resize scroll', function() { config.checkAndLoad() });
        },

        // check and load reCAPTCHA(s)
        checkAndLoad: function() { checkAndLoadReCAPTCHA() },

        // before load initiated
        beforeLoad: function() {},

        // after load initiated
        afterLoad: function() {}
    };

})( jQuery );

// attach plugin to Google reCAPTCHA containers, basic example
// $('.g-recaptcha').asyncReCAPTCHA({});