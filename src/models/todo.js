var Backbone = require('backbone');

/**
* @version 1.0.0
* @description Todo Model
* @link {http://backbonejs.org/}
* @module models/todo
*/
module.exports = Backbone.Model.extend({

    /** defaults */
    defaults: {
        title: '',
        completed: false,
        created: 0
    },

    /**
     * @func initialize
     */
    initialize: function () {
        if (this.isNew()) {
            this.set('created', Date.now());
        }
    },

    /**
     * @func toggle
     * @returns {*}
     */
    toggle: function () {
        return this.set('completed', !this.isCompleted());
    },

    /**
     * @func isCompleted
     * @returns {*}
     */
    isCompleted: function () {
        return this.get('completed');
    },

    /**
     * @func matchesFilter
     * @param filter
     * @returns {*}
     */
    matchesFilter: function (filter) {
        if (filter === 'all') {
            return true;
        }

        if (filter === 'active') {
            return !this.isCompleted();
        }

        return this.isCompleted();
    }
});
