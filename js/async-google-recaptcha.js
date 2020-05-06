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

            // only load reCAPTCHA if reCAPTCHA container is empty, 
            // container is in viewport and script not loaded, to prevent double loading.
            if (!$.trim($(this).html()) && config.isInViewport.call($container)
                    && !config.isRecaptchaLoaded()) {

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
    * isInViewport: Determines if container is in viewport.
    * isRecaptchaLoaded: Determines if the Google reCAPTCHA <script> tag exists.
    * setHeight: Sets min-height for the Google reCAPTCHA container.
    * attachSpinner: Defines the spinner attach behavior.
    * removeSpinner: Defines the spinner removal behavior.
    * triggerAsyncLoad: Defines when the reCAPTCHAs should be loaded.
    * checkAndLoad: Calls the async load and check routine.
    * beforeLoad: Called before the async load was initiated.
    * afterLoad: Called after the async load was initiated.
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

        // check if reCAPTCHA script tag exists
        // credits @ https://stackoverflow.com/a/18155447/2379196
        isRecaptchaLoaded: function (){
            var scripts = document.getElementsByTagName("script");
            for(var i = 0; i < scripts.length; i++) {
                var srcAttr = scripts[i].getAttribute('src');
                if(srcAttr != null && srcAttr.startsWith(config.libraryUrl)) {
                    return true;
                }
            }
            return false; 
        },

        // automatically attach inline min-height to prevent reflow
        setHeight: function() {

            // only if height should be fixed inline
            if(config.fixHeight) {

                // apply default height to prevent reflow
                $(config.containers).each(function () {
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