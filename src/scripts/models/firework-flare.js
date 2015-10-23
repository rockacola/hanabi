//
// Site / Model / Firework Flare
//

'use strict';

// Dependencies
var log = require('bows')('FireworkFlare');
var App = require('ampersand-app');
var State = require('ampersand-state');



// App State
// --------------------------------------------------

var FireworkFlare = State.extend({

    props: {
        parent: 'object',
        angleDegree: 'number',
    },

    derived: {
        angleRadian: {
            deps: ['angleDegree'],
            fn: function() {
                return this.angleDegree * Math.PI / 180;
            }
        },
        x: { //TODO: optimise this
            cache: false,
            //deps: ['parent.x', 'parent.age'],
            fn: function() {
                return (this.parent.velocity * Math.cos(this.angleRadian) * this.parent.age) + this.parent.x;
            }
        },
        y: { //TODO: optimise this
            cache: false,
            //deps: ['parent.y', 'parent.age'],
            fn: function() {
                return (this.parent.velocity * Math.sin(this.angleRadian) * this.parent.age) + this.parent.y;
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
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    // Public Methods ----------------

    isCollided: function(player) {
        var distance = Math.sqrt(
            Math.pow((this.x - player.x), 2) +
            Math.pow((this.y - player.y), 2)
        );
        if(distance < (this.parent.size + player.size)) {
            //log('COLLUSION! COLLUSION!!');
            return true;
        }
    },

    draw: function(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.parent.size, 0, 2*Math.PI, false);
        //context.globalAlpha = this.parent.alpha;
        context.fillStyle = this.parent.colour;
        context.fill();
        //log('draw. x:', this.x, 'y:', this.y, 'angleDegree:', this.angleDegree, 'angleRadian:', this.angleRadian);
    },

});



// Exports
// --------------------------------------------------

module.exports = FireworkFlare;
