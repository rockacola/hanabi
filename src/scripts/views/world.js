//
// Site / View / Main
//

'use strict';

// Dependencies
var log = require('bows')('World');
var View = require('ampersand-view');
var Utils = require('../base/utils');
var PeonySeed = require('../models/peony-seed');
var Player = require('../models/player');



// View
// --------------------------------------------------

var WorldView = View.extend({

    props: {
        PLAYER_VELOCITY: ['number', true, 3],
        PLAYER_SIZE: ['number', true, 20],
        COLLUSION_TOLERANCE: ['number', true, 0.55], // 0 for as soon as touching it, 0.1 for 10% of intersection, 1 for center-to-center matching (highest tolerance).

        width: 'number',
        height: 'number',
        canvasContext: 'object',
        duration: ['number', true, 0],
        seeds: ['array', true, function() { return []; }],
        player: 'object',
    },

    derived: {
    },

    bindings: {
    },

    events: {
    },

    initialize: function() {
        log('initialize()');
        this.el.width = this.width;
        this.el.height = this.height;
        this.canvasContext = this.el.getContext('2d');
    },

    // Event Handlers ----------------

    // Private Methods ----------------

    // Public Methods ----------------

    addPlayer: function(playerImagePath, playerActiveImagePath) {
        var positionX = this.width/2;
        var positionY = this.height/2;
        this.player = new Player({ parent: this, x: positionX, y: positionY, size: this.PLAYER_SIZE, velocity: this.PLAYER_VELOCITY, imagePath: playerImagePath, imageActivePath: playerActiveImagePath });
    },

    addAttack: function(designatedId, attackType, attackLevel) {
        // Random properties
        var positionX = Utils.random(0, this.width, false);
        var positionY = Utils.random(0, this.height, false);

        if(attackType == 'peony') {
            this.seeds.push(new PeonySeed({ _id: designatedId, parent: this, x: positionX, y: positionY, level: attackLevel }));
        }
    },

    setPlayerMovement: function(direction, toggle) {
        this.player.setMovement(direction, toggle);
    },

    grow: function() {
        this.duration ++;
        this.player.grow();
        Utils.forEach(this.seeds, function(seed) {
            seed.grow();
        });
    },

    optimise: function() {
        Utils.remove(this.seeds, function(seed) {
            return !seed.isAlive;
        });
    },

    collusionTest: function(gameTime) {
        var _this = this;
        Utils.forEach(this.seeds, function(seed) {
            if(seed.isCollided(_this.player)) {
                _this.player.collusion(gameTime);
            }
        });
    },

    draw: function() {
        var _this = this;
        this.canvasContext.clearRect(0, 0, this.width, this.height);

        // Render pre-existing seeds first
        Utils.forEach(this.seeds, function(seed) {
            if(seed.isPreExisting) {
                _this.canvasContext.save();
                seed.draw(_this.canvasContext);
                _this.canvasContext.restore();
            }
        });

        // Render player
        this.canvasContext.save();
        this.player.draw(this.canvasContext);
        this.canvasContext.restore();

        // Reiterate and check for existing seeds this time
        Utils.forEach(this.seeds, function(seed) {
            if(!seed.isPreExisting) {
                _this.canvasContext.save();
                seed.draw(_this.canvasContext);
                _this.canvasContext.restore();
            }
        });
    },
});



// Exports
// --------------------------------------------------

module.exports = WorldView;
