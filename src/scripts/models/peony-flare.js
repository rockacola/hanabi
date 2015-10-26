//
// Site / Model / Peony Flare
//

'use strict';

// Dependencies
var log = require('bows')('PeonyFlare');
var App = require('ampersand-app');
var State = require('ampersand-state');
var Utils = require('../base/utils');



// App State
// --------------------------------------------------

var PeonyFlare = State.extend({

    props: {
        parent: 'object',
        layer: 'number',
        x: 'number',
        y: 'number',
        angleDegrees: 'number',
    },

    derived: {
        angleRadians: {
            deps: ['angleDegrees'],
            fn: function() {
                return Utils.GetRadians(this.angleDegrees);
            }
        },
        accelerationFactor: {
            cache: false,
            fn: function() {
                var layerOrder = (this.parent.layerCount - this.layer + 1);
                return 1 - ((layerOrder-1) * 0.15);
            }
        },
        speed: {
            deps: ['accelerationFactor'],
            cache: false,
            fn: function() {
                return this.parent.velocity * this.accelerationFactor;
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
        //log('initialize()');

        // Init
        this.x = this.parent.x;
        this.y = this.parent.y;

        // Bindings
        this.listenTo(this.parent, 'change:age', this._parentAgeChangeHandler.bind(this));
    },

    // Event Handlers ----------------

    _parentAgeChangeHandler: function() {
        if(!this.parent.isPreExisting) {
            //log('seed ID:', this.parent._id, 'layerCount:', this.layerCount, 'accFactor:', this.accelerationFactor);
            this.x = (this.speed * Math.cos(this.angleRadians) * this.parent.age) + this.parent.x;
            this.y = (this.speed * Math.sin(this.angleRadians) * this.parent.age) + this.parent.y;
        }
    },

    // Private Methods ----------------

    // Public Methods ----------------

    isCollided: function(player) {
        var toleranceRatio = 1 - this.parent.parent.COLLUSION_TOLERANCE;
        var distance = Math.sqrt(
            Math.pow((this.x - player.x), 2) +
            Math.pow((this.y - player.y), 2)
        );
        if(distance <= (this.parent.size + player.size) * toleranceRatio) {
            return true;
        }
    },

    draw: function(context) {
        if(!this.parent.isPreExisting) {
            context.beginPath();
            context.arc(this.x, this.y, this.parent.size, 0, 2*Math.PI, false);
            context.globalAlpha = this.parent.alpha;
            context.fillStyle = this.parent.colour;
            context.fill();
        }
    },

});



// Exports
// --------------------------------------------------

module.exports = PeonyFlare;
