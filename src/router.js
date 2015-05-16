var Marionette = require('backbone.marionette');
var Backbone = require("backbone");
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;
Marionette.$ = $;

/**
* @version 1.0.0
* @description Handle routes to show the active vs complete todo items.
* @module router
* @link {http://marionettejs.com/}
*/
module.exports = Marionette.AppRouter.extend({

    /** app routes */
    appRoutes: {
        '*filter': 'filterItems'
    }
});