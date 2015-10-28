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
        ATTACK_INDICATOR_SIZE: ['number', true, 16],

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
                return 6;
            }
        },
        colour: {
            deps: ['level'],
            fn: function() {
                return '#dd8801';
            }
        },
        ttl: { // in frame count
            deps: ['level'],
            fn: function() {
                return 90;
            }
        },
        layerCount: {
            deps: ['level'],
            fn: function() {
                return 2 * this.level;
            }
        },
        velocity: {
            deps: ['level'],
            fn: function() {
                return 2 + (1 * (this.level-1));
            }
        },
        alpha: {
            deps: ['age', 'ttl'],
            fn: function() {
                if(this.age < 0) { // Pre-existing
                    return 1 + (this.age/160);
                } else if (this.age > this.ttl - 30) { // Decaying
                    var inverseTimeLeft = 30 - (this.ttl - this.age);
                    return 1 - (0.5 * inverseTimeLeft/30);
                } else { // Default
                    return 1;
                }
            }
        },
        flareCount: {
            deps: ['level'],
            fn: function() {
                if(this.level == 1) {
                    return 8;
                } else {
                    return 12;
                }
            }
        },
        isPreExisting: {
            deps: ['age'],
            fn: function() {
                return (this.age <= 0);
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
        log('initialize() x:', this.x, 'y:', this.y, 'level:', this.level);

        // Init
        this._setAge();

        // Bootstrap
        for(var i=1; i<=this.layerCount; i++) {
            for(var j=0; j<this.flareCount; j++) {
                var angle = (360 / this.flareCount) * (j);
                this.flares.push(new PeonyFlare({ parent: this, layer: i, angleDegrees: angle }));
            }
        }
        //log('initialize() ID:', this._id, 'x:', this.x, 'y:', this.y, 'level:', this.level, 'layerCount:', this.layerCount);
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    _setAge: function() {
        this.age = -120; //TODO: Reflect by level.
    },

    // Public Methods ----------------

    grow: function() {
        this.age++;
    },

    isCollided: function(player) {
        var result = false;
        if(!this.isPreExisting) {
            Utils.forEach(this.flares, function(flare) {
                if(flare.isCollided(player)) {
                    result = true;
                }
            });
        }
        return result;
    },

    draw: function(context) {
        if(this.isPreExisting) {
            context.beginPath();
            context.arc(this.x, this.y, this.ATTACK_INDICATOR_SIZE, 0, 2*Math.PI, false);
            //context.globalAlpha = 0.6;
            //context.fillStyle = '#e1855a';
            context.globalAlpha = this.alpha;
            context.fillStyle = this.colour;
            context.fill();
        } else {
            Utils.forEach(this.flares, function(flare) {
                flare.draw(context);
            });
        }
    }
});



// Exports
// --------------------------------------------------

module.exports = PeonySeed;
