//
// Site / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var App = require('ampersand-app');
var MainView = require('./views/main');
var ProfileView = require('./views/profile');
var Site = require('./models/site');
var Utils = require('./base/utils');



// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {

    templateVersion: '1.0.1', // Version of the adapted UselessBoilerplate
    version: '1.0.0', // Version of this application instance
    isDebug: true, // Whether the application is run in debug mode
    visitor: Utils.ua('UA-46848707-8'), // Specific Google analytic code for this app instance

    init: function () {
        log('TheInstance.init()');
        var baseInstance = this;

        //-- State / Model
        baseInstance.site = new Site();

        //-- View
        baseInstance.view = new MainView({
            model: baseInstance.site,
            el: document.querySelector('[data-hook="outline"]')
        });
        baseInstance.profileView = new ProfileView({
            el: document.querySelector('[data-hook="app-profile"]')
        });

        //-- UA
        this.visitor.pageview('/').send();
    }
};

//window.app = TheInstance; // use 'window.app' for easier debugging through browser console.
//window.app.init();
App.extend(TheInstance); // use Ampersand-App for better singleton usage.
App.init();
