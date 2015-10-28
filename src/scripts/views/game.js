//
// Site / View / Game
//

'use strict';

// Dependencies
var log = require('bows')('Game');
var App = require('ampersand-app');
var View = require('ampersand-view');
var Utils = require('../base/utils');
var Rng = require('../base/rng');
var GameSettings = require('../base/game-settings');
var WorldView = require('./world');



// View
// --------------------------------------------------

var GameView = View.extend({

    props: {
        version: 'string',
        rng: 'object',
        world: 'object',

        frameCount: ['number', true, 0],
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
                var text = 'Running, press [P] to pause.';
                if(!this.isGameStarted) {
                    text = 'Press [SPACE] to start the game, [P] to pause.';
                } else if(this.isGameOver) {
                    text = 'Game over. Refresh page to restart';
                } else if(this.isGamePaused) {
                    text = 'Paused, press [P] to resume.';
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
        levelProgress: {
            deps: ['levelClock'],
            fn: function() {
                return (this.levelClock / GameSettings.global.levelLength);
            }
        },
        levelProgressLabel: {
            deps: ['levelProgress'],
            fn: function() {
                return Math.floor(this.levelProgress * 100) + '%';
            }
        },
        levelProgressStyleValue: {
            deps: ['levelProgress'],
            fn: function() {
                return 'width: ' + Math.floor(this.levelProgress * 10000)/100 + '%;';
            }
        },
    },

    bindings: {
        'version': {
            type: 'text',
            hook: 'version'
        },
        'attackType': {
            type: 'text',
            hook: 'level-type'
        },
        'gameClock': {
            type: 'text',
            hook: 'game-time'
        },
        'attackLevel': {
            type: 'text',
            hook: 'game-level'
        },
        'statusDescription': {
            type: 'text',
            hook: 'status-description'
        },
        'levelProgressLabel': {
            type: 'text',
            hook: 'level-progress-label'
        },
        'levelProgressStyleValue': {
            type: 'attribute',
            name: 'style',
            hook: 'level-progress-fill'
        },
    },

    events: {
    },

    initialize: function() {
        log('initialize()');

        // Bootstrap
        this.version = App.version;
        this.rng = new Rng({ seed: GameSettings.global.randomSeed });
        this.world = new WorldView({
            parent: this, el: document.querySelector('[data-hook="drawing-board"]'),
            settings: GameSettings.global,
            width: GameSettings.global.worldWidth,
            height: GameSettings.global.worldHeight
        });
        this.world.addPlayer(
            this.el.querySelector('.resources .player-image').src,
            this.el.querySelector('.resources .player-active-image').src
        );

        // Init setup
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
                //this.nextActionGameTime = this.LEVEL_FIRST_WAVE;
                this.nextActionGameTime = GameSettings.global.firstLevelFirstWaveInterval;
            } else if(this.levelClock == GameSettings.global.levelLength) { // Next level
                this.levelClock = 0; //TODO: should this be -1 instead?
                this.attackLevel++;
                this.nextActionGameTime = GameSettings.global.levelFirstWaveInterval;
                log('NEXT LEVEL: ', this.attackLevel);
            } else if(this.levelClock >= this.nextActionGameTime) {
                this._setNextActionGameTime();
                this._addAttack();
                //log('frame:', this.frameCount, 'game time:', this.gameClock, ' (', this.gameSeconds, 's)', 'level time:', this.levelClock, 'next action:', this.nextActionGameTime);
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
        var minInterval = 30;
        var accelerationRate = 2.5;
        var nextInterval = baseInterval - Math.round(this.levelClock / 60 * accelerationRate);
        nextInterval = (nextInterval < minInterval) ? minInterval : nextInterval;
        //log('nextInterval:', nextInterval);
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

module.exports = GameView;
