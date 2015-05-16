var Marionette = require('backbone.marionette');
var Backbone = require("backbone");
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;
Marionette.$ = $;

/**
 * @version 1.0.0
 * @description Header View
 * @module views/header
 * @link {http://marionettejs.com/}
 */
module.exports = Marionette.ItemView.extend({
    template: '#template-header',

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        input: '#new-todo'
    },

    /** keypress and keyup events */
    events: {
        'keypress @ui.input': 'onInputKeypress',
        'keyup @ui.input': 'onInputKeyup'
    },

    /**
     * @description According to the spec
     * If escape is pressed during the edit, the edit
     * state should be left and any changes be discarded.
     * @func onInputKeyup
     * @desc key up event handler
     * @param e - event
     */
    onInputKeyup: function (e) {
        var ESC_KEY = 27;

        if (e.which === ESC_KEY) {
            this.render();
        }
    },

    /**
     * @func onInputKeypress
     * @desc key press event handler
     * @param e - event
     */
    onInputKeypress: function (e) {
        var ENTER_KEY = 13;
        var todoText = this.ui.input.val().trim();

        if (e.which === ENTER_KEY && todoText) {
            this.collection.create({
                title: todoText
            });
            this.ui.input.val('');
        }
    }
});
