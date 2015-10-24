//
// Site / View / Main
//

'use strict';

// Dependencies
var log = require('bows')('Main');
var App = require('ampersand-app');
var View = require('ampersand-view');
var Utils = require('../base/utils');
var WorldView = require('./world');
var FireworkSeed = require('../models/firework-seed');



// View
// --------------------------------------------------

var MainView = View.extend({

    props: {
        frameCount: ['number', true, 0],
        nextActionFrame: ['number', true, 0],
        world: 'object',
    },

    derived: {
    },

    bindings: {
        'frameCount': {
            type: 'text',
            hook: 'frame-count'
        },
    },

    events: {
    },

    initialize: function() {
        log('initialize()');

        // Bootstrap
        this.world = new WorldView({ el: document.querySelector('[data-hook="drawing-board"]'), width: 800, height: 600 });
        this.world.addPlayer();

        // Init setup
        this._toggleDebugMode(App.isDebug); //TODO: have this triggered in a 'more global' level
        this._incrementFrameCount();

        // Bindings
        document.addEventListener('keydown', this._userKeydownHandler.bind(this));
        document.addEventListener('keyup', this._userKeyupHandler.bind(this));
    },

    // Event Handlers ----------------

    _userKeydownHandler: function(e) {
        var direction = Utils.GetInputDirection(e.keyCode);
        //log('_userKeydownHandler direction:', direction);
        if(direction !== undefined) {
            this.world.setPlayerMovement(direction, true);
        }
    },

    _userKeyupHandler: function(e) {
        var direction = Utils.GetInputDirection(e.keyCode);
        //log('_userKeyupHandler direction:', direction);
        if(direction !== undefined) {
            this.world.setPlayerMovement(direction, false);
        }
    },

    // Private Methods ----------------

    _toggleDebugMode: function(isDebug) { //TODO: migrate this to App.Util or similar
        if(isDebug) {
            document.body.classList.add('is-debug');
        } else {
            document.body.classList.remove('is-debug');
        }
    },

    _incrementFrameCount: function() {
        log('starting _incrementFrameCount');
        var _this = this;
        var increment = function() {
            _this._incrementFrameCountAction();
            _this.frameCount++;
            Utils.raf(increment);
        };
        increment();
    },

    _incrementFrameCountAction: function() {
        if(this.frameCount >= this.nextActionFrame) { //NOTE: Notice that this is not using == to capture frameskip (which should not have happen anyway)

            // Please a firework object onto world
            this._addFirework();

            this.nextActionFrame = this.frameCount + Utils.random(60, 300, false);
            log('action frame:', this.frameCount, 'next action frame:', this.nextActionFrame);
        }

        // Action for each frame
        this.world.grow();
        this.world.optimise();
        this.world.collusionTest();
        this.world.draw();
    },

    _addFirework: function() {
        var fireworkId = this.frameCount;
        this.world.addRandomFirework(fireworkId);
        //log('there are [', this.world.seeds.length, '] seeds in the world');
    },

    // Public Methods ----------------

});



// Exports
// --------------------------------------------------

module.exports = MainView;
