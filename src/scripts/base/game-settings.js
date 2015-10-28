//
// Site / Base / Game Settings
//

'use strict';

// Dependencies
var log = require('bows')('GameSettings');

// Base
// --------------------------------------------------

var GameSettings = {

    global: {
        randomSeed: 'rainboxsix', //TODO: Leave blank to generate seed randomly
        worldWidth: 800,
        worldHeight: 600,

        levelLength: 60*80, // Time length of each level
        firstLevelFirstWaveInterval: 120,
        levelFirstWaveInterval: 60*6, // Waiting time before the 1st wave starts in a new level




    },

    GetSetting: function(attackType) {
        return 0; //TODO
    },

};



// Exports
// --------------------------------------------------

module.exports = GameSettings;
