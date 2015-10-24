//
// Site / Base / Utils
//

'use strict';

// Dependencies
var log = require('bows')('Utils');

// Base
// --------------------------------------------------

var Utils = {

    // Lodash Utils ----------------

    forEach: require('lodash/collection/forEach'),
    assign: require('lodash/object/assign'),
    random: require('lodash/number/random'),
    remove: require('lodash/array/remove'),

    // NPM Libraries ----------------

    raf: require('raf'),
    ua: require('universal-analytics'),
    //xhr: require('xhr'),

    // Game Control ----------------

    getInputDirection: function(keyCode) {
        if(keyCode == 38 || keyCode == 87) {
            return 'up';
        } else if (keyCode == 40 || keyCode == 83) {
            return 'down';
        } else if (keyCode == 37 || keyCode == 65) {
            return 'left';
        } else if (keyCode == 39 || keyCode == 68) {
            return 'right';
        } else {
            return undefined;
        }
    },

    // Geometry  ----------------

    GetRadians: function(degreesValue) {
        return degreesValue * Math.PI / 180;
    },

    GetDegrees: function(radiansValue) {
        return radiansValue * 180 / Math.PI;
    },

    // Validation ----------------

    isNullOrUndefinedOrEmpty: function(obj) {
        if(obj === undefined || obj === null) {
            return true;
        } else if(obj.length <= 0) {
            return true;
        }
        return false;
    },

    // Misc ----------------
};



// Exports
// --------------------------------------------------

module.exports = Utils;
