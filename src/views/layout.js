var Marionette = require('backbone.marionette');
var Backbone = require("backbone");
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;
Marionette.$ = $;

/**
 * @version 1.0.0
 * @description Layout View - Root layout view.
 * @module views/layout
 * @link {http://marionettejs.com/}
 */
module.exports = Marionette.LayoutView.extend({

    /** el */
    el: '#todoapp',

    /** regions */
    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    }
});