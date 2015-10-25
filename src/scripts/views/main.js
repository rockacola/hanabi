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



// View
// --------------------------------------------------

var MainView = View.extend({

    props: {
        LEVEL_DURATION: ['number', true, function() { return 60*90; }], // Time length of each level
        LEVEL_FIRST_WAVE: ['number', true, function() { return 60*5; }], // Waiting time before the 1st wave starts in a new level

        frameCount: ['number', true, 0],
        world: 'object',
        gameClock: ['number', true, 0],
        levelClock: ['number', true, 0],
        isGamePaused: ['boolean', true, false],
        isGameStarted: ['boolean', true, false],
        gameOverTime: 'number',
        nextActionGameTime: ['number', true, 0],

        attackType: ['string', true, 'peony'],
        attackLevel: ['number', true, 1],
    },

    derived: {
        isGameOver: {
            deps: ['gameOverTime'],
            fn: function() {
                return (this.gameOverTime !== undefined);
            }
        },
        isGameOn: {
            deps: ['isGameStarted', 'isGamePaused', 'isGameOver'],
            fn: function() {
                return (this.isGameStarted && !this.isGamePaused && !this.isGameOver);
            }
        },
        statusDescription: {
            deps: ['frameCount'],
            fn: function() {
                var text = 'running, press [p] to pause.';
                if(!this.isGameStarted) {
                    text = 'press [space] to start the game, [p] to pause.';
                } else if(this.isGameOver) {
                    text = 'game over on: ' + this.gameOverTime + '. Refresh page to restart';
                } else if(this.isGamePaused) {
                    text = 'paused, press [p] to resume.';
                }
                return text;
            }
        },
        gameSeconds: { // game seconds in 1 decimal pont
            deps: ['gameClock'],
            fn: function() {
                return Math.floor(this.gameClock / 60 * 10) / 10;
            }
        },
    },

    bindings: {
        "gameClock": {
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
        this.listenTo(this.world.player, 'collusion', this._playerCrashedHandler.bind(this));
    },

    // Event Handlers ----------------

    _userKeydownHandler: function(e) {
        this._performUserCommand(e);
    },

    _userKeyupHandler: function(e) {
        this._performUserCommand(e);
    },

    _playerCrashedHandler: function() {
        //log('_playerCrashedHandler. this:', this);
        this.gameOverTime = this.gameClock;
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
        if(!this.isGamePaused) {

            if(this.levelClock === 0) { // Level 1
                this.nextActionGameTime = this.LEVEL_FIRST_WAVE;
            } else if(this.levelClock == this.LEVEL_DURATION) { // Next level
                log('NEXT LEVEL!!!');
                this.levelClock = 0; //TODO: should this be -1 instead?
                this.attackLevel++;
                this.nextActionGameTime = this.LEVEL_FIRST_WAVE;
            } else if(this.levelClock >= this.nextActionGameTime) {
                this._setNextActionGameTime();
                this._addAttack();
                log('frame:', this.frameCount, 'game time:', this.gameClock, ' (', this.gameSeconds, 's)', 'level time:', this.levelClock, 'next action:', this.nextActionGameTime);
            }

            // Action for each frame
            if(this.isGameOn) {
                this.gameClock++;
                this.levelClock++;
                this.world.grow();
                this.world.optimise();
                this.world.collusionTest(this.gameClock);
                this.world.draw();
            }
        }
    },

    _addAttack: function() {
        this.world.addAttack(this.frameCount, this.attackType, this.attackLevel);
    },

    _setNextActionGameTime: function() {
        var baseInterval = 180;
        var minInterval = 20;
        var accelerationRate = 3;
        var nextInterval = baseInterval - Math.round(this.levelClock / 60 * accelerationRate);
        nextInterval = (nextInterval < minInterval) ? minInterval : nextInterval;
        log('nextInterval:', nextInterval);
        this.nextActionGameTime = this.levelClock + nextInterval;
    },

    _performUserCommand: function(e) {
        var command = Utils.GetInput(e.keyCode);
        if(command !== undefined) {
            if(e.type == 'keydown') {
                e.preventDefault();
                if(command == 'start') {
                    this.isGameStarted = true;
                } else if(command == 'pause') {
                    this.isGamePaused = !this.isGamePaused;
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
