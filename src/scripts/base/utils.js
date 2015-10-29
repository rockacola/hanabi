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

    GetInput: function(keyCode) {
        if(keyCode == 38 || keyCode == 87) {
            return 'up';
        } else if (keyCode == 40 || keyCode == 83) {
            return 'down';
        } else if (keyCode == 37 || keyCode == 65) {
            return 'left';
        } else if (keyCode == 39 || keyCode == 68) {
            return 'right';
        } else if (keyCode == 80) {
            return 'pause';
        } else if (keyCode == 32) {
            return 'start';
        }

        //log('[ERROR] Unknown keyCode: ', keyCode);
        return undefined;
    },

    // Geometry  ----------------

    GetRadians: function(degreesValue) {
        return degreesValue * Math.PI / 180;
    },

    GetDegrees: function(radiansValue) {
        return radiansValue * 180 / Math.PI;
    },

    IsRectangleCircleColliding: function(rect, circle) {
        var distX = Math.abs(circle.x - rect.x-rect.w/2);
        var distY = Math.abs(circle.y - rect.y-rect.h/2);

        if (distX > (rect.w/2 + circle.r)) { return false; }
        if (distY > (rect.h/2 + circle.r)) { return false; }

        if (distX <= (rect.w/2)) { return true; }
        if (distY <= (rect.h/2)) { return true; }

        var dx=distX-rect.w/2;
        var dy=distY-rect.h/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
    },

    IsCircleCircleColliding: function(circle1, circle2) {
        var distance = Math.sqrt(
            Math.pow((circle1.x - circle2.x), 2) +
            Math.pow((circle1.y - circle2.y), 2)
        );
        return (distance <= (circle1.r + circle2.r));
    },

    // Validation ----------------

    IsNullOrUndefinedOrEmpty: function(obj) {
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
