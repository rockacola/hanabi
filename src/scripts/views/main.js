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
        gameTime: ['number', true, 0],
        isPaused: ['boolean', true, false],
    },

    derived: {
        statusDescription: {
            deps: ['frameCount'],
            fn: function() {
                var text = 'running';
                if(this.isPaused) {
                    text = 'paused';
                }
                return text;
            }
        }
    },

    bindings: {
        'gameTime': {
            type: 'text',
            hook: 'game-time'
        },
        'statusDescription': {
            type: 'text',
            hook: 'status-description'
        }
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
        this._performUserCommand(e);
    },

    _userKeyupHandler: function(e) {
        this._performUserCommand(e);
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
        if(!this.isPaused) {
            if(this.frameCount >= this.nextActionFrame) { //NOTE: Notice that this is not using == to capture frameskip (which should not have happen anyway)
                // Please a firework object onto world
                this._addFirework();

                this.nextActionFrame = this.frameCount + Utils.random(60, 300, false); //TODO: this doesn't work with pause
                log('action frame:', this.frameCount, 'next action frame:', this.nextActionFrame);
            }

            // Action for each frame
            this.gameTime++;
            this.world.grow();
            this.world.optimise();
            this.world.collusionTest();
            this.world.draw();
        }
    },

    _addFirework: function() {
        var fireworkId = this.frameCount;
        this.world.addRandomFirework(fireworkId);
        //log('there are [', this.world.seeds.length, '] seeds in the world');
    },

    _performUserCommand: function(e) {
        var command = Utils.GetInput(e.keyCode);
        if(command !== undefined) {
            if(e.type == 'keydown') {
                e.preventDefault();
                if(command == 'pause') {
                    this.isPaused = !this.isPaused;
                } else {
                    this.world.setPlayerMovement(command, true);
                }
            } else if(e.type == 'keyup') {
                this.world.setPlayerMovement(command, false);
            }
        }
    },

    // Public Methods ----------------

});



// Exports
// --------------------------------------------------

module.exports = MainView;
