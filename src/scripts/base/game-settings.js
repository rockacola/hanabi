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
        firstLevelFirstWaveInterval: 60*2,
        levelFirstWaveInterval: 60*6, // Waiting time before the 1st wave starts in a new level

        playerSize: 20,
        playerVelocity: 3,
        collusionTolerance: 0.55, // 0 for as soon as touching it, 0.1 for 10% of intersection, 1 for center-to-center matching (highest tolerance).
    },

    attacks: {
        peony: {
            baseInterval: 180,
            minInterval: 30,
            accelerationRate: 2.5,
        },
        laser: {
            baseInterval: 120,
            minInterval: 6,
            accelerationRate: 2,
        },
    },

    GetSetting: function(attackType) {
        return 0; //TODO
    },

};



// Exports
// --------------------------------------------------

module.exports = GameSettings;
