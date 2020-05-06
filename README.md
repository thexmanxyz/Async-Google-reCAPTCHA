# Async Google reCAPTCHA
This project contains a simple and full configurable jQuery plugin which asynchronously loads one or multiple Google reCAPTCHA v2 instances located on a page. The plugin is fully configurable and the loading is triggered when the reCAPTCHA container is scrolled into viewport. If you want to try it yourself, simply download the latest version and follow the installation guide below. 

## Prerequisites
* Basic web frontend knowledge
* jQuery core library

## Download / Installation
1. [Download v1.2.1](https://github.com/thexmanxyz/Async-Google-reCAPTCHA/archive/v1.2.1.zip) of Async Google reCAPTCHA
2. Extract the files and copy them to your website folder
3. Define the CSS and JS resource files in your HTML page. You can also place the `<script>` tag after your `<body>` content. Basic resource import example:
   * **JS (< 3kB):**
   ```HTML
   <script src="js/async-google-recaptcha.min.js"></script>
   ```
   * **CSS (< 2kB):** only necessary for spinner
   ```HTML
   <link href="css/async-google-recaptcha.min.css" rel="stylesheet">
   ```
   * **SCSS (< 2kB):** if you want to use SCSS instead, only necessary for spinner
   ```SCSS
   @import 'async-google-recaptcha.scss';
   ```
4. Initialize the plugin with basic values as follows:
   ```JS
   $('.g-recaptcha').asyncReCAPTCHA({});
   ```

   or

   ```JS
   jQuery('.g-recaptcha').asyncReCAPTCHA({});
   ```
5. If you want to further customize the appearance or behavior please take a closer look on the plugin parameters and their explanation listed in the next section.

## Resource Configuration
Please mind the following stylesheets resources and their explanation when you want to adjust the spinner type. This influences the footprint of your site but you can also omit the `<link>` tag completely if you don't need a spinner.

   * **CSS:**
       * `async-google-recaptcha.min.css` for simple included spinner (< 2kB)
       * `async-google-recaptcha-lio.min.css` for [Loading.io](https://loading.io/css/) pure CSS spinners (~ 16kB)
       * `async-google-recaptcha-cl.min.css` for [CSS-Loader](https://projects.lukehaas.me/css-loaders/) pure CSS spinners (< 21kB)
       * `async-google-recaptcha-all.min.css` includes all spinners but bigger footsprint (< 35kB)
       
   * **SCSS:**
       * `_async_google-recaptcha.scss` for simple included spinner (< 2kB)
       * `_async-google-recaptcha-lio.scss` for [Loading.io](https://loading.io/css/) pure CSS spinners (~ 16kB)
       * `_async-google-recaptcha-cl.scss` for [CSS-Loader](https://projects.lukehaas.me/css-loaders/) pure CSS spinners (< 21kB)
       * `_async-google-recaptcha-all.scss` includes all spinners but bigger footsprint (< 35kB)

## Configuration and Parameters
The plugin can be easily configured during the initialization and the following parameters are currently available. The listing contains the parameters together with their default values.

- `offset: 0,` | Offset in pixel. A negative offset will trigger loading earlier, a postive value later.
- `libraryUrl: 'https://www.google.com/recaptcha/api.js',` | URL to the Google reCAPTCHA library. If the default URL changes, it can be customized here.
- `fixHeight: false,` | Fix height of Google reCAPTCHA container to default size which is 78px ([explanation](https://github.com/thexmanxyz/Async-Google-reCAPTCHA#layout-reflow)).
- `spinner: {` | Spinner options
    - `attach: false,` | Defines whether a spinner should be attached automatically.
    - `remove: false,` | Defines whether a spinner should be removed automatically after load.
    - `type: 'included',` | The spinner type which should be used. The following values are supported:
        - `'included'` | simple build-in CSS spinner
        - `'bootstrap'` | Bootstrap spinner, requires version >= 4.2
        - `'custom'` | any custom spinner or library
    - `spinnerClass: 'async-recaptcha-spinner',` | CSS class added to the actual spinner element within the spinner container.
    - `spinnerCtnClass: 'async-recaptcha-spinner-ctn',` | CSS class added to the spinner container or used for removal.
    - `bsSpinnerClass: 'spinner-border',` | The Bootstrap spinner class. Either `'spinner-border'` or `'spinner-grow'`.
    - `customSpinner: '',` | Any custom spinner container passed as HTML can be used here.
    - `delay: 10000},` | Time in milliseconds waited before the spinner is removed.
- `isInViewport: function(){ ... },` | Determins if container is in viewport.
- `isRecaptchaLoaded: function(){ ... },` | Determines if the Google reCAPTCHA `<script>` tag exists.
- `setHeight: function(){ ... },` | Sets `min-height` for the Google reCAPTCHA container.
- `attachSpinner: function() { ... },` | Defines the spinner attach behavior.
- `removeSpinner: function(){ ... },` | Defines the spinner removal behavior.
- `triggerAsyncLoad: function(){ ... },` | Defines when the reCAPTCHA should be loaded.
- `checkAndLoad: function(){ ... },` | Calls the async load and check routine.
- `beforeLoad: function(){ ... },` | Called before the async load was initiated.
- `afterLoad: function(){ ... }` | Called after the async load was initiated.

### Google ReCHAPTCHA Loading
To make this plugin working for your Google reCAPTCHA please OMIT the default reCAPTCHA `<script>` tag e.g.:

```HTML
<script src='https://www.google.com/recaptcha/api.js'></script>
```

But DON'T FORGET to add the following HTML markup:

```HTML
<div class="g-recaptcha" data-sitekey="{YOUR_SITEKEY}"></div>
```

When your use case requires to use the API parameters `onload` or `explicit` please change the `libraryUrl` appropriately. E.g. to `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`.

### Examples
The following example shows how you can specify plugin parameters to change the default offset and remove a pre-defined spinner.

```Javascript
$('.g-recaptcha').asyncReCAPTCHA({
  offset: -100,
  spinner: {
    remove: true
  }
});
```

If you want to use the basic build-in spinner, configure the plugin with the following parameters:

```Javascript
$('.g-recaptcha').asyncReCAPTCHA({
  spinner: {
    attach: true, 
    remove: true
  }
});
```

### Advanced Spinner Usage
If you want to use a Bootstrap 4 spinner, configure the plugin with the following parameters:

```Javascript
$('.g-recaptcha').asyncReCAPTCHA({
  spinner: {
    attach: true, 
    remove: true, 
    type: 'bootstrap', 
    bsSpinnerClass: 'spinner-grow'
  }
});
```

Currently two spinner types are supported by Bootstrap `'spinner-border'` and `'spinner-grow'`. If you want to use the included Loading.io spinners, configure the plugin with the following paramters:

```Javascript
$('.g-recaptcha').asyncReCAPTCHA({
  spinner: {
    attach: true,
    remove: true,
    type: 'custom',
    customSpinner: '<div class="lds-dual-ring"></div>'
  }
});
```

Please visit [Loading.io](https://loading.io/css/) to find out more about the `customSpinner` parameter with is used to define each of the supported spinners. The following spinners are included:

**Circle:**
```HTML
<div class="lds-circle"><div></div></div>
```

**Dual Ring:**
```HTML
<div class="lds-dual-ring"></div>
```

**Facebook:**
```HTML
<div class="lds-facebook"><div></div><div></div><div></div></div>
```

**Heart:**
```HTML
<div class="lds-heart"><div></div></div>
```

**Ring:**
```HTML
<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
```

**Roller:**
```HTML
<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
```

**Default:**
```HTML
<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
```

**Ellipsis:**
```HTML
<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
```

**Grid:**
```HTML
<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
```

**Hourglass:**
```HTML
<div class="lds-hourglass"></div>
```

**Ripple:**
```HTML
<div class="lds-ripple"><div></div><div></div></div>
```

**Spinner:**
```HTML
<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
```

If you want to use the included CSS-Loader spinners, configure the plugin with the following parameters:

```Javascript
$('.g-recaptcha').asyncReCAPTCHA({
  spinner: {
    attach: true,
    remove: true,
    type: 'custom',
    customSpinner: '<div class="load1 loader">Loading...</div>'
  }
});
```

If you want a different appearance for the CSS-Loader spinners change `load1` to `load2` - `load8`. More information about the supported CSS-Loader spinners can be found [here](https://projects.lukehaas.me/css-loaders/). The following spinners are included:

```HTML
<div class="load1 loader">Loading...</div>
```

```HTML
<div class="load2 loader">Loading...</div>
```

```HTML
<div class="load3 loader">Loading...</div>
```

```HTML
<div class="load4 loader">Loading...</div>
```

```HTML
<div class="load5 loader">Loading...</div>
```

```HTML
<div class="load6 loader">Loading...</div>
```

```HTML
<div class="load7 loader">Loading...</div>
```

```HTML
<div class="load8 loader">Loading...</div>
```

All spinners have been resized to occupy ~32px in width in height. Feel free to change the size for your desired spinner appropriately.

### Layout Reflow
If you load content and elements asynchronously please be aware that it is necessary to reserve space for the Google reCAPTCHA container. This is necessary to prevent container resizing which leads to a unpleasant rearrangement of the page layout during loading. To counter this drawback please use the following plugin configuration:

```JS
$('.g-recaptcha').asyncReCAPTCHA({fixHeight: true});
```

or take a look at the following CSS which works fine with the Google reCAPTCHA v2:


```CSS
.g-recaptcha { height: 78px; min-height: 78px; }

```

## Features
* load Google reCAPTCHA asynchronously to get better Google PageSpeed Insights rating
* offset to load Google reCAPTCHA at the desired scroll position
* full-fledged spinner configuration used as placeholder while reCAPTCHA loads
  * attach / remove spinner
  * use different spinner types
    * basic included spinner
    * Bootstrap spinners (requires version >= 4.2)
    * custom spinner appliance ([Loading.io](https://loading.io/css/) and [CSS-Loader](https://projects.lukehaas.me/css-loaders/) pure CSS spinners included)
    * or use any other pure CSS spinner you like
* option to prevent layout reflow by automatically applying a fixed height
* support for onload callback of the Google reCAPTCHA API
* fully customizable through different callback methods at important execution points

## Future Tasks
- [?] Currently no future tasks known.

## Known Issues
None

## Dependencies
* [jQuery](https://jquery.com/)
* [CSS-Loader](https://projects.lukehaas.me/css-loaders/)
* [Loading.io CSS-Spinner](https://loading.io/css/)

## Credits
Thanks to the jQuery team for this [great plugin tutorial](https://learn.jquery.com/plugins/basic-plugin-creation/).

Thanks to [Loading.io](https://loading.io) for providing a fancy [set of spinners](https://github.com/loadingio/css-spinner/).

Thanks to [Luke Haas](https://projects.lukehaas.me) for providing a fancy [set of spinners](https://github.com/lukehaas/css-loaders).

## by [thex](https://github.com/thexmanxyz)
Copyright (c) 2020, free to use in personal and commercial software as per the [license](/LICENSE).
