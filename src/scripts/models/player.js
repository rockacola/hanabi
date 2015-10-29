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
        imagePath: 'string',
        imageActivePath: 'string',

        isCollided: ['boolean', true, false],
        isMovingUp:  ['boolean', true, false],
        isMovingDown:  ['boolean', true, false],
        isMovingLeft:  ['boolean', true, false],
        isMovingRight:  ['boolean', true, false],

        playerImage: 'object',
        playerActiveImage: 'object',
    },

    derived: {
        currentPlayerImage: {
            deps: ['isMovingUp', 'isMovingDown', 'isMovingLeft', 'isMovingRight'],
            fn: function() {
                if(this.isMovingUp || this.isMovingDown || this.isMovingLeft || this.isMovingRight) {
                    return this.playerActiveImage;
                } else {
                    return this.playerImage;
                }
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
        this.playerImage = new Image();
        this.playerImage.src = this.imagePath;
        this.playerActiveImage = new Image();
        this.playerActiveImage.src = this.imageActivePath;
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
        var targetX = this.x;
        var targetY = this.y;

        if(this.isMovingUp && !this.isMovingDown) {
            if(!this.isMovingLeft && !this.isMovingRight) {
                // Up
                targetY = this.y - this.velocity;
            } else if(this.isMovingLeft && !this.isMovingRight) {
                // Up Left
                targetX = this.x - this.velocity * Math.cos(Utils.GetRadians(45));
                targetY = this.y - this.velocity * Math.sin(Utils.GetRadians(45));
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Up Right
                targetX = this.x + this.velocity * Math.cos(Utils.GetRadians(45));
                targetY = this.y - this.velocity * Math.sin(Utils.GetRadians(45));
            }
        } else if (this.isMovingDown && !this.isMovingUp) {
            if(!this.isMovingLeft && !this.isMovingRight) {
                // Down
                targetY = this.y + this.velocity;
            } else if(this.isMovingLeft && !this.isMovingRight) {
                // Down Left
                targetX = this.x - this.velocity * Math.cos(Utils.GetRadians(45));
                targetY = this.y + this.velocity * Math.sin(Utils.GetRadians(45));
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Down Right
                targetX = this.x + this.velocity * Math.cos(Utils.GetRadians(45));
                targetY = this.y + this.velocity * Math.sin(Utils.GetRadians(45));
            }
        } else if (!this.isMovingUp && !this.isMovingDown) {
            if(this.isMovingLeft && !this.isMovingRight) {
                // Left
                targetX = this.x - this.velocity;
            } else if (this.isMovingRight && !this.isMovingLeft) {
                // Right
                targetX = this.x + this.velocity;
            }
        }

        // Sanitize
        if(targetX < this.size) {
            targetX = this.size;
        } else if(targetX > this.parent.width - this.size) {
            targetX = this.parent.width - this.size;
        }
        if(targetY < this.size) {
            targetY = this.size;
        } else if(targetY > this.parent.height - this.size) {
            targetY = this.parent.height - this.size;
        }

        // Assign
        this.x = targetX;
        this.y = targetY;
    },

    draw: function(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        context.globalAlpha = 0.4;
        context.fillStyle = this.colour;
        context.fill();
        context.globalAlpha = 1;
        context.drawImage(this.currentPlayerImage, this.x-this.size, this.y-this.size, this.size*2, this.size*2);
    },

    collusion: function(gameTime) {
        this.colour = '#ff0000';
        this.trigger('collusion');
    },

});



// Exports
// --------------------------------------------------

module.exports = Player;
