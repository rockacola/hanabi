//
// Site / View / Profile
//

'use strict';

// Dependencies
var log = require('bows')('Profile');
var App = require('ampersand-app');
var View = require('ampersand-view');
var Events = require('ampersand-events');
var Utils = require('../base/utils');



// View
// --------------------------------------------------

var ProfileView = View.extend({

    props: {
        currentPageUrl: ['string', false, document.URL],
        currentPageTitle: ['string', false, document.title],
        $toggle: 'element',
        $socialSharingCollection: 'object',
    },

    derived: {
    },

    bindings: {
    },

    events: {
        'click [data-hook="profile-toggle"]': '_profileToggleHandler',
    },

    initialize: function() {
        log('initialize()');
        // Arrange properties
        var _this = this;
        this.$toggle = this.queryByHook('profile-toggle');
        this.$socialSharingCollection = this.queryAllByHook('social-sharing');

        // Specific element event binding
        if(!Utils.isNullOrUndefinedOrEmpty(this.$socialSharingCollection)) {
            Utils.forEach(this.$socialSharingCollection, function($socialSharing) {
                $socialSharing.addEventListener('click', function(e) { _this._socialSharingClickHandler(e, $socialSharing); });
            });
        }
    },

    // Event Handlers ----------------

    _profileToggleHandler: function(e) {
        log('_profileToggleHandler');
        if(this.el.classList.contains('is-enable')) {
            this.el.classList.remove('is-enable');
        } else {
            this.el.classList.add('is-enable');
        }
    },

    _socialSharingClickHandler: function(e, $el) {
        e.preventDefault();

        var socialPlatform = $el.getAttribute('data-social-platform');

        //TODO: this can be refacrtor into a key-value pair array stored in Utils
        var href = '';
        if(socialPlatform == 'facebook') {
            href = 'https://www.facebook.com/sharer/sharer.php?u={url}&display=popup';
        } else if(socialPlatform == 'twitter') {
            href = 'https://twitter.com/intent/tweet?text={text}&url={url}';
        } else if(socialPlatform == 'google-plus') {
            href = 'https://plus.google.com/share?url={url}';
        }

        href = href.replace('{text}', encodeURIComponent(this.currentPageTitle))
            .replace('{url}', encodeURIComponent(this.currentPageUrl));

        var width   = 575,
            height  = 400,
            left    = (window.innerWidth  - width)  / 2,
            top     = (window.innerHeight - height) / 2,
            url     = href,
            options = 'status=1' +
                ',width='  + width  +
                ',height=' + height +
                ',top='    + top    +
                ',left='   + left;
        window.open(url, 'social-popup', options);
    },

    // Private Methods ----------------

    // Public Methods ----------------

});



// Exports
// --------------------------------------------------

module.exports = ProfileView;
