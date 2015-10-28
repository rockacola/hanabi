//
// Site / View / World
//

'use strict';

// Dependencies
var log = require('bows')('World');
var View = require('ampersand-view');
var Utils = require('../base/utils');
var PeonySeed = require('../models/peony-seed');
var Player = require('../models/player');
var Rng = require('../base/rng');



// View
// --------------------------------------------------

var WorldView = View.extend({

    props: {
        parent: 'object',
        settings: 'object',
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

        this.player = new Player({
            parent: this,
            x: positionX,
            y: positionY,
            size: this.settings.playerSize,
            velocity: this.settings.playerVelocity,
            imagePath: playerImagePath,
            imageActivePath: playerActiveImagePath
        });
    },

    addAttack: function(designatedId, attackType, attackLevel) {
        // Random properties
        var positionX = this.parent.rng.random(0, this.width);
        var positionY = this.parent.rng.random(0, this.height);

        if(attackType == 'peony') {
            this.seeds.push(new PeonySeed({
                _id: designatedId,
                parent: this,
                x: positionX,
                y: positionY,
                level: attackLevel,
                collusionTolerance: this.settings.collusionTolerance
            }));
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
