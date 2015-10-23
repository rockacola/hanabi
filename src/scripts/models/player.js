//
// Site / Model / Player
//

'use strict';

// Dependencies
var log = require('bows')('Player');
var App = require('ampersand-app');
var State = require('ampersand-state');



// App State
// --------------------------------------------------

var Player = State.extend({

    props: {
        // Constant
        PLAYER_VELOCITY: ['number', true, 3],
        PLAYER_SIZE: ['number', true, 12],

        parent: 'object',
        colour:  ['string', true, 'blue'],
        x: ['number', true, 0],
        y: ['number', true, 0],
    },

    derived: {
        size: { //NOTE: An interface to other objects (oppose than exposing/using constant)
            deps: ['PLAYER_SIZE'],
            fn: function() {
                return this.PLAYER_SIZE;
            }
        }
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

    move: function(direction) {
        if(direction == 'up') {
            this.y -= this.PLAYER_VELOCITY;
        } else if (direction == 'down') {
            this.y += this.PLAYER_VELOCITY;
        } else if (direction == 'left') {
            this.x -= this.PLAYER_VELOCITY;
        } else if (direction == 'right') {
            this.x += this.PLAYER_VELOCITY;
        }
    },

    draw: function(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.PLAYER_SIZE, 0, 2*Math.PI, false);
        context.fillStyle = this.colour;
        context.fill();
    },

    crash: function() {
        this.colour = 'red';
    }

});



// Exports
// --------------------------------------------------

module.exports = Player;
