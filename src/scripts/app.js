//
// Site / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var App = require('ampersand-app');
var GameView = require('./views/game');
var Utils = require('./base/utils');



// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {

    version: '1.4.0', // Version of this application instance
    isDebug: false, // Whether the application is run in debug mode
    visitor: Utils.ua('UA-46848707-9'), // Specific Google analytic code for this app instance

    init: function () {
        log('TheInstance.init()');
        var baseInstance = this;

        //-- View
        baseInstance.view = new GameView({
            el: document.querySelector('[data-hook="outline"]')
        });

        //-- UA
        this.visitor.pageview('/').send();
    }
};

//window.app = TheInstance; // use 'window.app' for easier debugging through browser console.
//window.app.init();
App.extend(TheInstance); // use Ampersand-App for better singleton usage.
App.init();
