//
// Site / Base / Rng
//

'use strict';

// Dependencies
var log = require('bows')('Rng');
var State = require('ampersand-state');
var Seedrandom = require('seedrandom');



// App State
// --------------------------------------------------

var Rng = State.extend({

    props: {
        seed: 'string',
    },

    initialize: function() {
        /* jshint newcap: false */
        this.seedrandom = Seedrandom(this.seed);
    },

    // Private Methods ----------------

    // Public Methods ----------------

    /**
     * Produces a random integer between `min` and `max` (inclusive).
     *
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @returns {number} Returns the random number.
     */
    random: function(min, max) {
        return min + Math.floor(this.seedrandom() * (max - min + 1));
    },
});



// Exports
// --------------------------------------------------

module.exports = Rng;
