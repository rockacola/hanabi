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
        // Constant
        FLARE_COUNT: ['number', true, 12],
        //LAYER_COUNT

        _id: 'number',
        parent: 'object',
        age: ['number', true, 0],
        x: ['number', true, 0],
        y: ['number', true, 0],
        size: ['number', true, 1],
        colour: 'string',
        opacity: ['number', true, 1], // NOTE: Not been used.
        flares: ['array', true, function() { return []; }],
        ttl: ['number', true, 60], // Time to Live in frame count
        velocity: ['number', true, 1],
        //acceleration
    },

    derived: {
        alpha: { // NOTE: Not beeen used.
            deps: ['opacity'],
            fn: function() {
                return (this.opacity <= 0) ? 0 : this.opacity;
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
        for(var i=0; i<this.FLARE_COUNT; i++) {
            var angle = (360 / this.FLARE_COUNT) * (i);
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
