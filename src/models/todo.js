var Backbone = require('backbone');

// Todo Model
// ----------
module.exports = TodoModel = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false,
        created: 0
    },

    initialize: function () {
        if (this.isNew()) {
            this.set('created', Date.now());
        }
    },

    toggle: function () {
        return this.set('completed', !this.isCompleted());
    },

    isCompleted: function () {
        return this.get('completed');
    },

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
