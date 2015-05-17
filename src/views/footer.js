var Marionette = require('marionette'),
    App = require('../app');

/**
* @version 1.0.0
* @description Footer View - requires the module {@link module:app}
* @module views/footer
* @requires module:app
* @link {http://marionettejs.com/}
*/
module.exports = FooterView = Marionette.ItemView.extend({

    /** template */
    template: '#template-footer',

    /**
    * @desc UI bindings create cached attributes that
    * point to jQuery selected objects
    */
    ui: {
        filters: '#filters a',
        completed: '.completed a',
        active: '.active a',
        all: '.all a',
        summary: '#todo-count',
        clear: '#clear-completed'
    },

    /** events */
    events: {
        'click @ui.clear': 'onClearClick'
    },

    /** collection events */
    collectionEvents: {
        all: 'render'
    },

    /** template helpers */
    templateHelpers: {
        activeCountLabel: function () {
            return (this.activeCount === 1 ? 'item' : 'items') + ' left';
        }
    },

    /**
     * @func initialize
     */
    initialize: function () {
        this.listenTo(App.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    },

    /**
     * @func serializeData
     * @returns {{activeCount: (*|number), totalCount: *, completedCount: number}}
     */
    serializeData: function () {
        var active = this.collection.getActive().length;
        var total = this.collection.length;

        return {
            activeCount: active,
            totalCount: total,
            completedCount: total - active
        };
    },

    /**
     * @func onRender
     */
    onRender: function () {
        this.$el.parent().toggle(this.collection.length > 0);
        this.updateFilterSelection();
    },

    updateFilterSelection: function () {
        this.ui.filters.removeClass('selected');
        this.ui[App.request('filterState').get('filter')]
            .addClass('selected');
    },

    /**
     * @func onClearClick
     */
    onClearClick: function () {
        var completed = this.collection.getCompleted();
        completed.forEach(function (todo) {
            todo.destroy();
        });
    }
});
