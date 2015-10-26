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
        colour:  ['string', true, '#cdcdcd'],
        x: ['number', true, 0],
        y: ['number', true, 0],
        size: 'number',
        velocity: 'number',
        isCollided: ['boolean', true, false],

        isMovingUp:  ['boolean', true, false],
        isMovingDown:  ['boolean', true, false],
        isMovingLeft:  ['boolean', true, false],
        isMovingRight:  ['boolean', true, false],

        playerImage: 'object',
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
        this.playerImage = new Image();
        this.playerImage.src = '/images/spacecraft.png';
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
        context.globalAlpha = 0.4;
        context.fillStyle = this.colour;
        context.fill();
        context.globalAlpha = 1;
        context.drawImage(this.playerImage, this.x-this.size, this.y-this.size, this.size*2, this.size*2);
        //context.translate(this.size, this.size);
    },

    collusion: function(gameTime) {
        //this.colour = '#5a5a5a';
        this.colour = '#ff0000';
        this.trigger('collusion');
    },

});



// Exports
// --------------------------------------------------

module.exports = Player;
