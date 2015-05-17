var Marionette = require('marionette'),
    App = require('../app'),
    ItemView = require('./item');

/**
 * @version 1.0.0
 * @description Item List View - Controls the rendering of the items, including the
 * filtering of active vs completed items for display.
 * Requires the modules {@link module:app} and {@link module:module:views/item}.
 * @module views/list
 * @requires module:app
 * @requires module:views/item
 * @link {http://marionettejs.com/}
 */
module.exports = ListView = Marionette.CompositeView.extend({

    /** template */
    template: '#template-todoListCompositeView',

    /** child view */
    childView: ItemView,

    /** child view container */
    childViewContainer: '#todo-list',

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        toggle: '#toggle-all'
    },

    /** click events */
    events: {
        'click @ui.toggle': 'onToggleAllClick'
    },

    /** collection events */
    collectionEvents: {
        'change:completed': 'render',
        all: 'setCheckAllState'
    },

    /**
     * @func initialize
     */
    initialize: function () {
        this.listenTo(App.request('filterState'), 'change:filter', this.render, this);
    },

    /**
     * @func filter
     * @param child
     * @returns {*}
     */
    filter: function (child) {
        var filteredOn = App.request('filterState').get('filter');
        return child.matchesFilter(filteredOn);
    },

    /**
     * @func setCheckAllState
     */
    setCheckAllState: function () {

        /**
         * @func reduceCompleted
         * @param left
         * @param right
         * @returns {*}
         */
        function reduceCompleted(left, right) {
            return left && right.get('completed');
        }

        var allCompleted = this.collection.reduce(reduceCompleted, true);
        this.ui.toggle.prop('checked', allCompleted);
        this.$el.parent().toggle(!!this.collection.length);
    },

    /**
     * @desc toggle all click event handler
     * @func onToggleAllClick
     * @param e - event
     */
    onToggleAllClick: function (e) {
        var isChecked = e.currentTarget.checked;

        this.collection.each(function (todo) {
            todo.save({ completed: isChecked });
        });
    }
});
