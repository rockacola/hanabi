//
// Site / View / Main
//

'use strict';

// Dependencies
var log = require('bows')('World');
var View = require('ampersand-view');
var Utils = require('../base/utils');
var FireworkSeed = require('../models/firework-seed');
var Player = require('../models/player');



// View
// --------------------------------------------------

var WorldView = View.extend({

    props: {
        PLAYER_VELOCITY: ['number', true, 3],
        PLAYER_SIZE: ['number', true, 12],
        COLLUSION_TOLERANCE: ['number', true, 0.2], // 0 for as soon as touching it, 0.1 for 10% of intersection, 1 for center-to-center matching (highest tolerance).

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

    addPlayer: function() {
        var positionX = this.width/2;
        var positionY = this.height/2;
        this.player = new Player({ parent: this, x: positionX, y: positionY, size: this.PLAYER_SIZE, velocity: this.PLAYER_VELOCITY });
    },

    addRandomFirework: function(id) {
        // Random properties
        var positionX = Utils.random(0, this.width, false);
        var positionY = Utils.random(0, this.height, false);
        var radius = 8;
        var colour = 'green';
        var ttl = 120; // in frame count
        var velocity = 2;

        this.seeds.push(new FireworkSeed({_id: id, parent: this, x: positionX, y: positionY, size: radius, colour: colour, ttl: ttl, velocity: velocity}));
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

        this.player.draw(this.canvasContext);

        Utils.forEach(this.seeds, function(seed) {
            _this.canvasContext.save();
            seed.draw(_this.canvasContext);
            _this.canvasContext.restore();
        });
    },
});



// Exports
// --------------------------------------------------

module.exports = WorldView;
