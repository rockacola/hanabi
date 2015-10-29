//
// Site / Model / Laser Seed
//

'use strict';

// Dependencies
var log = require('bows')('LaserSeed');
var State = require('ampersand-state');
var Utils = require('../base/utils');



// App State
// --------------------------------------------------

var LaserSeed = State.extend({

    props: {
        ATTACK_INDICATOR_SIZE: ['number', true, 16],

        _id: 'number',
        parent: 'object',
        spawnPosition: 'string',
        x: 'number',
        y: 'number',
        level: 'number',
        collusionTolerance: 'number',
        age: ['number', true, 0],
    },

    derived: {
        size: {
            deps: ['level'],
            fn: function() {
                return 100 + (50 * (this.level-1));
            }
        },
        thickness: {
            deps: ['level'],
            fn: function() {
                if(this.level < 2) {
                    return 5;
                } else {
                    return 5 + (3 * (this.level-2));
                }
            }
        },
        colour: {
            deps: ['level'],
            fn: function() {
                return '#37FDFC';
            }
        },
        ttl: { // in frame count
            deps: ['level'],
            fn: function() {
                return 60 * 9;
            }
        },
        velocity: {
            deps: ['level'],
            fn: function() {
                return 1.5 + (1 * (this.level-1));
            }
        },
        alpha: {
            deps: ['age', 'ttl'],
            fn: function() {
                if(this.age < 0) { // Pre-existing
                    return 1 + (this.age/160);
                } else { // Default
                    return 1;
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
        width: {
            deps: ['spawnPosition', 'thickness', 'size'],
            fn: function() {
                return (this.spawnPosition == 'up' || this.spawnPosition == 'down') ? this.thickness : this.size;
            }
        },
        height: {
            deps: ['spawnPosition', 'thickness', 'size'],
            fn: function() {
                return (this.spawnPosition == 'up' || this.spawnPosition == 'down') ? this.size : this.thickness;
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
        // Init
        this.collusionTolerance = this.parent.settings.collusionTolerance;
        this._setSpawn();
        this._setAge();

        log('initialize() x:', this.x, 'y:', this.y, 'level:', this.level);
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    _setSpawn: function() {
        var spawnPositions = ['up', 'right', 'down', 'left'];
        this.spawnPosition = spawnPositions[this.parent.parent.rng.random(0, 3)];

        var factor = 0.05; // Between 0 and 1
        if(this.spawnPosition == 'up') {
            this.x = this.parent.parent.rng.random(this.parent.width * factor, this.parent.width * (1-factor));
            this.y = 0;
        } else if(this.spawnPosition == 'down') {
            this.x = this.parent.parent.rng.random(this.parent.width * factor, this.parent.width * (1-factor));
            this.y = this.parent.height;
        } else if(this.spawnPosition == 'left') {
            this.x = 0;
            this.y = this.parent.parent.rng.random(this.parent.height * factor, this.parent.height * (1-factor));
        } else if(this.spawnPosition == 'right') {
            this.x = this.parent.width;
            this.y = this.parent.parent.rng.random(this.parent.height * factor, this.parent.height * (1-factor));
        }
    },

    _setAge: function() {
        this.age = -120; //TODO: Reflect by level.
    },

    // Public Methods ----------------

    grow: function() {
        this.age++;

        if(!this.isPreExisting) {
            if(this.spawnPosition == 'up') {
                this.y += this.velocity;
            } else if(this.spawnPosition == 'down') {
                this.y -= this.velocity;
            } else if(this.spawnPosition == 'left') {
                this.x += this.velocity;
            } else if(this.spawnPosition == 'right') {
                this.x -= this.velocity;
            }
        }
    },

    isCollided: function(player) {
        var result = false;
        if(!this.isPreExisting) {
            return Utils.IsRectangleCircleColliding(
                {x: this.x - (this.width/2), y: this.y - (this.height/2), w: this.width, h: this.height},
                {x: player.x, y: player.y, r: player.size * (1-this.collusionTolerance)} //TODO: factor in tolerance?
            );
        }
        return result;
    },

    draw: function(context) {
        if(this.isPreExisting) {
            context.beginPath();
            context.arc(this.x, this.y, this.ATTACK_INDICATOR_SIZE, 0, 2*Math.PI, false);
            context.globalAlpha = this.alpha;
            context.fillStyle = this.colour;
            context.fill();
        } else {
            context.fillStyle = this.colour;
            context.fillRect(this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);
        }
    }
});



// Exports
// --------------------------------------------------

module.exports = LaserSeed;
