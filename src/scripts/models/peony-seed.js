//
// Site / Model / Peony Seed
//

'use strict';

// Dependencies
var log = require('bows')('PeonySeed');
var State = require('ampersand-state');
var Utils = require('../base/utils');
var PeonyFlare = require('./peony-flare');



// App State
// --------------------------------------------------

var PeonySeed = State.extend({

    props: {
        _id: 'number',
        parent: 'object',
        x: 'number',
        y: 'number',
        level: 'number',
        age: ['number', true, 0],
        flares: ['array', true, function() { return []; }],
    },

    derived: {
        size: {
            deps: ['level'],
            fn: function() {
                return 8;
            }
        },
        colour: {
            deps: ['level'],
            fn: function() {
                return 'green';
            }
        },
        ttl: { // in frame count
            deps: ['level'],
            fn: function() {
                return 120;
            }
        },
        velocity: {
            deps: ['level'],
            fn: function() {
                return 2;
            }
        },
        flareCount: {
            deps: ['level'],
            fn: function() {
                return 12;
            }
        },
        isAlive: {
            deps: ['age', 'ttl'],
            fn: function() {
                return (this.age <= this.ttl);
            }
        },
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
        // Bootstrap
        for(var i=0; i<this.flareCount; i++) {
            var angle = (360 / this.flareCount) * (i);
            this.flares.push(new PeonyFlare({ parent: this, angleDegrees: angle }));
        }
        //log('initialize() ID:', this._id, 'x:', this.x, 'y:', this.y, 'flares:', this.flares);
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    // Public Methods ----------------

    grow: function() {
        this.age ++;
    },

    isCollided: function(player) {
        var result = false;
        Utils.forEach(this.flares, function(flare) {
            if(flare.isCollided(player)) {
                result = true;
            }
        });
        return result;
    },

    draw: function(context) {
        Utils.forEach(this.flares, function(flare) {
            flare.draw(context);
        });
    }
});



// Exports
// --------------------------------------------------

module.exports = PeonySeed;
