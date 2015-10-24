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
        //log('_parentAgeChangeHandler. e:', e, 'this:', this);
        this.x = (this.parent.velocity * Math.cos(this.angleRadians) * this.parent.age) + this.parent.x;
        this.y = (this.parent.velocity * Math.sin(this.angleRadians) * this.parent.age) + this.parent.y;
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
            //context.globalAlpha = this.parent.alpha;
            context.fillStyle = this.parent.colour;
            context.fill();
            //log('draw. x:', this.x, 'y:', this.y, 'angleDegrees:', this.angleDegrees, 'angleRadians:', this.angleRadians);

        }
    },

});



// Exports
// --------------------------------------------------

module.exports = PeonyFlare;
