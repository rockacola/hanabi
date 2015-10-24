//
// Site / Model / Player
//

'use strict';

// Dependencies
var log = require('bows')('Player');
var App = require('ampersand-app');
var State = require('ampersand-state');
var Utils = require('../base/utils');



// App State
// --------------------------------------------------

var Player = State.extend({

    props: {
        parent: 'object',
        colour:  ['string', true, 'blue'],
        x: ['number', true, 0],
        y: ['number', true, 0],
        size: 'number',
        velocity: 'number',

        isMovingUp:  ['boolean', true, false],
        isMovingDown:  ['boolean', true, false],
        isMovingLeft:  ['boolean', true, false],
        isMovingRight:  ['boolean', true, false],
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
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    // Public Methods ----------------

    setMovement: function(direction, toggle) {
        if(direction == 'up') {
            this.isMovingUp = toggle;
        } else if (direction == 'down') {
            this.isMovingDown = toggle;
        } else if (direction == 'left') {
            this.isMovingLeft = toggle;
        } else if (direction == 'right') {
            this.isMovingRight = toggle;
        }
    },

    grow: function() {
        // Examine vertical movements first
        if(this.isMovingUp && !this.isMovingDown) {
            if(!this.isMovingLeft && !this.isMovingRight) {
                // Up
                this.y -= this.velocity;
            } else if(this.isMovingLeft && !this.isMovingRight) {
                // Up Left
                this.x -= this.velocity * Math.cos(Utils.GetRadians(45));
                this.y -= this.velocity * Math.sin(Utils.GetRadians(45));
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Up Right
                this.x += this.velocity * Math.cos(Utils.GetRadians(45));
                this.y -= this.velocity * Math.sin(Utils.GetRadians(45));
            }
        } else if (this.isMovingDown && !this.isMovingUp) {
            if(!this.isMovingLeft && !this.isMovingRight) {
                // Down
                this.y += this.velocity;
            } else if(this.isMovingLeft && !this.isMovingRight) {
                // Down Left
                this.x -= this.velocity * Math.cos(Utils.GetRadians(45));
                this.y += this.velocity * Math.sin(Utils.GetRadians(45));
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Down Right
                this.x += this.velocity * Math.cos(Utils.GetRadians(45));
                this.y += this.velocity * Math.sin(Utils.GetRadians(45));
            }
        } else if (!this.isMovingUp && !this.isMovingDown) {
            if(this.isMovingLeft && !this.isMovingRight) {
                // Left
                this.x -= this.velocity;
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Right
                this.x += this.velocity;
            }
        }
    },

    draw: function(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        context.fillStyle = this.colour;
        context.fill();
    },

    collusion: function(gameTime) {
        this.colour = 'red';
        this.trigger('collusion');
    }

});



// Exports
// --------------------------------------------------

module.exports = Player;
