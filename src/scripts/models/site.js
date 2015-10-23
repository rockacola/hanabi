//
// Site / Model / Site
//

'use strict';

// Dependencies
var log = require('bows')('Site');
var App = require('ampersand-app');
var State = require('ampersand-state');



// App State
// --------------------------------------------------

var Site = State.extend({

    props: {
    },

    derived: {
    },

    collections: {
    },

    children: {
    },

    binding: {
    },

    events: {
    },

    initialize: function() {
        log('initialize()');
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    // Public Methods ----------------

});



// Exports
// --------------------------------------------------

module.exports = Site;
