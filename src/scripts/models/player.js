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

        parent: 'object',
        x: ['number', true, 0],
        y: ['number', true, 0],
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
        context.arc(this.x, this.y, 12, 0, 2*Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
    },

});



// Exports
// --------------------------------------------------

module.exports = Player;
